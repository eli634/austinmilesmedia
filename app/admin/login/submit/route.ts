import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { createAdminClient, hasAdminSupabaseEnv } from "@/lib/supabase/admin";
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  hasSupabaseEnv,
} from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/types";

function loginRedirect(request: NextRequest, message: string) {
  const url = new URL("/admin/login", request.url);
  url.searchParams.set("error", message);

  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!hasSupabaseEnv()) {
    return loginRedirect(request, "Supabase env vars are missing.");
  }

  if (!hasAdminSupabaseEnv()) {
    return loginRedirect(request, "Supabase service role env var is missing.");
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
    return loginRedirect(request, result.error.message);
  }

  const user = "data" in result ? result.data.user : null;

  if (!user?.email) {
    return loginRedirect(request, "Login succeeded, but no session was created.");
  }

  const adminSupabase = createAdminClient();
  const { data: profile, error: profileError } = await adminSupabase
    .from("admin_profiles")
    .select("id,email")
    .eq("email", user.email)
    .maybeSingle();

  if (profileError) {
    return loginRedirect(request, profileError.message);
  }

  if (!profile) {
    await supabase.auth.signOut();

    return loginRedirect(request, "This email is not authorized for Austin admin.");
  }

  if (profile.id !== user.id) {
    const { error: updateError } = await adminSupabase
      .from("admin_profiles")
      .update({ id: user.id, email: user.email })
      .eq("email", user.email);

    if (updateError) {
      await supabase.auth.signOut();

      return loginRedirect(request, updateError.message);
    }
  }

  return response;
}
