"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string; desc: string; tag: string };

const businessTypes: Option[] = [
  {
    value: "Local service business",
    label: "Local service business",
    desc: "Trades, home services, clinics, gyms — anyone who books jobs or appointments.",
    tag: "Jobs • bookings • calls",
  },
  {
    value: "Athletes & sports",
    label: "Athletes & sports",
    desc: "Athletes, teams, trainers, and sports brands building a stronger presence.",
    tag: "Highlights • offers • reach",
  },
  {
    value: "Restaurant & hospitality",
    label: "Restaurant & hospitality",
    desc: "Restaurants, bars, hotels, venues, events.",
    tag: "Foot traffic • reservations",
  },
  {
    value: "Professional services",
    label: "Professional services",
    desc: "Agencies, firms, real estate, finance, B2B.",
    tag: "Leads • authority",
  },
  {
    value: "Entertainment & media",
    label: "Entertainment & media",
    desc: "Creators, shows, public figures, sports & athletes.",
    tag: "Audience • reach",
  },
  {
    value: "Something else",
    label: "Something else",
    desc: "Tell us what you do and we'll tailor it.",
    tag: "Custom",
  },
];

const goals: Option[] = [
  {
    value: "More booked jobs & leads",
    label: "More booked jobs & leads",
    desc: "Turn views into calls, bookings, and sales.",
    tag: "Calls • bookings • sales",
  },
  {
    value: "Brand awareness",
    label: "Brand awareness",
    desc: "Get known and trusted in your market.",
    tag: "Reach • recognition",
  },
  {
    value: "Audience growth",
    label: "Audience growth",
    desc: "Grow followers and consistent reach.",
    tag: "Followers • engagement",
  },
  {
    value: "Launch or promotion",
    label: "Launch or promotion",
    desc: "Push a product, event, or grand opening.",
    tag: "Time-boxed campaign",
  },
  {
    value: "Consistent content",
    label: "Consistent content",
    desc: "Never run out of things to post again.",
    tag: "Always-on output",
  },
  {
    value: "Not sure yet",
    label: "Not sure yet",
    desc: "Help me figure out the right play.",
    tag: "We'll advise",
  },
];

