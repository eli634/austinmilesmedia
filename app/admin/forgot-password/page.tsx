import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { hasSupabaseEnv } from "@/lib/supabase/env";

const FORGOT_ERRORS = new Set(["Password reset is unavailable right now."]);

function sanitizeError(error?: string) {
  return error && FORGOT_ERRORS.has(error) ? error : undefined;
}

export const dynamic = "force-dynamic";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; sent?: string }>;
}) {
  const params = await searchParams;
  const error = sanitizeError(params?.error);
  const sent = params?.sent === "1";
  const isConfigured = hasSupabaseEnv();

  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <Link href="/" aria-label="AMM home" className="relative mx-auto mb-10 block h-10 w-36">
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
          action="/admin/forgot-password/submit"
          method="post"
          className="rounded-3xl border border-[#dbe6f1] bg-white p-7 shadow-sm"
        >
          <h1 className="font-display text-2xl font-black tracking-[-0.04em] text-[#0b4a7a]">
            Reset password
          </h1>
          <p className="mt-2 font-body text-sm font-medium leading-relaxed text-[#52677f]">
            Enter the admin email. If it matches an admin account, a reset link will arrive in that inbox.
          </p>

          <label className="mt-8 grid gap-2 font-body text-sm text-[#52677f]">
            Email
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="rounded-xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 text-[#0b4a7a] outline-none transition-colors placeholder:text-[#7b8da3] focus:border-[#0b4a7a]"
              placeholder="Austin@attentionmeansmoney.com"
            />
          </label>

          {sent && (
            <p className="mt-5 rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm font-semibold text-[#0b4a7a]">
              If that email is an admin account, a reset link is on its way.
            </p>
          )}

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
            Send reset link
          </Button>

          <p className="mt-4 text-center font-body text-sm text-[#52677f]">
            <Link
              href="/admin/login"
              className="font-semibold text-[#0b4a7a] underline decoration-[#dbe6f1] underline-offset-4"
            >
              Back to sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
