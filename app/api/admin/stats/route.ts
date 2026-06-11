import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = "iatsam@gmail.com";

// GET /api/admin/stats — aggregate dashboard statistics (admin only)
export async function GET() {
  // ── Auth guard ──
  const authSupabase = await createServerSupabase();
  const { data: { user } } = await authSupabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  // Get all profiles
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const now = new Date();

  // Tier counts
  const tierCounts = { free: 0, pro: 0, lifetime: 0 };
  let trialActive = 0;
  let trialExpired = 0;
  const recentSignups: any[] = [];

  for (const p of profiles || []) {
    tierCounts[p.subscription_tier as keyof typeof tierCounts] =
      (tierCounts[p.subscription_tier as keyof typeof tierCounts] || 0) + 1;

    // Trial status
    if (p.trial_started_at && p.subscription_tier === "free") {
      const trialEnd = new Date(
        new Date(p.trial_started_at).getTime() + 72 * 60 * 60 * 1000,
      );
      if (now < trialEnd) {
        trialActive++;
      } else {
        trialExpired++;
      }
    }

    // Recent signups (last 7 days)
    if (p.created_at) {
      const created = new Date(p.created_at);
      const daysAgo = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      if (daysAgo <= 7) {
        recentSignups.push({
          id: p.id,
          tier: p.subscription_tier,
          created_at: p.created_at,
        });
      }
    }
  }

  // Get auth user emails — paginated to handle >100 users
  const emails = await fetchAllAuthEmails(supabase);

  // Top recent users with email
  const topRecent = recentSignups.slice(0, 10).map((u) => ({
    ...u,
    email: emails[u.id] || "unknown",
  }));

  return NextResponse.json({
    totalUsers: profiles?.length || 0,
    tierCounts,
    trialActive,
    trialExpired,
    recentSignups: topRecent,
    dailySignups: getDailySignups(profiles || [], now),
  });
}

function getDailySignups(profiles: any[], now: Date) {
  const days: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days[key] = 0;
  }

  for (const p of profiles) {
    if (!p.created_at) continue;
    const key = new Date(p.created_at).toISOString().slice(0, 10);
    if (days[key] !== undefined) {
      days[key]++;
    }
  }

  return Object.entries(days).map(([date, count]) => ({ date, count }));
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
