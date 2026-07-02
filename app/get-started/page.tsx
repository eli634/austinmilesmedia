"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string; desc: string; tag: string };

const businessTypes: Option[] = [
  {
    value: "Local Service Businesses",
    label: "Local Service Businesses",
    desc: "Trades, home services, clinics, gyms — anyone who books jobs or appointments.",
    tag: "Jobs • bookings • calls",
  },
  {
    value: "Athletes & Sports",
    label: "Athletes & Sports",
    desc: "Athletes, teams, trainers, and sports brands building a stronger presence.",
    tag: "Highlights • offers • reach",
  },
  {
    value: "Restaurant & Hospitality",
    label: "Restaurant & Hospitality",
    desc: "Restaurants, bars, hotels, venues, events.",
    tag: "Foot traffic • reservations",
  },
  {
    value: "Professional Services",
    label: "Professional Services",
    desc: "Agencies, firms, real estate, finance, B2B.",
    tag: "Leads • authority",
  },
  {
    value: "Entertainment & Media",
    label: "Entertainment & Media",
    desc: "Creators, shows, public figures, sports & athletes.",
    tag: "Audience • reach",
  },
  {
    value: "Something Else",
    label: "Something Else",
    desc: "Tell us what you do and we'll tailor it.",
    tag: "Custom",
  },
];

const goals: Option[] = [
  {
    value: "Consistent Content",
    label: "Consistent Content",
    desc: "Never run out of things to post again.",
    tag: "Always-on output",
  },
  {
    value: "Launch Or Promo",
    label: "Launch Or Promo",
    desc: "Push a product, event, or grand opening.",
    tag: "Time-boxed campaign",
  },
  {
    value: "Brand Awareness",
    label: "Brand Awareness",
    desc: "Get known and trusted in your market.",
    tag: "Reach • recognition",
  },
  {
    value: "More Booked Jobs & Leads",
    label: "More Booked Jobs & Leads",
    desc: "Turn views into calls, bookings, and sales.",
    tag: "Calls • bookings • sales",
  },
  {
    value: "Audience Growth",
    label: "Audience Growth",
    desc: "Grow followers and consistent reach.",
    tag: "Followers • engagement",
  },
  {
    value: "Not Sure Yet",
    label: "Not Sure Yet",
    desc: "Help me figure out the right play.",
    tag: "We'll advise",
  },
];

const stepLabels = ["Business", "Goal", "Details"];

const panelClass =
  "rounded-3xl border border-[#d8e3ef] bg-white shadow-[0_22px_70px_rgba(3,16,36,0.08)]";

