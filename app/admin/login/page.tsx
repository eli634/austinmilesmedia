import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { hasSupabaseEnv } from "@/lib/supabase/env";

const LOGIN_ERRORS = new Set([
  "Email or password is incorrect.",
  "Email and password are required.",
  "Sign-in is unavailable right now.",
  "This account cannot access admin.",
]);

function sanitizeLoginError(error?: string) {
  return error && LOGIN_ERRORS.has(error) ? error : undefined;
}

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = sanitizeLoginError(params?.error);
  const isConfigured = hasSupabaseEnv();

  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <Link
          href="/"
          aria-label="AMM home"
          className="relative mx-auto mb-10 block h-10 w-36"
        >
          <Image
            src="/amm-signature-white-transparent.png"
            alt="AMM"
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
          <h1 className="font-display text-2xl font-black tracking-[-0.04em] text-[#0b4a7a]">
            Sign in
          </h1>
          <p className="mt-2 max-w-[62ch] font-body text-sm font-medium leading-relaxed text-[#52677f]">
            View inquiries, manage deals, and track bookings.
          </p>

          <div className="mt-8 grid gap-4">
            <label className="grid gap-2 font-body text-sm text-[#52677f]">
              Email
              <input
                type="email"
                name="email"
                required
                className="rounded-xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 text-[#0b4a7a] outline-none transition-colors placeholder:text-[#7b8da3] focus:border-[#0b4a7a]"
                placeholder="austin@austinmilesmedia.com"
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

          <p className="mt-4 text-center font-body text-sm text-[#52677f]">
            <Link href="/admin/forgot-password" className="font-semibold text-[#0b4a7a] underline decoration-[#dbe6f1] underline-offset-4">
              Forgot password
            </Link>
          </p>

          {!isConfigured && (
            <p className="mt-5 font-body text-xs leading-relaxed text-[#7b8da3]">
              Sign-in is unavailable right now.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
