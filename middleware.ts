import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TRIAL_HOURS = 72;

export async function middleware(request: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  const isProtected = request.nextUrl.pathname.startsWith("/dashboard");
  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isPaywall = request.nextUrl.pathname.startsWith("/paywall");

  // ── Auth guard: redirect unauthenticated users to /login ──
  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from login page
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ── Trial expiration check (authenticated users on /dashboard) ──
  if (isProtected && user) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_tier, trial_started_at")
        .eq("id", user.id)
        .maybeSingle();

      const tier = profile?.subscription_tier || "free";

      // Paid users always pass through
      if (tier === "pro" || tier === "lifetime") {
        return NextResponse.next();
      }

      // Free user — check trial
      const trialStartedAt = profile?.trial_started_at;
      if (trialStartedAt) {
        const trialEnd = new Date(
          new Date(trialStartedAt).getTime() + TRIAL_HOURS * 60 * 60 * 1000,
        );
        if (new Date() > trialEnd) {
          // Trial expired → redirect to paywall
          const paywallUrl = new URL("/paywall", request.url);
          return NextResponse.redirect(paywallUrl);
        }
      }
      // No trial_started_at or trial still active → allow
    } catch (err) {
      // If DB query fails, allow through (fail open — don't block real users)
      console.error("middleware trial check failed:", err);
    }
  }

  // Don't redirect paywall page itself (allows logged-in paid users to not be stuck)
  if (isPaywall && user) {
    // Check if user is actually paid — if so, redirect to dashboard
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.subscription_tier === "pro" || profile?.subscription_tier === "lifetime") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      // Fail open
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/paywall"],
};
