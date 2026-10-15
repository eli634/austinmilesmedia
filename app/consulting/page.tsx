import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { BookCall } from "./book-call";
import { FrameLink } from "./frame-link";
import { VslSeat } from "./vsl-seat";

const description =
  "A consult for founders who want their name to scale the business. Book a call with Austin.";

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
  "Founders scaling a personal brand",
  "You keep the work after the call",
  "He does not film or post",
];

const truths = [
  {
    title: "Your name should already mean something",
    body: "When someone in your market hears your name, they should know what you do. If they still have to be told, the personal brand is not doing any work yet.",
  },
  {
    title: "More content will not fix that",
    body: "Posting every day only helps after you know what you want the name to mean. Until then, a content team is just publishing more of something unclear.",
  },
  {
    title: "You have to be able to run it",
    body: "Austin will help you decide what the name stands for. He will not film it, post it, or stay on to manage it. You leave able to do that yourself.",
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
    title: "What your name is known for",
    body: "The one thing the market should think when they hear your name. That gets settled before anything else goes out.",
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

      <article className="mx-auto w-full max-w-[760px] px-5 pb-4 pt-16 text-center sm:px-8 sm:pt-24">
        <h1 className="font-display text-[clamp(2.7rem,7.4vw,5.35rem)] font-extrabold leading-[0.88] tracking-[-0.055em] text-creme drop-shadow-[0_10px_40px_rgba(2,7,19,0.45)]">
          How your brand
          <br />
          should show up.
        </h1>
        <p className="mx-auto mt-6 max-w-[18em] text-balance font-body text-[1.2rem] font-semibold leading-snug text-creme sm:max-w-none sm:text-[1.45rem]">
          Your name becomes the reason people buy.
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
            What gets in the way
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

      <section className="relative overflow-hidden px-5 pb-20 pt-8 text-center sm:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[46rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(closest-side,rgba(70,205,240,0.16),transparent)]"
        />
        <div className="relative mx-auto w-full max-w-[760px] border-t border-white/10 pt-16">
          <h2 className="font-display text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold leading-[0.92] tracking-[-0.05em] text-creme">
            Let’s get to work.
          </h2>
          <p className="mx-auto mt-5 max-w-[40rem] text-balance font-body text-[1.05rem] font-medium leading-relaxed text-creme/75">
            Your name becomes the reason people buy. On the call, you and Austin
            decide what you should be known for, what to say, and what to stop.
            You leave with that written down, and you run it. He does not film
            or post. If the call is a fit, he will tell you what it costs.
          </p>
          <FrameLink href="#book" className="mt-8">
            Book a call
          </FrameLink>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[760px] flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Link
            href="/"
            aria-label="AMM home"
            className="relative h-7 w-28 shrink-0"
          >
            <Image
              src="/amm-signature-white-transparent.png"
              alt="AMM"
              fill
              sizes="112px"
              className="object-contain object-left"
            />
          </Link>
          <div className="flex flex-col gap-2 sm:items-end">
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <a
                href="mailto:info@attentionmeansmoney.com"
                className="font-body text-sm font-medium text-creme/60 transition-colors hover:text-creme"
              >
                info@attentionmeansmoney.com
              </a>
              <Link
                href="/privacy"
                className="font-body text-sm font-medium text-creme/60 transition-colors hover:text-creme"
              >
                Privacy
              </Link>
            </div>
            <p className="font-body text-sm text-creme/40">
              © {new Date().getFullYear()} AMM · Attention Means Money
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
