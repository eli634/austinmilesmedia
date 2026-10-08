import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { createAdminClient, hasAdminSupabaseEnv } from "@/lib/supabase/admin";
import { getSupabaseAnonKey, getSupabaseUrl, hasSupabaseEnv } from "@/lib/supabase/env";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const attempts = new Map<string, number[]>();

function isRateLimited(request: NextRequest) {
  const key =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recent.length >= RATE_LIMIT_MAX) {
    attempts.set(key, recent);
    return true;
  }

  attempts.set(key, [...recent, now]);
  return false;
}

function redirectToForgot(request: NextRequest, params: Record<string, string>) {
  const url = new URL("/admin/forgot-password", request.url);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(request: NextRequest) {
  if (!hasSupabaseEnv() || !hasAdminSupabaseEnv()) {
    return redirectToForgot(request, {
      error: "Password reset is unavailable right now.",
    });
  }

  if (isRateLimited(request)) {
    return redirectToForgot(request, { sent: "1" });
  }

  const formData = await request.formData();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return redirectToForgot(request, { sent: "1" });
  }

  const admin = createAdminClient();
  const { data: profile, error: profileError } = await admin
    .from("admin_profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (profileError) {
    console.error("[AMM] Admin password reset lookup failed");
    return redirectToForgot(request, {
      error: "Password reset is unavailable right now.",
    });
  }

  if (profile) {
    const supabase = createClient(getSupabaseUrl()!, getSupabaseAnonKey()!, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const redirectTo = `${new URL(request.url).origin}/admin/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      console.error("[AMM] Password reset email failed:", error.message);
    }
  }

  return redirectToForgot(request, { sent: "1" });
}
