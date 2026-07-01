import { NextResponse } from "next/server";

import { getSupabaseEnvDiagnostics } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const diagnostics = getSupabaseEnvDiagnostics();

  return NextResponse.json({
    supabaseConfigured: diagnostics.configured,
    loginReady: diagnostics.loginReady,
    missing: diagnostics.missing,
    runtime: diagnostics.runtime,
    siteUrlSet: Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim()),
  });
}
