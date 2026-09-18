"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { signOut } from "./actions";
import {
  ADMIN_SIDEBAR_COLLAPSED_VALUE,
  ADMIN_SIDEBAR_COOKIE,
} from "./constants";

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
    className: "pointer-events-none",
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
    case "collapse":
      return (
        <svg {...common}>
          <path d="M11 17 6 12l5-5" />
          <path d="M18 17l-5-5 5-5" />
        </svg>
      );
    case "expand":
      return (
        <svg {...common}>
          <path d="M13 7l5 5-5 5" />
          <path d="M6 7l5 5-5 5" />
        </svg>
      );
    case "signout":
      return (
        <svg {...common}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="M16 17l5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
  }
}

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function persistSidebarCollapsed(collapsed: boolean) {
  document.cookie = `${ADMIN_SIDEBAR_COOKIE}=${collapsed ? ADMIN_SIDEBAR_COLLAPSED_VALUE : "expanded"}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function AdminShell({
  children,
  initialCollapsed = false,
}: {
  children: ReactNode;
  initialCollapsed?: boolean;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    persistSidebarCollapsed(next);
  };

  return (
    <main className="relative z-10 min-h-screen bg-[#f6f9fc] text-[#0b4a7a]">
      <aside
        id="admin-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col overflow-hidden border-r border-white/10 bg-ink text-creme transition-[width] duration-300 ease-expo motion-reduce:transition-none lg:flex",
          collapsed ? "w-[4.5rem]" : "w-56",
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -left-28 -top-28 size-72 rounded-full bg-[radial-gradient(closest-side,rgba(248,251,255,0.16),rgba(70,205,240,0.08),transparent)] blur-xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-24 left-1/2 h-80 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(70,205,240,0.11),transparent)] blur-2xl"
        />

        <div
          className={cn(
            "relative z-10 flex h-20 items-center",
            collapsed ? "justify-center px-2" : "justify-between px-3",
          )}
        >
          {collapsed ? null : (
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
          )}
          <button
            type="button"
            aria-controls="admin-sidebar"
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={toggleCollapsed}
            className="flex size-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-creme/70 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-creme"
          >
            <AdminIcon name={collapsed ? "expand" : "collapse"} />
          </button>
        </div>

        <nav
          className={cn(
            "relative z-10 flex flex-1 flex-col gap-1.5 py-2",
            collapsed ? "px-2" : "px-3",
          )}
        >
          {adminLinks.map((link) => {
            const active = isActivePath(pathname, link.href);

            return (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                prefetch
                title={collapsed ? link.label : undefined}
                aria-current={active ? "page" : undefined}
                aria-label={collapsed ? link.label : undefined}
                className={cn(
                  "group flex items-center rounded-2xl py-3 font-body text-sm font-semibold transition-colors",
                  collapsed ? "justify-center px-0" : "gap-3 px-3",
                  active
                    ? "bg-white/10 text-creme"
                    : "text-creme/62 hover:bg-white/10 hover:text-creme",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-xl border transition-colors",
                    active
                      ? "border-white/20 bg-white/[0.08] text-creme"
                      : "border-white/10 bg-white/[0.04] text-creme/42 group-hover:border-white/20 group-hover:bg-white/[0.08] group-hover:text-creme",
                  )}
                >
                  <AdminIcon name={link.icon} />
                </span>
                <span
                  aria-hidden={collapsed}
                  className={cn(
                    "overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-expo motion-reduce:transition-none",
                    collapsed ? "max-w-0 opacity-0" : "max-w-[9rem] opacity-100",
                  )}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div
          className={cn(
            "relative z-10 border-t border-white/10",
            collapsed ? "p-2" : "p-4",
          )}
        >
          <div
            className={cn(
              "mb-3 flex items-center",
              collapsed ? "justify-center" : "gap-3",
            )}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 font-body text-xs font-bold text-creme">
              A
            </span>
            {collapsed ? null : (
              <div>
                <p className="font-body text-sm font-semibold text-creme">
                  Austin
                </p>
                <p className="font-body text-xs text-creme/45">Admin preview</p>
              </div>
            )}
          </div>
          <form action={signOut}>
            <button
              type="submit"
              title={collapsed ? "Sign out" : undefined}
              aria-label={collapsed ? "Sign out" : undefined}
              className={cn(
                "flex items-center whitespace-nowrap rounded-xl border border-white/12 bg-white/[0.03] font-body text-xs font-semibold text-creme/62 transition-colors hover:bg-white/10 hover:text-creme",
                collapsed ? "mx-auto size-8 justify-center" : "w-full gap-2 px-3 py-2",
              )}
            >
              {collapsed ? <AdminIcon name="signout" /> : "Sign out"}
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

      <div
        className={cn(
          "min-h-screen px-4 py-6 transition-[margin] duration-300 ease-expo motion-reduce:transition-none lg:px-8 lg:py-8",
          collapsed ? "lg:ml-[4.5rem]" : "lg:ml-56",
        )}
      >
        {children}
      </div>
    </main>
  );
}
