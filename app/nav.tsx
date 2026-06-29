"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "The Founder", href: "#founder" },
];

export function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const syncScrollState = () => setIsScrolled(window.scrollY > 24);

    syncScrollState();
    window.addEventListener("scroll", syncScrollState, { passive: true });

    return () => window.removeEventListener("scroll", syncScrollState);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,border-color,height] duration-300 ease-expo",
        isScrolled
          ? "h-16 border-b border-creme/10 bg-ink/70 backdrop-blur-xl"
          : "h-20 border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-full w-full max-w-[1320px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          aria-label="Austin Miles Media home"
          className="relative h-9 w-32 transition-opacity hover:opacity-80"
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

        <div className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2 font-body text-sm font-semibold tracking-[-0.02em] text-creme/70 transition-colors hover:text-creme"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild size="sm">
            <Link href="/get-started">Get started →</Link>
          </Button>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
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
          "overflow-hidden border-b border-creme/10 bg-ink/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 ease-expo lg:hidden",
          isOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="flex flex-col gap-5 px-5 py-6 sm:px-8">
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
    </header>
  );
}
