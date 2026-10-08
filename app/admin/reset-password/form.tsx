"use client";

import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type Phase = "checking" | "ready" | "invalid";

export function ResetPasswordForm() {
  const [phase, setPhase] = useState<Phase>("checking");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function loadSession() {
      const code = new URL(window.location.href).searchParams.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!active) return;
        if (!error) {
          setPhase("ready");
          return;
        }
      }

      const { data } = await supabase.auth.getSession();
      if (!active) return;
      if (data.session) {
        setPhase("ready");
        return;
      }

      window.setTimeout(() => {
        if (!active) return;
        setPhase((current) => (current === "checking" ? "invalid" : current));
      }, 900);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setPhase("ready");
    });

    void loadSession();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirm") ?? "");

    if (password.length < 8) {
      setMessage("Use at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    setPending(true);
    setMessage("");
    const { error } = await createClient().auth.updateUser({ password });
    setPending(false);

    if (error) {
      setMessage("Could not update password. Request a new reset link.");
      return;
    }

    window.location.assign("/admin");
  }

  if (phase === "checking") {
    return (
      <p className="font-body text-sm font-medium text-[#52677f]">Checking your reset link.</p>
    );
  }

  if (phase === "invalid") {
    return (
      <p className="font-body text-sm font-medium leading-relaxed text-[#52677f]">
        This reset link is invalid or expired. Request a new one from the sign-in page.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="grid gap-2 font-body text-sm text-[#52677f]">
        New password
        <input
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="rounded-xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 text-[#0b4a7a] outline-none transition-colors focus:border-[#0b4a7a]"
        />
      </label>
      <label className="grid gap-2 font-body text-sm text-[#52677f]">
        Confirm password
        <input
          type="password"
          name="confirm"
          required
          minLength={8}
          autoComplete="new-password"
          className="rounded-xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 text-[#0b4a7a] outline-none transition-colors focus:border-[#0b4a7a]"
        />
      </label>
      {message && (
        <p className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm font-semibold text-[#0b4a7a]">
          {message}
        </p>
      )}
      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="mt-2 w-full border-[#0b4a7a] bg-[#0b4a7a] text-white hover:bg-[#08395e] hover:text-white"
      >
        {pending ? "Saving" : "Save password"}
      </Button>
    </form>
  );
}
