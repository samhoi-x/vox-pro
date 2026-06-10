import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

// POST /api/billing — generate Creem customer portal link for subscription management
export async function POST() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "請先登入" }, { status: 401 });
  }

  // Get user's Creem customer ID and subscription
  const { data: profile } = await supabase
    .from("profiles")
    .select("creem_customer_id, subscription_tier")
    .eq("id", user.id)
    .single();

  if (!profile?.creem_customer_id) {
    return NextResponse.json({ error: "找不到付款記錄" }, { status: 404 });
  }

  if (profile.subscription_tier !== "pro") {
    return NextResponse.json({ error: "只有 Pro 訂閱用戶可以管理訂閱" }, { status: 403 });
  }

  // Call Creem API to generate customer portal link
  const apiKey = process.env.CREEM_API_KEY!;
  const isTest = process.env.NODE_ENV !== "production";
  const baseUrl = isTest ? "https://test-api.creem.io" : "https://api.creem.io";

  try {
    const res = await fetch(`${baseUrl}/v1/customers/billing`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customer_id: profile.creem_customer_id }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Creem billing portal error:", err);
      return NextResponse.json(
        { error: "無法生成管理連結，請稍後再試" },
        { status: 500 },
      );
    }

    const data = await res.json();
    return NextResponse.json({ url: data.customer_portal_link });
  } catch (err) {
    console.error("Creem billing portal exception:", err);
    return NextResponse.json(
      { error: "無法連接付款系統" },
      { status: 500 },
    );
  }
}
