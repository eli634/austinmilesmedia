import { createServerClient } from "@supabase/ssr";
import { setDefaultResultOrder } from "node:dns";
import { NextResponse, type NextRequest } from "next/server";

import { createAdminClient, hasAdminSupabaseEnv } from "@/lib/supabase/admin";
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  hasSupabaseEnv,
} from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/types";

export const runtime = "nodejs";
export const maxDuration = 30;

setDefaultResultOrder("ipv4first");

async function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  try {
    return await fetch(input, init);
  } catch {
    return await fetch(input, init);
  }
}

function loginRedirect(request: NextRequest, message: string) {
  const url = new URL("/admin/login", request.url);
  url.searchParams.set("error", message);

  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!hasSupabaseEnv() || !hasAdminSupabaseEnv()) {
    return loginRedirect(request, "Sign-in is unavailable right now.");
  }

  if (!email || !password) {
    return loginRedirect(request, "Email and password are required.");
  }

  const response = NextResponse.redirect(new URL("/admin", request.url), {
    status: 303,
  });

  const supabase = createServerClient<Database>(
    getSupabaseUrl()!,
    getSupabaseAnonKey()!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
      global: {
        fetch: authFetch,
      },
    },
  );

  const result = await Promise.race([
    supabase.auth.signInWithPassword({ email, password }),
    new Promise<{ error: { message: string } }>((resolve) =>
      setTimeout(
        () =>
          resolve({
            error: {
              message: "Login timed out. Check Supabase settings and try again.",
            },
          }),
        12000,
      ),
    ),
  ]);

  if (result.error) {
    const unreachable =
      /fetch failed|failed to fetch|enotfound|econnrefused|network|timed out/i.test(
        result.error.message,
      );

    console.error("[AMM] Admin login failed");

    return loginRedirect(
      request,
      unreachable
        ? "Sign-in is unavailable right now."
        : "Email or password is incorrect.",
    );
  }

  const user = "data" in result ? result.data.user : null;

  if (!user?.email) {
    return loginRedirect(request, "Sign-in is unavailable right now.");
  }

  const adminSupabase = createAdminClient();
  const { data: profile, error: profileError } = await adminSupabase
    .from("admin_profiles")
    .select("id,email")
    .eq("email", user.email)
    .maybeSingle();

  if (profileError) {
    console.error("[AMM] Admin profile lookup failed");
    await supabase.auth.signOut();

    return loginRedirect(request, "Sign-in is unavailable right now.");
  }

  if (!profile || profile.id !== user.id) {
    await supabase.auth.signOut();

    return loginRedirect(request, "This account cannot access admin.");
  }

  return response;
}
