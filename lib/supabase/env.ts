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

export function isAdminDemoMode() {
  return process.env.NODE_ENV !== "production" && !hasSupabaseEnv();
}
