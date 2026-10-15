"use client";

import Link from "next/link";
import type { ReactNode } from "react";

const face =
  "relative h-12 items-center justify-center gap-2 rounded-full bg-creme px-7 font-body text-[0.92rem] font-semibold text-ink shadow-[0_14px_40px_rgba(70,205,240,0.2)] transition-[background-color,box-shadow] duration-300 hover:shadow-[0_18px_48px_rgba(248,251,255,0.22)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-creme";

export function FrameLink({
  href,
  children,
  full,
  className,
}: {
  href: string;
  children: ReactNode;
  full?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`${full ? "flex w-full" : "inline-flex"} ${face} ${className ?? ""}`}
    >
      {children}
      <span aria-hidden>→</span>
    </Link>
  );
}

export function FrameButton({
  children,
  disabled,
}: {
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`flex w-full ${face} disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-creme/35 disabled:shadow-none disabled:hover:shadow-none`}
    >
      {children}
    </button>
  );
}
