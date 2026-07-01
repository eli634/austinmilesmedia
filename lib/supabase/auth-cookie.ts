import type { NextRequest } from "next/server";

export function hasSupabaseAuthCookie(request: NextRequest) {
  return request.cookies.getAll().some(
    (cookie) =>
      cookie.name.startsWith("sb-") && cookie.name.includes("auth-token"),
  );
}
