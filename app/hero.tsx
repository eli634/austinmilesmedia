"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  const rise = (delay: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { y: 24, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          transition: { duration: 0.6, ease, delay },
        };

  return (
    <>
      <section className="relative h-screen min-h-[720px] overflow-hidden bg-ink">
        <video
          className="absolute inset-0 size-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          src="/website-reel.mov"
        >
          Your browser does not support the hero reel.
        </video>
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,7,19,0.12)_0%,rgba(2,7,19,0.04)_42%,rgba(2,7,19,0.58)_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-ink/70 to-ink"
        />
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="mx-auto w-full max-w-[1320px] px-5 text-center sm:px-8 lg:px-10">
            <motion.h1
              {...rise(0.06)}
              className="display mx-auto max-w-[12ch] text-creme drop-shadow-[0_8px_32px_rgba(2,7,19,0.55)]"
            >
              Filmed at full speed.
            </motion.h1>

            <motion.p
              {...rise(0.12)}
              className="body mx-auto mt-4 max-w-[52ch] text-lg drop-shadow-[0_4px_24px_rgba(2,7,19,0.45)]"
            >
              Show the work up close, the way it actually looks when you do it,
              and people stop asking what you charge. They start asking if
              you&apos;re available.
            </motion.p>

            <motion.div
              {...rise(0.18)}
              className="mt-5 flex justify-center"
            >
              <MotionButton
                href="/get-started"
                label="Get started"
                shouldReduceMotion={shouldReduceMotion}
              />
            </motion.div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center px-5">
          <motion.a
            href="#hero-copy"
            {...rise(0.12)}
            className="rounded-full border border-white/18 bg-ink/30 px-4 py-2 font-mono text-[0.64rem] uppercase tracking-[0.22em] text-white/70 backdrop-blur-md transition-colors hover:border-white/35 hover:text-white"
          >
            Scroll to enter
          </motion.a>
        </div>
        <Link
          href="/admin/login"
          aria-label="Austin admin login"
          className="absolute bottom-8 right-5 z-10 flex size-9 items-center justify-center rounded-full border border-white/12 bg-ink/25 text-white/45 backdrop-blur-md transition-colors hover:border-white/28 hover:text-white sm:right-8"
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3l7 3v5c0 4.6-2.8 8-7 10-4.2-2-7-5.4-7-10V6l7-3Z" />
            <path d="M9.5 12.5l1.7 1.7 3.5-4.2" />
          </svg>
        </Link>
      </section>

      <section
        id="hero-copy"
        className="relative flex min-h-[88vh] flex-col justify-center overflow-hidden scroll-mt-20"
      >
        <Image
          src="/amm-signature-white-transparent.png"
          alt=""
          aria-hidden
          width={1100}
          height={550}
          priority
          className="pointer-events-none absolute left-1/2 top-1/2 hidden w-[62vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 opacity-[0.12] transition-transform duration-700 ease-expo lg:block"
        />

        <div className="relative z-10 mx-auto grid w-full max-w-[1320px] gap-12 px-5 py-28 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-10 lg:py-36">
          <div>
            <motion.p {...rise(0)} className="eyebrow mb-6">
              Austin Miles Media
            </motion.p>
            <motion.h1 {...rise(0)} className="display max-w-[12ch]">
              <span className="text-creme">Become the obvious choice.</span>
            </motion.h1>

            <motion.p {...rise(0.12)} className="body mt-8 text-lg">
              The content that makes the right clients come to you. And turns your
              business into the standard the rest get measured against.
            </motion.p>

            <motion.div
              {...rise(0.18)}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <MotionButton
                href="/get-started"
                label="Get started"
                shouldReduceMotion={shouldReduceMotion}
              />
              <MotionButton
                href="#work"
                label="See work like yours"
                shouldReduceMotion={shouldReduceMotion}
              />
            </motion.div>
          </div>

          <motion.div {...rise(0.14)}>
            <HeroVideoFrame />
          </motion.div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10">
          <div className="divider" />
        </div>
      </section>
    </>
  );
}

function MotionButton({
  href,
  label,
  shouldReduceMotion,
}: {
  href: string;
  label: string;
  shouldReduceMotion: boolean | null;
}) {
  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.035 }}
      whileTap={shouldReduceMotion ? undefined : { y: -2, scale: 0.99 }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
    >
      <Button
        asChild
        size="lg"
        className="shadow-none transition-[box-shadow] duration-500 ease-expo hover:bg-creme hover:text-ink hover:shadow-[0_18px_48px_rgba(248,251,255,0.14)]"
      >
        <Link href={href}>{label}</Link>
      </Button>
    </motion.div>
  );
}

function HeroVideoFrame() {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group relative mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.07] p-3 shadow-[0_28px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-colors duration-300 hover:border-white/28"
    >
      <div className="relative min-h-[28rem] overflow-hidden rounded-[1.55rem] bg-[radial-gradient(circle_at_50%_0%,rgba(248,251,255,0.34),rgba(248,251,255,0.13)_34%,rgba(2,7,19,0.76)_100%)] p-5">
        <div
          aria-hidden
          className="absolute -left-1/4 -top-1/4 size-72 rounded-full bg-white/10 blur-3xl transition-transform duration-700 ease-expo group-hover:translate-x-16 group-hover:translate-y-10 group-hover:bg-white/16"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,7,19,0.04)_0%,rgba(2,7,19,0.1)_48%,rgba(2,7,19,0.72)_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.12)_45%,transparent_62%)]"
        />

        <div className="relative z-10 flex min-h-[25.5rem] items-center justify-center">
          <div className="rounded-2xl border border-dashed border-white/18 bg-white/[0.035] px-6 py-4 text-center transition-colors duration-300 group-hover:border-white/35 group-hover:bg-white/[0.055]">
            <p className="font-body text-sm font-semibold text-white/55">
              Hero video placeholder
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
