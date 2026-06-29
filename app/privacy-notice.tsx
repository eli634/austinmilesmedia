"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = "amm-privacy-notice-dismissed";

export function PrivacyNotice() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(
      !pathname.startsWith("/admin") &&
        window.localStorage.getItem(STORAGE_KEY) !== "true",
    );
  }, [pathname]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-[80] px-4 sm:bottom-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-white/15 bg-ink/90 p-4 text-creme shadow-[0_24px_80px_rgba(2,7,19,0.35)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <p className="font-body text-sm leading-relaxed text-creme/72">
          We use essential cookies and may use advertising/analytics pixels to
          understand campaign performance. See our{" "}
          <Link href="/privacy" className="font-semibold text-creme underline">
            privacy notice
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={() => {
            window.localStorage.setItem(STORAGE_KEY, "true");
            setIsVisible(false);
          }}
          className="shrink-0 rounded-full border border-white/15 bg-white px-4 py-2 font-body text-xs font-bold text-ink transition-colors hover:bg-creme"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