const stepLabels = ["Business", "Goal", "Details"];

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between">
      {stepLabels.map((label, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border font-body text-sm font-semibold transition-colors duration-300",
                  active &&
                    "border-accent bg-accent text-ink shadow-[0_0_22px_rgba(248,251,255,0.28)]",
                  done && "border-accent bg-accent text-ink",
                  !active && !done && "border-creme/25 text-creme/50",
                )}
              >
                {done ? "✓" : index + 1}
              </div>
              <span
                className={cn(
                  "font-body text-xs",
                  active ? "text-creme" : "text-creme/45",
                )}
              >
                {label}
              </span>
            </div>
            {index < stepLabels.length - 1 && (
              <div
                className={cn(
                  "mx-3 h-px flex-1 transition-colors duration-300",
                  done ? "bg-accent" : "bg-creme/15",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OptionList({
  options,
  selected,
  onSelect,
}: {
  options: Option[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div role="radiogroup" className="space-y-3">
      {options.map((option) => {
        const isSelected = selected === option.value;
        return (
          <button
            type="button"
            role="radio"
            aria-checked={isSelected}
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={cn(
              "flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-200 ease-expo",
              isSelected
                ? "border-accent bg-accent/10"
                : "border-creme/10 bg-creme/[0.03] hover:border-creme/25 hover:bg-creme/[0.05]",
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                isSelected ? "border-accent" : "border-creme/30",
              )}
            >
              {isSelected && <span className="size-2.5 rounded-full bg-accent" />}
            </span>
            <span className="flex-1">
              <span className="block font-body text-base font-semibold text-creme">
                {option.label}
              </span>
              <span className="mt-1 block font-body text-sm text-creme/55">
                {option.desc}
              </span>
              <span className="mt-3 block font-body text-[0.68rem] uppercase tracking-[0.18em] text-creme/35">
                {option.tag}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

const fieldClass =
  "w-full rounded-xl border border-creme/15 bg-creme/[0.04] px-4 py-3 font-body text-creme outline-none transition-colors placeholder:text-creme/35 focus:border-accent";

export default function GetStarted() {
  const [step, setStep] = useState(0);
  const [businessType, setBusinessType] = useState("");
  const [goal, setGoal] = useState("");
  const [form, setForm] = useState({
    name: "",
    business: "",
    handle: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"form" | "submitting" | "done">("form");
  const [error, setError] = useState("");

  const updateForm = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canContinue =
    (step === 0 && businessType) ||
    (step === 1 && goal) ||
    (step === 2 &&
      form.name.trim() &&
      form.email.trim() &&
      (form.handle.trim() || form.business.trim()));

  const submit = async () => {
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessType, goal, ...form }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("done");
    } catch {
      setStatus("form");
      setError("Something went wrong. Try again, or email us directly.");
    }
  };

  return (
    <main className="relative z-10 min-h-screen">
      <header className="mx-auto flex w-full max-w-[760px] items-center justify-between px-5 py-6 sm:px-8">
        <Link
          href="/"
          aria-label="Austin Miles Media home"
          className="relative h-8 w-28 transition-opacity hover:opacity-80"
        >
          <Image
            src="/amm-signature-white-transparent.png"
            alt="Austin Miles Media"
            fill
            priority
            sizes="112px"
            className="object-contain object-left"
          />
        </Link>
        <Link
          href="/"
          className="font-body text-sm text-creme/50 transition-colors hover:text-creme"
        >
          Back to site
        </Link>
      </header>

      <div className="mx-auto w-full max-w-[760px] px-5 pb-24 pt-6 sm:px-8">
        {status === "done" ? (
          <div className="glass-strong rounded-3xl p-8 text-center sm:p-14">
            <p className="eyebrow mb-6">Inquiry received</p>
            <h1 className="display text-creme">You&apos;re in.</h1>
            <p className="body mx-auto mt-6 text-lg">
              Thanks{form.name ? `, ${form.name.split(" ")[0]}` : ""}. Austin
              just got your inquiry. We&apos;ll review your{" "}
              {businessType ? businessType.toLowerCase() : "business"} and reach
              out — usually within a day — with next steps built around{" "}
              {goal ? goal.toLowerCase() : "your goal"}.
            </p>
            <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
              {[
                ["01", "We review", "We look at your page and your market."],
                ["02", "We reach out", "A short message with next steps."],
                ["03", "We get rolling", "Pick a lane and we start filming."],
              ].map(([n, t, d]) => (
                <div key={t} className="glass rounded-2xl p-5">
                  <p className="font-display text-sm font-bold text-accent">
                    {n}
                  </p>
                  <p className="mt-3 font-body font-semibold text-creme">{t}</p>
                  <p className="mt-1 font-body text-sm text-creme/55">{d}</p>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Button asChild size="lg">
                <Link href="/">Back to home</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <h1 className="h2 text-creme">Get started</h1>
              <p className="body mt-3">
                Three quick steps. No commitment — just tells us how to help.
              </p>
            </div>

            <div className="mb-10 glass rounded-2xl p-5">
              <Stepper current={step} />
            </div>

            <div className="glass-strong rounded-3xl p-6 sm:p-8">
              {step === 0 && (
                <>
                  <h2 className="h3 text-creme">What kind of business?</h2>
                  <p className="body mt-2 mb-7 text-sm">
                    This helps us tailor the content to how you actually get
                    customers.
                  </p>
                  <OptionList
                    options={businessTypes}
                    selected={businessType}
                    onSelect={setBusinessType}
                  />
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className="h3 text-creme">What&apos;s your main goal?</h2>
                  <p className="body mt-2 mb-7 text-sm">
                    Pick the outcome that matters most right now.
                  </p>
                  <OptionList
                    options={goals}
                    selected={goal}
                    onSelect={setGoal}
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="h3 text-creme">Where should we reach you?</h2>
                  <p className="body mt-2 mb-7 text-sm">
                    Drop your details and your page. We&apos;ll review it and
                    follow up with the clearest next step.
                  </p>
                  <div className="grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        className={fieldClass}
                        placeholder="Your name *"
                        maxLength={120}
                        value={form.name}
                        onChange={(e) => updateForm("name", e.target.value)}
                      />
                      <input
                        className={fieldClass}
                        placeholder="Business name"
                        maxLength={160}
                        value={form.business}
                        onChange={(e) => updateForm("business", e.target.value)}
                      />
                    </div>
                    <input
                      className={fieldClass}
                      placeholder="Instagram handle or website *"
                      maxLength={180}
                      value={form.handle}
                      onChange={(e) => updateForm("handle", e.target.value)}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        type="email"
                        className={fieldClass}
                        placeholder="Email *"
                        maxLength={180}
                        value={form.email}
                        onChange={(e) => updateForm("email", e.target.value)}
                      />
                      <input
                        type="tel"
                        className={fieldClass}
                        placeholder="Phone (optional)"
                        maxLength={60}
                        value={form.phone}
                        onChange={(e) => updateForm("phone", e.target.value)}
                      />
                    </div>
                    <textarea
                      className={cn(fieldClass, "min-h-28 resize-none")}
                      placeholder="Anything we should know? (optional)"
                      maxLength={2000}
                      value={form.message}
                      onChange={(e) => updateForm("message", e.target.value)}
                    />
                  </div>
                </>
              )}

              {error && (
                <p className="mt-5 font-body text-sm text-accent">{error}</p>
              )}

              <div className="mt-8 flex items-center justify-between border-t border-creme/10 pt-6">
                <Button
                  variant="link"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className={cn(step === 0 && "pointer-events-none opacity-0")}
                >
                  ← Back
                </Button>

                {step < 2 ? (
                  <Button
                    disabled={!canContinue}
                    onClick={() => setStep((s) => s + 1)}
                  >
                    Continue →
                  </Button>
                ) : (
                  <Button
                    disabled={!canContinue || status === "submitting"}
                    onClick={submit}
                  >
                    {status === "submitting" ? "Sending…" : "Submit inquiry →"}
                  </Button>
                )}
              </div>
            </div>

            <p className="mt-6 text-center font-body text-xs text-creme/40">
              Step {step + 1} of 3
            </p>
          </>
        )}
      </div>
    </main>
  );
}
