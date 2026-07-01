function readEnv(name: string) {
  const value = process.env[name]?.trim();

  return value && !value.includes("<") ? value : undefined;
}

export function getSupabaseUrl() {
  return (
    readEnv("NEXT_PUBLIC_SUPABASE_URL") ?? readEnv("SUPABASE_URL")
  );
}

export function getSupabaseAnonKey() {
  return (
    readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ?? readEnv("SUPABASE_ANON_KEY")
  );
}

export function hasSupabaseEnv() {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export function getSupabaseEnvDiagnostics() {
  const url =
    readEnv("NEXT_PUBLIC_SUPABASE_URL") ?? readEnv("SUPABASE_URL");
  const anonKey =
    readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ?? readEnv("SUPABASE_ANON_KEY");
  const serviceRoleKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");

  const missing: string[] = [];

  if (!url) {
    if (!readEnv("NEXT_PUBLIC_SUPABASE_URL") && !readEnv("SUPABASE_URL")) {
      missing.push("NEXT_PUBLIC_SUPABASE_URL");
    } else {
      missing.push("SUPABASE_URL (invalid or placeholder value)");
    }
  }

  if (!anonKey) {
    if (
      !readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") &&
      !readEnv("SUPABASE_ANON_KEY")
    ) {
      missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    } else {
      missing.push("SUPABASE_ANON_KEY (invalid or placeholder value)");
    }
  }

  if (!serviceRoleKey) {
    missing.push("SUPABASE_SERVICE_ROLE_KEY");
  }

  return {
    configured: Boolean(url && anonKey),
    loginReady: Boolean(url && anonKey && serviceRoleKey),
    missing,
    runtime: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
  };
}

export function isAdminDemoMode() {
  return process.env.NODE_ENV !== "production" && !hasSupabaseEnv();
}
