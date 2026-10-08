import Image from "next/image";
import Link from "next/link";

import { ResetPasswordForm } from "./form";

export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
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

        <div className="rounded-3xl border border-[#dbe6f1] bg-white p-7 shadow-sm">
          <h1 className="font-display text-2xl font-black tracking-[-0.04em] text-[#0b4a7a]">
            Choose a new password
          </h1>
          <p className="mt-2 mb-8 font-body text-sm font-medium leading-relaxed text-[#52677f]">
            Use at least 8 characters. You will be signed in after it saves.
          </p>
          <ResetPasswordForm />
          <p className="mt-4 text-center font-body text-sm text-[#52677f]">
            <Link
              href="/admin/forgot-password"
              className="font-semibold text-[#0b4a7a] underline decoration-[#dbe6f1] underline-offset-4"
            >
              Request a new link
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
