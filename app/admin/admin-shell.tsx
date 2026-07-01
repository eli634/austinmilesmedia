import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { signOut } from "./actions";

const adminLinks = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Contacts", href: "/admin/inquiries", icon: "contacts" },
  { label: "Pipeline", href: "/admin/pipeline", icon: "pipeline" },
  { label: "Calendar", href: "/admin/calendar", icon: "calendar" },
];

function AdminIcon({ name }: { name: string }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "pipeline":
      return (
        <svg {...common}>
          <path d="M4 6h7" />
          <path d="M4 12h12" />
          <path d="M4 18h16" />
          <circle cx="18" cy="6" r="2" />
        </svg>
      );
    case "contacts":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <circle cx="9.5" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <path d="M3 10h18" />
        </svg>
      );
    case "analytics":
      return (
        <svg {...common}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M8 16v-5" />
          <path d="M12 16V8" />
          <path d="M16 16v-3" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.04.04a2 2 0 1 1-2.83 2.83l-.04-.04A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.08a1.7 1.7 0 0 0-.4-1.1 1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.88.34l-.04.04a2 2 0 1 1-2.83-2.83l.04-.04A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3a2 2 0 1 1 0-4h.08a1.7 1.7 0 0 0 1.1-.4 1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.88l-.04-.04a2 2 0 1 1 2.83-2.83l.04.04A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3a2 2 0 1 1 4 0v.08a1.7 1.7 0 0 0 .4 1.1 1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.88-.34l.04-.04a2 2 0 1 1 2.83 2.83l-.04.04A1.7 1.7 0 0 0 19.4 9c.37.2.7.47 1 .8.3.3.57.63.8 1H21a2 2 0 1 1 0 4h-.08a1.7 1.7 0 0 0-1.1.4 1.7 1.7 0 0 0-.42-.2Z" />
        </svg>
      );
  }
}

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative z-10 min-h-screen bg-[#f6f9fc] text-[#0b4a7a]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 flex-col overflow-hidden border-r border-white/10 bg-ink text-creme lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-28 -top-28 size-72 rounded-full bg-[radial-gradient(closest-side,rgba(248,251,255,0.16),rgba(70,205,240,0.08),transparent)] blur-xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-24 left-1/2 h-80 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(70,205,240,0.11),transparent)] blur-2xl"
        />

        <div className="relative z-10 flex h-20 items-center px-5">
          <Link
            href="/admin"
            aria-label="Austin Miles Media admin"
            className="relative h-10 w-32"
          >
            <Image
              src="/amm-signature-white-transparent.png"
              alt="Austin Miles Media"
              fill
              priority
              sizes="128px"
              className="object-contain object-left"
            />
          </Link>
        </div>

        <nav className="relative z-10 flex flex-1 flex-col gap-1.5 px-3 py-2">
          {adminLinks.map((link) => (
            <Link
              key={`${link.label}-${link.href}`}
              href={link.href}
              prefetch
              className="group flex items-center gap-3 rounded-2xl px-3 py-3 font-body text-sm font-semibold text-creme/62 transition-colors hover:bg-white/10 hover:text-creme"
            >
              <span className="flex size-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-creme/42 transition-colors group-hover:border-white/20 group-hover:bg-white/[0.08] group-hover:text-creme">
                <AdminIcon name={link.icon} />
              </span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="relative z-10 border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-white/10 font-body text-xs font-bold text-creme">
              A
            </span>
            <div>
              <p className="font-body text-sm font-semibold text-creme">
                Austin
              </p>
              <p className="font-body text-xs text-creme/45">Admin preview</p>
            </div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full rounded-xl border border-white/12 bg-white/[0.03] px-3 py-2 font-body text-xs font-semibold text-creme/62 transition-colors hover:bg-white/10 hover:text-creme"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-[#dbe6f1] bg-white/90 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="relative h-8 w-28">
            <Image
              src="/amm-signature-dark.png"
              alt="Austin Miles Media"
              fill
              priority
              sizes="112px"
              className="object-contain object-left"
            />
          </Link>
          <div className="flex gap-2 overflow-x-auto">
            {adminLinks.slice(0, 4).map((link) => (
              <Link
                key={`${link.label}-mobile`}
                href={link.href}
                prefetch
                className="rounded-full border border-[#dbe6f1] px-3 py-1.5 font-body text-xs font-semibold text-[#52677f]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <div className="min-h-screen px-4 py-6 lg:ml-56 lg:px-8 lg:py-8">
        {children}
      </div>
    </main>
  );
}
