import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { hasSupabaseAuthCookie } from "@/lib/supabase/auth-cookie";
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isAdminDemoMode,
} from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/types";

function isPublicAdminPath(pathname: string) {
  return (
    pathname === "/admin/login" ||
    pathname === "/admin/login/submit" ||
    pathname === "/admin/forgot-password" ||
    pathname === "/admin/forgot-password/submit" ||
    pathname === "/admin/reset-password"
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAdminDemoMode()) {
    if (isPublicAdminPath(pathname)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next({ request });
  }

  const supabaseUrl = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  if (!supabaseUrl || !anonKey) {
    if (!isPublicAdminPath(pathname)) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const pendingCookies: Array<{
    name: string;
    value: string;
    options?: Parameters<NextResponse["cookies"]["set"]>[2];
  }> = [];

  const supabase = createServerClient<Database>(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        pendingCookies.splice(0, pendingCookies.length, ...cookiesToSet);
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  if (!isPublicAdminPath(pathname) && !hasSupabaseAuthCookie(request)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isPublicAdminPath(pathname)) {
    return response;
  }

  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const { data: profile, error } = await supabase
    .from("admin_profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile) {
    await supabase.auth.signOut();
    const redirectResponse = NextResponse.redirect(
      new URL("/admin/login", request.url),
    );
    pendingCookies.forEach(({ name, value, options }) => {
      redirectResponse.cookies.set(name, value, options);
    });
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
