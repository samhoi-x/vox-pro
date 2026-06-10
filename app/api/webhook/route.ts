import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { createHmac, timingSafeEqual } from "crypto";
import { getTierForProduct } from "@/lib/creem";

function verifyCreemSignature(
  payload: string,
  secret: string,
  signature: string,
): boolean {
  const computed = createHmac("sha256", secret)
    .update(payload)
    .digest();
  const provided = Buffer.from(signature, "hex");
  return (
    provided.length === computed.length && timingSafeEqual(computed, provided)
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("creem-signature");
  const webhookSecret = process.env.CREEM_WEBHOOK_SECRET!;

  if (!signature || !verifyCreemSignature(body, webhookSecret, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  interface CreemEvent {
    type?: string;
    data?: {
      id?: string;
      metadata?: { user_id?: string; product_id?: string };
      order_id?: string;
      subscription_id?: string;
      product_id?: string;
      customer_id?: string;
      current_period_start?: string;
      current_period_end?: string;
      subscription?: {
        current_period_start?: string;
        current_period_end?: string;
      };
    };
  }

  let event: CreemEvent;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = createServiceClient();

  try {
    switch (event.type) {
      case "checkout.completed": {
        const userId = event.data?.metadata?.user_id;
        const orderId = event.data?.order_id;
        const subscriptionId = event.data?.subscription_id;
        const productId = event.data?.product_id || event.data?.metadata?.product_id;
        const tier = getTierForProduct(productId);

        if (!userId || !orderId) break;

        // ── Subscription checkout (monthly pro) ──
        if (subscriptionId) {
          const subData = event.data?.subscription;
          // onConflict makes retried webhooks update the existing row instead
          // of failing on the creem_subscription_id unique constraint
          await supabase.from("subscriptions").upsert(
            {
              user_id: userId,
              creem_subscription_id: subscriptionId,
              creem_product_id: productId,
              status: "active",
              current_period_start: subData?.current_period_start
                ? new Date(subData.current_period_start).toISOString()
                : new Date().toISOString(),
              current_period_end: subData?.current_period_end
                ? new Date(subData.current_period_end).toISOString()
                : null,
            },
            { onConflict: "creem_subscription_id" },
          );

          await supabase
            .from("profiles")
            .update({ subscription_tier: tier || "pro" })
            .eq("id", userId);
        }

        // ── One-time / lifetime checkout ──
        if (!subscriptionId && tier === "lifetime") {
          await supabase
            .from("profiles")
            .update({ subscription_tier: "lifetime" })
            .eq("id", userId);
        }

        // Store Creem customer ID
        await supabase
          .from("profiles")
          .update({ creem_customer_id: event.data?.customer_id || null })
          .eq("id", userId);

        break;
      }

      case "subscription.active":
      case "subscription.paid": {
        const subscription = event.data;
        if (!subscription?.id) break;

        const { data: sub } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("creem_subscription_id", subscription.id)
          .single();

        if (sub) {
          await supabase
            .from("subscriptions")
            .update({
              status: "active",
              current_period_start: subscription.current_period_start
                ? new Date(subscription.current_period_start).toISOString()
                : undefined,
              current_period_end: subscription.current_period_end
                ? new Date(subscription.current_period_end).toISOString()
                : undefined,
            })
            .eq("creem_subscription_id", subscription.id);
        }
        break;
      }

      case "subscription.canceled":
      case "subscription.expired": {
        const subscription = event.data;
        if (!subscription?.id) break;

        const { data: sub } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("creem_subscription_id", subscription.id)
          .single();

        if (!sub) break;

        await supabase
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("creem_subscription_id", subscription.id);

        // 🛡️ Never downgrade lifetime users
        const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_tier")
          .eq("id", sub.user_id)
          .single();

        if (profile?.subscription_tier !== "lifetime") {
          await supabase
            .from("profiles")
            .update({ subscription_tier: "free" })
            .eq("id", sub.user_id);
        }
        break;
      }

      case "subscription.past_due": {
        const subscription = event.data;
        if (!subscription?.id) break;

        await supabase
          .from("subscriptions")
          .update({ status: "past_due" })
          .eq("creem_subscription_id", subscription.id);
        break;
      }
    }
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
