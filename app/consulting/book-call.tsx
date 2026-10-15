"use client";

import { motion } from "motion/react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { FrameButton } from "./frame-link";

const seats = ["Founder", "Personal brand", "Both"] as const;

const fieldClass =
  "w-full rounded-full border border-white/15 bg-white/[0.04] px-4 py-2.5 font-body text-base text-creme outline-none backdrop-blur-md transition-colors placeholder:text-creme/40 focus:border-creme/50";

export function BookCall() {
  const [seat, setSeat] = useState("");
  const [form, setForm] = useState({
    name: "",
    brand: "",
    email: "",
    phone: "",
    topic: "",
  });
  const [status, setStatus] = useState<"form" | "submitting" | "done">("form");
  const [error, setError] = useState("");

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canSubmit =
    seat &&
    form.name.trim() &&
    form.brand.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.topic.trim();

  const submit = async () => {
    if (!canSubmit || status === "submitting") return;
    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "consulting",
          businessType: seat,
          goal: "Book a call",
          name: form.name,
          business: form.brand,
          email: form.email,
          phone: form.phone,
          message: form.topic,
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("done");
    } catch {
      setStatus("form");
      setError("That didn’t send. Try again in a minute.");
    }
  };

  return (
    <motion.div
      id="book"
      layout
      transition={{ layout: { type: "spring", stiffness: 280, damping: 32 } }}
      className="glass-strong mt-12 scroll-mt-24 rounded-[1.75rem] px-6 py-7 text-left shadow-[0_28px_80px_rgba(0,0,0,0.35)] sm:px-9 sm:py-8"
    >
      {status === "done" ? (
        <div className="py-2 text-center">
          <h2 className="font-display text-[clamp(1.7rem,3vw,2.15rem)] font-extrabold leading-[1] tracking-[-0.04em] text-creme">
            Austin has the request.
          </h2>
          <p className="mx-auto mt-3 max-w-[46ch] font-body text-[0.95rem] font-medium leading-relaxed text-creme/70">
            Thanks{form.name ? `, ${form.name.split(" ")[0]}` : ""}. He’ll send a
            time, or tell you if the call isn’t a fit.
          </p>
        </div>
      ) : (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <h2 className="text-center font-display text-[clamp(1.55rem,2.6vw,2.05rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-creme">
        2. Book the call
      </h2>
      <p className="mx-auto mt-2 max-w-[42ch] text-center font-body text-[0.92rem] font-medium leading-relaxed text-creme/70">
        Tell him who you are and what you want the call to cover. He confirms
        the time.
      </p>

      <fieldset className="mt-6">
        <legend className="font-body text-[0.8rem] font-semibold text-creme">
          This call is for
        </legend>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {seats.map((option) => {
            const selected = seat === option;
            return (
              <label
                key={option}
                className={cn(
                  "relative cursor-pointer rounded-full border px-3.5 py-1.5 font-body text-[0.8rem] font-semibold backdrop-blur-md has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-creme",
                  selected
                    ? "border-creme text-ink"
                    : "border-white/25 bg-white/[0.04] text-creme",
                )}
              >
                {selected && (
                  <motion.span
                    layoutId="consult-seat"
                    className="absolute inset-0 bg-creme"
                    style={{ borderRadius: 999 }}
                    transition={{ type: "spring", stiffness: 440, damping: 34 }}
                  />
                )}
                <input
                  type="radio"
                  name="seat"
                  value={option}
                  checked={selected}
                  onChange={() => setSeat(option)}
                  className="sr-only"
                />
                <span className="relative z-10">{option}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-3.5">
        <div className="grid gap-3.5 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="font-body text-[0.8rem] font-semibold text-creme">
              Your name
            </span>
            <input
              className={fieldClass}
              name="name"
              autoComplete="name"
              maxLength={120}
              required
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="font-body text-[0.8rem] font-semibold text-creme">
              Company or brand
            </span>
            <input
              className={fieldClass}
              name="organization"
              autoComplete="organization"
              maxLength={160}
              required
              value={form.brand}
              onChange={(event) => update("brand", event.target.value)}
            />
          </label>
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="font-body text-[0.8rem] font-semibold text-creme">
              Email
            </span>
            <input
              type="email"
              className={fieldClass}
              name="email"
              autoComplete="email"
              maxLength={180}
              required
              value={form.email}
              onChange={(event) => update("email", event.target.value)}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="font-body text-[0.8rem] font-semibold text-creme">
              Phone
            </span>
            <input
              type="tel"
              className={fieldClass}
              name="phone"
              autoComplete="tel"
              maxLength={60}
              required
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
            />
          </label>
        </div>
        <label className="grid gap-1.5">
          <span className="font-body text-[0.8rem] font-semibold text-creme">
            What should the call cover
          </span>
          <textarea
            className={cn(fieldClass, "min-h-28 resize-y rounded-3xl px-4 py-3")}
            name="topic"
            required
            maxLength={2000}
            value={form.topic}
            onChange={(event) => update("topic", event.target.value)}
          />
        </label>
      </div>

      {error && (
        <p className="mt-4 font-body text-[0.8rem] font-semibold text-[#ffc7b8]" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 border-t border-white/10 pt-5">
        <FrameButton disabled={!canSubmit || status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Book a call"}
        </FrameButton>
        <p className="mt-3 text-center font-body text-[0.8rem] font-medium leading-snug text-creme/60">
          He answers this himself. No content package is attached.
        </p>
      </div>
    </form>
      )}
    </motion.div>
  );
}
