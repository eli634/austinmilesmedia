"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Process", href: "#process" },
  { label: "Services", href: "#services" },
  { label: "The Founder", href: "#founder" },
];

/** Distance over which the nav morphs from hero → pill. */
const MORPH_RANGE = 150;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

export function Nav() {
  const [progress, setProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let frame = 0;

    const sync = () => {
      frame = 0;
      setProgress(clamp01(window.scrollY / MORPH_RANGE));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (progress < 0.12) setIsOpen(false);
  }, [progress]);

  // Ease-in: stays hero longer on the way down, still clears quickly near the top on the way up.
  const ease = progress * progress;
  const openBoost = isOpen ? 1 : ease;

  const maxWidth = lerp(1320, 920, ease);
  const shellPadX = lerp(12, 16, ease);
  const shellPadY = lerp(8, 8, ease);
  const bgAlpha = lerp(0, 0.8, openBoost);
  const borderAlpha = lerp(0, 0.12, openBoost);
  const blur = lerp(0, 18, openBoost);
  const shadowAlpha = lerp(0, 0.45, ease);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={cn(
          "pointer-events-auto relative w-full will-change-[max-width,background-color,box-shadow,backdrop-filter]",
          isOpen ? "rounded-[1.75rem]" : "rounded-full",
        )}
        style={{
          maxWidth: `${maxWidth}px`,
          padding: `${shellPadY}px ${shellPadX}px`,
          backgroundColor: `rgba(2, 7, 19, ${bgAlpha})`,
          border: `1px solid rgba(248, 251, 255, ${borderAlpha})`,
          backdropFilter: blur > 0.5 ? `blur(${blur}px)` : "none",
          WebkitBackdropFilter: blur > 0.5 ? `blur(${blur}px)` : "none",
          boxShadow:
            shadowAlpha > 0.02
              ? `0 18px 50px rgba(2, 7, 19, ${shadowAlpha}), 0 0 0 1px rgba(248, 251, 255, ${borderAlpha * 0.35})`
              : "none",
        }}
      >
        <nav className="flex items-center justify-between gap-3">
          <Link
            href="/"
            aria-label="Austin Miles Media home"
            className="relative h-8 w-28 shrink-0 transition-opacity hover:opacity-80 sm:h-9 sm:w-32"
          >
            <Image
              src="/amm-signature-white-transparent.png"
              alt="Austin Miles Media"
              fill
              priority
              className="object-contain object-left"
              sizes="128px"
            />
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-1.5 font-body text-sm font-semibold tracking-[-0.02em] text-creme/70 transition-colors hover:text-creme"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild size="sm">
              <Link href="/get-started">Get started →</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Button asChild size="sm">
              <Link href="/get-started">Get started</Link>
            </Button>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
              onClick={() => setIsOpen((open) => !open)}
              className="flex size-10 flex-col items-center justify-center gap-1.5 rounded-full border border-creme/20"
            >
              <span
                className={cn(
                  "h-px w-4 bg-creme transition-transform duration-300 ease-expo",
                  isOpen && "translate-y-[3.5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "h-px w-4 bg-creme transition-transform duration-300 ease-expo",
                  isOpen && "-translate-y-[3.5px] -rotate-45",
                )}
              />
            </button>
          </div>
        </nav>

        <div
          id="mobile-menu"
          className={cn(
            "overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-expo lg:hidden",
            isOpen ? "mt-3 max-h-72 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="flex flex-col gap-4 px-2 pb-2 pt-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-body text-sm font-semibold tracking-[-0.02em] text-creme"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
