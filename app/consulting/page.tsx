import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { BookCall } from "./book-call";
import { FrameLink } from "./frame-link";
import { VslSeat } from "./vsl-seat";

const description =
  "A consult for founders and personal brands who want a direct read on how they show up. Book a call with Austin.";

export const metadata: Metadata = {
  title: "Consulting",
  description,
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Consulting | AMM",
    description,
  },
  twitter: {
    title: "Consulting | AMM",
    description,
  },
};

const checks = [
  "Founders and personal brands",
  "The company, the person, or both",
  "You keep the work. He does not film or post",
];

const truths = [
  {
    title: "The company and you don’t match",
    body: "The business sounds like one thing. You sound like another.",
  },
  {
    title: "There’s no line you can repeat",
    body: "Every intro, pitch, and page starts from zero.",
  },
  {
    title: "A crew can’t decide it",
    body: "They can make more. They can’t tell you what the brand is.",
  },
];

const covers = [
  {
    title: "The point of view",
    body: "What the brand is for, in one sentence you can say out loud. The same sentence, every time someone asks what you do.",
  },
  {
    title: "Who it’s for",
    body: "The person this is built for. Specific enough that you know who should get it, and who can miss it.",
  },
  {
    title: "Company, name, or both",
    body: "Whether people should meet the company first, you first, or both. The other one gets a job, so the two stop talking over each other.",
  },
  {
    title: "What to say first",
    body: "The opening for the bio, the pitch, and the site. One of them leads. The rest have to follow it.",
  },
  {
    title: "What to stop",
    body: "The topics and formats that make the brand harder to place. You leave with what to drop, not another list of things to add.",
  },
  {
    title: "What you do next",
    body: "The order you can run after the call, on your own. Austin does not film it, post it, or stay on to manage it.",
  },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 14 14" className="size-3.5 shrink-0 text-creme" aria-hidden>
      <path
        d="M2.2 7.2 5.4 10.4 11.8 3.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ConsultingPage() {
  return (
    <main className="relative min-h-screen text-creme scheme-dark">
      <header className="sticky top-0 z-20 bg-[linear-gradient(to_bottom,var(--color-ink)_0%,var(--color-ink)_68%,transparent_100%)] px-3 pb-8 pt-3 sm:px-5 sm:pt-4">
        <div className="mx-auto flex w-full max-w-[760px] items-center justify-between rounded-full border border-white/12 bg-ink px-4 py-2.5 shadow-[0_18px_50px_rgba(2,7,19,0.45)]">
          <Link
            href="/"
            aria-label="AMM home"
            className="relative h-7 w-24 transition-opacity hover:opacity-80"
          >
            <Image
              src="/amm-signature-white-transparent.png"
              alt="AMM"
              fill
              priority
              sizes="96px"
              className="object-contain object-left"
            />
          </Link>
          <Link
            href="#book"
            className="inline-flex h-9 items-center rounded-full bg-creme px-4 font-body text-[0.8rem] font-semibold text-ink shadow-[0_10px_28px_rgba(70,205,240,0.22)] transition-[background-color,box-shadow] duration-300 hover:shadow-[0_14px_36px_rgba(248,251,255,0.2)]"
          >
            Book a call
          </Link>
        </div>
      </header>

      <article className="mx-auto w-full max-w-[760px] px-5 pb-24 pt-16 text-center sm:px-8 sm:pt-24">
        <h1 className="font-display text-[clamp(2.7rem,7.4vw,5.35rem)] font-extrabold leading-[0.88] tracking-[-0.055em] text-creme drop-shadow-[0_10px_40px_rgba(2,7,19,0.45)]">
          How your brand
          <br />
          should show up.
        </h1>
        <p className="mx-auto mt-6 max-w-[28ch] font-body text-[1.05rem] font-medium leading-snug text-creme/70 sm:text-[1.15rem]">
          Austin consults founders and personal brands on the approach.
        </p>
        <ul className="glass mx-auto mt-8 flex w-fit max-w-full flex-col items-start gap-2.5 rounded-3xl px-5 py-4 text-left shadow-[0_18px_50px_rgba(2,7,19,0.28)]">
          {checks.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 font-body text-[0.9rem] font-medium leading-snug text-creme/85"
            >
              <span className="mt-0.5">
                <CheckIcon />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <section className="mt-12">
          <h2 className="font-display text-[1.45rem] font-extrabold tracking-[-0.04em] text-creme">
            1. Watch the video
          </h2>
          <VslSeat />
          <FrameLink href="#book" full className="mt-4">
            Book a call
          </FrameLink>
          <p className="mt-3 font-body text-[0.8rem] font-medium text-creme/60">
            A fit call. He’ll say if a consult makes sense, and what it costs.
          </p>
        </section>

        <BookCall />

        <div className="divider mt-16" />
        <section className="pt-12">
          <h2 className="font-display text-[1.7rem] font-extrabold tracking-[-0.04em] text-creme">
            Where it breaks
          </h2>
          <div className="mx-auto mt-8 flex max-w-[34rem] flex-col gap-6 text-left">
            {truths.map((item) => (
              <div key={item.title}>
                <h3 className="text-balance font-display text-[1.05rem] font-extrabold leading-snug tracking-[-0.03em] text-creme">
                  {item.title}
                </h3>
                <p className="mt-1 text-pretty font-body text-[0.92rem] font-medium leading-relaxed text-creme/65">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
          <FrameLink href="#book" className="mt-8">
            Book a call
          </FrameLink>
        </section>

        <div className="divider mt-16" />
        <section className="pt-12 text-left">
          <h2 className="text-center font-display text-[1.7rem] font-extrabold tracking-[-0.04em] text-creme">
            What the consult covers
          </h2>
          <p className="mx-auto mt-3 max-w-[36ch] text-center font-body text-[0.95rem] font-medium leading-relaxed text-creme/70">
            Six decisions. You leave with them written down.
          </p>
          <ol className="mt-8 flex flex-col gap-3">
            {covers.map((item, index) => (
              <li
                key={item.title}
                className="glass-strong grid grid-cols-[auto_1fr] items-start gap-x-4 rounded-3xl px-5 py-5 shadow-[0_18px_50px_rgba(2,7,19,0.28)] sm:gap-x-5"
              >
                <span className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] font-display text-[0.85rem] font-extrabold tabular-nums text-creme">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-[1.15rem] font-extrabold tracking-[-0.03em] text-creme">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 font-body text-[0.95rem] font-medium leading-relaxed text-creme/75">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8 text-center">
            <FrameLink href="#book">Book a call</FrameLink>
          </div>
        </section>
      </article>
    </main>
  );
}
