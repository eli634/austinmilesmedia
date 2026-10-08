import type { NextRequest } from "next/server";

type AuthCookie = { name: string; value: string };

const AUTH_COOKIE_NAME = /^(sb-.+-auth-token)(?:\.(\d+))?$/;
const REFRESH_WINDOW_MS = 60_000;

export function hasSupabaseAuthCookie(request: NextRequest) {
  return request.cookies.getAll().some((cookie) => AUTH_COOKIE_NAME.test(cookie.name));
}

export function authSessionNeedsRefresh(cookies: AuthCookie[]) {
  const expiresAt = readAuthExpiresAt(cookies);

  if (!expiresAt) {
    return true;
  }

  return expiresAt * 1000 <= Date.now() + REFRESH_WINDOW_MS;
}

function readAuthExpiresAt(cookies: AuthCookie[]) {
  const groups = new Map<string, Map<number, string>>();

  for (const cookie of cookies) {
    const match = cookie.name.match(AUTH_COOKIE_NAME);

    if (!match) {
      continue;
    }

    const key = match[1];
    const index = match[2] == null ? 0 : Number(match[2]);
    const chunks = groups.get(key) ?? new Map<number, string>();
    chunks.set(index, cookie.value);
    groups.set(key, chunks);
  }

  for (const chunks of groups.values()) {
    const value = [...chunks.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([, chunk]) => chunk)
      .join("");
    const expiresAt = readExpiry(value);

    if (expiresAt) {
      return expiresAt;
    }
  }

  return null;
}

function readExpiry(value: string) {
  const decoded = value.startsWith("base64-")
    ? decodeBase64Url(value.slice("base64-".length))
    : value;

  if (!decoded) {
    return null;
  }

  try {
    const session = JSON.parse(decoded) as {
      expires_at?: number;
      access_token?: string;
    };

    if (typeof session.expires_at === "number") {
      return session.expires_at;
    }

    if (!session.access_token) {
      return null;
    }

    const payload = session.access_token.split(".")[1];

    if (!payload) {
      return null;
    }

    const claims = JSON.parse(decodeBase64Url(payload) ?? "") as { exp?: number };

    return typeof claims.exp === "number" ? claims.exp : null;
  } catch {
    return null;
  }
}

function decodeBase64Url(value: string) {
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/");
    const base64 = padded.padEnd(Math.ceil(padded.length / 4) * 4, "=");
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}
