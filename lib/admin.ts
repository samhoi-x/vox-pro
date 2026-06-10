import { createServerSupabase } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "iatsam@gmail.com";

// Returns the authenticated admin user, or null when the caller is not the admin.
export async function requireAdmin() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) return null;
  return user;
}

// auth.admin.listUsers is paginated — page through all users to build
// a complete id → email map.
export async function fetchAllAuthEmails(
  supabase: SupabaseClient,
): Promise<Record<string, string>> {
  const emails: Record<string, string> = {};
  const perPage = 1000;
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error || !data?.users?.length) break;
    for (const u of data.users) emails[u.id] = u.email || "unknown";
    if (data.users.length < perPage) break;
  }
  return emails;
}
