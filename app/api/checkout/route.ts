import { NextResponse } from "next/server";
import { creem, PRO_MONTHLY_ID, PAID_PRODUCT_IDS } from "@/lib/creem";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "請先登入" }, { status: 401 });
  }

  // Accept productId from body; default to monthly subscription
  let productId: string;
  try {
    const body = await request.json();
    productId = body.productId || PRO_MONTHLY_ID;
  } catch {
    productId = PRO_MONTHLY_ID;
  }

  // Validate product ID
  if (!PAID_PRODUCT_IDS.has(productId)) {
    return NextResponse.json({ error: "無效的產品" }, { status: 400 });
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const checkout = await creem.checkouts.create({
      productId,
      successUrl: `${origin}/dashboard?checkout=success`,
      customer: {
        email: user.email || undefined,
      },
      metadata: {
        user_id: user.id,
        product_id: productId,
      },
    });

    return NextResponse.json({ url: checkout.checkoutUrl });
  } catch (error: any) {
    console.error("Creem checkout error:", error);
    return NextResponse.json(
      { error: error.message || "建立付款連結失敗" },
      { status: 500 },
    );
  }
}
