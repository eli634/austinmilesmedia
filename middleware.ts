import { NextResponse, type NextRequest } from "next/server";

import { hasSupabaseAuthCookie } from "@/lib/supabase/auth-cookie";
import { getSupabaseAnonKey, getSupabaseUrl, isAdminDemoMode } from "@/lib/supabase/env";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
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

  if (!getSupabaseUrl() || !getSupabaseAnonKey()) {
    if (isAdminRoute && !isLoginRoute) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return response;
  }

  if (!isAdminRoute || isLoginRoute) {
    return response;
  }

  if (!hasSupabaseAuthCookie(request)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