const fieldClass =
  "w-full rounded-xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-[#0b4a7a] outline-none transition-colors placeholder:text-[#7b8da3] focus:border-[#0b4a7a]";

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
                    "border-[#0b4a7a] bg-[#0b4a7a] text-white shadow-[0_8px_20px_rgba(11,74,122,0.22)]",
                  done && "border-[#0b4a7a] bg-[#0b4a7a] text-white",
                  !active && !done && "border-[#d8e3ef] bg-white text-[#7b8da3]",
                )}
              >
                {done ? "✓" : index + 1}
              </div>
              <span
                className={cn(
                  "font-body text-xs",
                  active ? "font-semibold text-[#0b4a7a]" : "text-[#7b8da3]",
                )}
              >
                {label}
              </span>
            </div>
            {index < stepLabels.length - 1 && (
              <div
                className={cn(
                  "mx-3 h-px flex-1 transition-colors duration-300",
                  done ? "bg-[#0b4a7a]" : "bg-[#d8e3ef]",
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
                ? "border-[#0b4a7a] bg-white shadow-[0_16px_40px_rgba(11,74,122,0.16)]"
                : "border-[#c5d9ec] bg-[#f4f8fc] shadow-[0_8px_24px_rgba(11,74,122,0.08)] hover:-translate-y-0.5 hover:border-[#0b4a7a]/30 hover:bg-[#eef5ff] hover:shadow-[0_14px_32px_rgba(11,74,122,0.12)]",
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                isSelected ? "border-[#0b4a7a]" : "border-[#c5d4e4]",
              )}
            >
              {isSelected && (
                <span className="size-2.5 rounded-full bg-[#0b4a7a]" />
              )}
            </span>
            <span className="flex-1">
              <span className="block font-body text-base font-semibold text-[#0b4a7a]">
                {option.label}
              </span>
              <span className="mt-1 block font-body text-sm text-[#52677f]">
                {option.desc}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function GetStarted() {
  const [step, setStep] = useState(0);
  const [businessType, setBusinessType] = useState("");
  const [goal, setGoal] = useState("");
  const [form, setForm] = useState({
    name: "",
    business: "",
    website: "",
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
      form.website.trim());

  const submit = async () => {
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType,
          goal,
          name: form.name,
          business: form.business,
          handle: form.website,
          email: form.email,
          phone: form.phone,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("done");
    } catch {
      setStatus("form");
      setError("Something went wrong. Try again, or email us directly.");
    }
  };

  return (
    <main className="relative min-h-screen text-[#0b4a7a]">
      <header className="mx-auto flex w-full max-w-[760px] items-center justify-between px-5 py-6 sm:px-8">
        <Link
          href="/"
          aria-label="Austin Miles Media home"
          className="relative h-8 w-28 transition-opacity hover:opacity-80"
        >
          <Image
            src="/amm-signature-grey.png"
            alt="Austin Miles Media"
            fill
            priority
            sizes="112px"
            className="object-contain object-left opacity-90 transition-opacity"
          />
        </Link>
        <Link
          href="/"
          className="font-body text-sm text-[#52677f] transition-colors hover:text-[#0b4a7a]"
        >
          Back to site
        </Link>
      </header>

      <div className="mx-auto w-full max-w-[760px] px-5 pb-24 pt-6 sm:px-8">
        {status === "done" ? (
          <div className={cn(panelClass, "p-8 text-center sm:p-14")}>
            <p className="mb-6 font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[#7b8da3]">
              Inquiry received
            </p>
            <h1 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-[0.95] tracking-[-0.055em] text-[#0b4a7a]">
              You&apos;re in.
            </h1>
            <p className="mx-auto mt-6 max-w-[52ch] font-body text-lg leading-relaxed text-[#52677f]">
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
                <div
                  key={t}
                  className="rounded-2xl border border-[#d8e3ef] bg-[#f8fbff] p-5 shadow-[0_8px_24px_rgba(3,16,36,0.05)]"
                >
                  <p className="font-display text-sm font-bold text-[#0b4a7a]">
                    {n}
                  </p>
                  <p className="mt-3 font-body font-semibold text-[#0b4a7a]">
                    {t}
                  </p>
                  <p className="mt-1 font-body text-sm text-[#52677f]">{d}</p>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Button
                asChild
                size="lg"
                className="border-[#0b4a7a] bg-[#0b4a7a] text-white hover:bg-[#08395e] hover:text-white"
              >
                <Link href="/">Back to home</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[0.95] tracking-[-0.055em] text-[#0b4a7a]">
                Get started
              </h1>
              <p className="mt-3 font-body text-lg text-[#52677f]">
                Three quick steps. No commitment — just tells us how to help.
              </p>
            </div>

            <div
              className={cn(
                "mb-10 rounded-2xl border border-[#c5d9ec] bg-[#f4f8fc] p-5 shadow-[0_8px_24px_rgba(11,74,122,0.06)]",
              )}
            >
              <Stepper current={step} />
            </div>

            <div className={cn(panelClass, "p-6 sm:p-8")}>
              {step === 0 && (
                <>
                  <h2 className="font-display text-2xl font-extrabold tracking-[-0.04em] text-[#0b4a7a] sm:text-3xl">
                    What kind of business?
                  </h2>
                  <p className="mt-2 mb-7 font-body text-sm text-[#52677f]">
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
                  <h2 className="font-display text-2xl font-extrabold tracking-[-0.04em] text-[#0b4a7a] sm:text-3xl">
                    What&apos;s your main goal?
                  </h2>
                  <p className="mt-2 mb-7 font-body text-sm text-[#52677f]">
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
                  <h2 className="font-display text-2xl font-extrabold tracking-[-0.04em] text-[#0b4a7a] sm:text-3xl">
                    Where should we reach you?
                  </h2>
                  <p className="mt-2 mb-7 font-body text-sm text-[#52677f]">
                    Drop your details and your website. We&apos;ll review it and
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
                      placeholder="Website *"
                      maxLength={180}
                      value={form.website}
                      onChange={(e) => updateForm("website", e.target.value)}
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
                <p className="mt-5 font-body text-sm font-semibold text-[#0b4a7a]">
                  {error}
                </p>
              )}

              <div className="mt-8 flex items-center justify-between border-t border-[#e7eef7] pt-6">
                <Button
                  variant="link"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className={cn(
                    "text-[#52677f] hover:text-[#0b4a7a]",
                    step === 0 && "pointer-events-none opacity-0",
                  )}
                >
                  ← Back
                </Button>

                {step < 2 ? (
                  <Button
                    disabled={!canContinue}
                    onClick={() => setStep((s) => s + 1)}
                    className="border-[#0b4a7a] bg-[#0b4a7a] text-white hover:bg-[#08395e] hover:text-white disabled:border-[#b7c8d8] disabled:bg-[#b7c8d8]"
                  >
                    Continue →
                  </Button>
                ) : (
                  <Button
                    disabled={!canContinue || status === "submitting"}
                    onClick={submit}
                    className="border-[#0b4a7a] bg-[#0b4a7a] text-white hover:bg-[#08395e] hover:text-white disabled:border-[#b7c8d8] disabled:bg-[#b7c8d8]"
                  >
                    {status === "submitting" ? "Sending…" : "Submit inquiry →"}
                  </Button>
                )}
              </div>
            </div>

            <p className="mt-6 text-center font-body text-xs text-[#7b8da3]">
              Step {step + 1} of 3
            </p>
          </>
        )}
      </div>
    </main>
  );
}
