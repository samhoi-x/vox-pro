import { NextResponse } from "next/server";
import { creem, PRO_PRODUCT_ID } from "@/lib/creem";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "請先登入" }, { status: 401 });
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const checkout = await creem.checkouts.create({
      productId: PRO_PRODUCT_ID,
      successUrl: `${origin}/dashboard?checkout=success`,
      customer: {
        email: user.email || undefined,
      },
      metadata: {
        user_id: user.id,
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
