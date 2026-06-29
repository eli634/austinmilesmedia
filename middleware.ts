import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isAdminDemoMode,
} from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/types";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute =
    request.nextUrl.pathname === "/admin/login" ||
    request.nextUrl.pathname === "/admin/login/submit";

  if (isAdminRoute && isAdminDemoMode()) {
    if (isLoginRoute) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return response;
  }

  if (!url || !anonKey) {
    if (isAdminRoute && !isLoginRoute) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return response;
  }

  if (isLoginRoute) {
    return response;
  }

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response = NextResponse.next({ request });
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminRoute) {
    return response;
  }

  if (!user) {
    if (isLoginRoute) {
      return response;
    }

    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.auth.signOut();

    return NextResponse.redirect(
      new URL(
        "/admin/login?error=This%20user%20is%20not%20authorized%20for%20Austin%20admin.",
        request.url,
      ),
    );
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
