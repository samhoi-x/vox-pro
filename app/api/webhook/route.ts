import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { createHmac } from "crypto";

function verifyCreemSignature(
  payload: string,
  secret: string,
  signature: string,
): boolean {
  const computed = createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return computed === signature;
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("creem-signature");
  const webhookSecret = process.env.CREEM_WEBHOOK_SECRET!;

  if (!signature || !verifyCreemSignature(body, webhookSecret, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = createServiceClient();

  try {
    switch (event.type) {
      case "checkout.completed": {
        // A checkout session was completed (one-time or subscription)
        const userId = event.data?.metadata?.user_id;
        const orderId = event.data?.order_id;
        const subscriptionId = event.data?.subscription_id;

        if (userId && orderId) {
          // If this is a subscription checkout
          if (subscriptionId) {
            const subData = event.data?.subscription;
            await supabase.from("subscriptions").upsert({
              user_id: userId,
              creem_subscription_id: subscriptionId,
              creem_product_id: event.data?.product_id,
              status: "active",
              current_period_start: subData?.current_period_start
                ? new Date(subData.current_period_start).toISOString()
                : new Date().toISOString(),
              current_period_end: subData?.current_period_end
                ? new Date(subData.current_period_end).toISOString()
                : null,
            });

            await supabase
              .from("profiles")
              .update({ subscription_tier: "pro" })
              .eq("id", userId);
          }

          // Store the Creem order ID on the profile for reference
          await supabase
            .from("profiles")
            .update({ creem_customer_id: event.data?.customer_id || null })
            .eq("id", userId);
        }
        break;
      }

      case "subscription.active":
      case "subscription.paid": {
        const subscription = event.data;
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("creem_subscription_id", subscription?.id)
          .single();

        if (sub && subscription) {
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
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("creem_subscription_id", subscription?.id)
          .single();

        if (sub) {
          await supabase
            .from("subscriptions")
            .update({ status: "canceled" })
            .eq("creem_subscription_id", subscription.id);

          await supabase
            .from("profiles")
            .update({ subscription_tier: "free" })
            .eq("id", sub.user_id);
        }
        break;
      }

      case "subscription.past_due": {
        const subscription = event.data;
        await supabase
          .from("subscriptions")
          .update({ status: "past_due" })
          .eq("creem_subscription_id", subscription?.id);
        break;
      }
    }
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
