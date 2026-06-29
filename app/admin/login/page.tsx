"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const hasSupabaseEnv =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!hasSupabaseEnv) {
      setError("Supabase env vars are missing.");
      setIsSubmitting(false);
      return;
    }

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsSubmitting(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

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

        <form onSubmit={handleSubmit} className="rounded-3xl border border-[#dbe6f1] bg-white p-7 shadow-sm">
          <p className="eyebrow mb-5">Admin</p>
          <h1 className="h2">Austin login</h1>
          <p className="max-w-[62ch] font-body font-medium leading-relaxed text-[#52677f] mt-4 text-sm">
            Sign in to view inquiries, manage deals, and track bookings.
          </p>

          <div className="mt-8 grid gap-4">
            <label className="grid gap-2 font-body text-sm text-[#52677f]">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="rounded-xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 text-[#0b4a7a] outline-none transition-colors placeholder:text-[#7b8da3] focus:border-[#0b4a7a]"
                placeholder="austin@example.com"
              />
            </label>
            <label className="grid gap-2 font-body text-sm text-[#52677f]">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="rounded-xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 text-[#0b4a7a] outline-none transition-colors placeholder:text-[#7b8da3] focus:border-[#0b4a7a]"
                placeholder="Password"
              />
            </label>
          </div>

          {error && <p className="mt-5 font-body text-sm text-[#0b4a7a]">{error}</p>}

          <Button
            type="submit"
            size="lg"
            className="mt-8 w-full border-[#0b4a7a] bg-[#0b4a7a] text-white hover:bg-[#0b4a7a] hover:text-white"
            disabled={isSubmitting || !hasSupabaseEnv}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>

          {!hasSupabaseEnv && (
            <div className="mt-5 grid gap-3">
              <p className="font-body text-xs leading-relaxed text-[#7b8da3]">
                Supabase is not configured yet, so login is disabled.
              </p>
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
