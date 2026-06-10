import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// GET /api/admin/users — list all users with profile data
export async function GET() {
  const supabase = createServiceClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get auth user emails
  const userIds = profiles?.map((p) => p.id) || [];
  let emails: Record<string, string> = {};

  if (userIds.length > 0) {
    const { data: authUsers } = await supabase.auth.admin.listUsers({
      perPage: 100,
    });
    if (authUsers?.users) {
      for (const u of authUsers.users) {
        emails[u.id] = u.email || "unknown";
      }
    }
  }

  const users = profiles?.map((p) => ({
    id: p.id,
    email: emails[p.id] || "unknown",
    subscription_tier: p.subscription_tier || "free",
    trial_started_at: p.trial_started_at,
    creem_customer_id: p.creem_customer_id,
    created_at: p.created_at,
    updated_at: p.updated_at,
  }));

  return NextResponse.json({ users });
}

// PATCH /api/admin/users — update user subscription tier
export async function PATCH(request: Request) {
  const supabase = createServiceClient();

  let body: { userId: string; tier: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { userId, tier } = body;

  if (!userId || !tier) {
    return NextResponse.json({ error: "userId and tier required" }, { status: 400 });
  }

  const validTiers = ["free", "pro", "lifetime"];
  if (!validTiers.includes(tier)) {
    return NextResponse.json({ error: `Invalid tier. Must be: ${validTiers.join(", ")}` }, { status: 400 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({ subscription_tier: tier })
    .eq("id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, userId, tier });
}
