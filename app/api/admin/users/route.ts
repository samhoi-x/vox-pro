import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = "iatsam@gmail.com";

// GET /api/admin/users — list all users with profile data (admin only)
export async function GET() {
  // ── Auth guard ──
  const authSupabase = await createServerSupabase();
  const { data: { user } } = await authSupabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get auth user emails — paginated to handle >100 users
  const emails = await fetchAllAuthEmails(supabase);

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

// PATCH /api/admin/users — update user subscription tier (admin only)
export async function PATCH(request: Request) {
  // ── Auth guard ──
  const authSupabase = await createServerSupabase();
  const { data: { user } } = await authSupabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

// Helper: fetch all auth user emails with pagination (handles >100 users)
async function fetchAllAuthEmails(supabase: ReturnType<typeof createServiceClient>) {
  const emails: Record<string, string> = {};
  let page = 1;
  const perPage = 100;

  while (true) {
    const { data } = await supabase.auth.admin.listUsers({ perPage, page });
    if (!data?.users || data.users.length === 0) break;

    for (const u of data.users) {
      emails[u.id] = u.email || "unknown";
    }

    if (data.users.length < perPage) break;
    page++;
  }

  return emails;
}
