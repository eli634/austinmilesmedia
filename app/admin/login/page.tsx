import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { hasSupabaseEnv, getSupabaseEnvDiagnostics } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params?.error;
  const isConfigured = hasSupabaseEnv();
  const envDiagnostics = getSupabaseEnvDiagnostics();

  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <Link
          href="/"
          aria-label="Austin Miles Media home"
          className="relative mx-auto mb-10 block h-10 w-36"
        >
          <Image
            src="/amm-signature-white-transparent.png"
            alt="Austin Miles Media"
            fill
            priority
            sizes="144px"
            className="object-contain"
          />
        </Link>

        <form
          action="/admin/login/submit"
          method="post"
          className="rounded-3xl border border-[#dbe6f1] bg-white p-7 shadow-sm"
        >
          <p className="mb-5 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-[#7b8da3]">
            Admin
          </p>
          <p className="max-w-[62ch] font-body font-medium leading-relaxed text-[#52677f] text-sm">
            Sign in to view inquiries, manage deals, and track bookings.
          </p>

          <div className="mt-8 grid gap-4">
            <label className="grid gap-2 font-body text-sm text-[#52677f]">
              Email
              <input
                type="email"
                name="email"
                required
                className="rounded-xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 text-[#0b4a7a] outline-none transition-colors placeholder:text-[#7b8da3] focus:border-[#0b4a7a]"
                placeholder="austin@example.com"
              />
            </label>
            <label className="grid gap-2 font-body text-sm text-[#52677f]">
              Password
              <input
                type="password"
                name="password"
                required
                className="rounded-xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 text-[#0b4a7a] outline-none transition-colors placeholder:text-[#7b8da3] focus:border-[#0b4a7a]"
                placeholder="Password"
              />
            </label>
          </div>

          {error && (
            <p className="mt-5 rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm font-semibold text-[#0b4a7a]">
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="mt-8 w-full border-[#0b4a7a] bg-[#0b4a7a] text-white hover:bg-[#08395e] hover:text-white disabled:border-[#b7c8d8] disabled:bg-[#b7c8d8]"
            disabled={!isConfigured}
          >
            Sign in
          </Button>

          {!isConfigured && (
            <div className="mt-5 grid gap-3">
              <p className="font-body text-xs leading-relaxed text-[#7b8da3]">
                Supabase is not configured on this deployment, so login is
                disabled.
              </p>
              {envDiagnostics.missing.length > 0 && (
                <p className="font-mono text-[0.62rem] leading-relaxed text-[#7b8da3]">
                  Missing on server ({envDiagnostics.runtime}):{" "}
                  {envDiagnostics.missing.join(", ")}
                </p>
              )}
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-[#0b4a7a] text-[#0b4a7a] hover:bg-[#0b4a7a] hover:text-white"
              >
                <Link href="/admin">Open UI preview</Link>
              </Button>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
