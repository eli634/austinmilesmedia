import Link from "next/link";

import { isAdminDemoMode } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

import { AdminShell } from "./admin-shell";
import { dealStatuses } from "./constants";
import { demoBookings, demoDeals, demoInquiries } from "./demo-data";

function formatDate(value: string | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function AdminPage() {
  const demoMode = isAdminDemoMode();
  const supabase = demoMode ? null : await createClient();

  const recentInquiries = demoMode
    ? demoInquiries.slice(0, 5)
    : ((await supabase!
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)).data ?? []);

  const openDeals = demoMode
    ? demoDeals.filter((deal) => deal.status !== "won" && deal.status !== "lost")
    : ((await supabase!
        .from("deals")
        .select("*")
        .not("status", "in", "(won,lost)")
        .order("updated_at", { ascending: false })
        .limit(6)).data ?? []);

  const upcomingBookings = demoMode
    ? demoBookings.filter((booking) => booking.status === "scheduled")
    : ((await supabase!
        .from("bookings")
        .select("*")
        .gte("starts_at", new Date().toISOString())
        .order("starts_at", { ascending: true })
        .limit(5)).data ?? []);

  const metrics = [
    {
      label: "New inquiries",
      value: demoMode
        ? demoInquiries.filter((inquiry) => inquiry.status === "new").length
        : recentInquiries.filter((inquiry) => inquiry.status === "new").length,
      href: "/admin/inquiries",
      helper: "Fresh leads to review",
    },
    {
      label: "Active deals",
      value: openDeals.length,
      href: "/admin/pipeline",
      helper: "In motion right now",
    },
    {
      label: "Bookings",
      value: upcomingBookings.length,
      href: "/admin/calendar",
      helper: "Upcoming calls/shoots",
    },
    {
      label: "Pipeline value",
      value: formatMoney(
        openDeals.reduce((total, deal) => total + (deal.value ?? 0), 0),
      ),
      href: "/admin/pipeline",
      helper: "Open revenue",
    },
  ];

  const openStages = dealStatuses.filter(
    (status) => status.value !== "won" && status.value !== "lost",
  );

  return (
    <AdminShell>
      <div className="mb-8 flex flex-col gap-5 rounded-[2rem] border border-[#dbe6f1] bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between lg:p-8">
        <div>
          <p className="mb-3 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[#7b8da3]">
            Austin CRM
          </p>
          <h1 className="font-display text-4xl font-black tracking-[-0.055em] text-[#0b4a7a] lg:text-5xl">
            Austin&apos;s dashboard
          </h1>
        </div>
        <div className="rounded-2xl border border-[#dbe6f1] bg-[#f6f9fc] px-4 py-3 text-left lg:text-right">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-[#7b8da3]">
            Today
          </p>
          <p className="mt-1 font-body text-sm font-bold text-[#0b4a7a]">
            {new Intl.DateTimeFormat("en", {
              weekday: "long",
              month: "short",
              day: "numeric",
            }).format(new Date())}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Link
            key={metric.label}
            href={metric.href}
            className="rounded-[1.75rem] border border-[#dbe6f1] bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <p className="font-body text-sm font-semibold text-[#52677f]">
              {metric.label}
            </p>
            <p className="mt-4 font-display text-4xl font-black tracking-[-0.06em] text-[#0b4a7a]">
              {metric.value}
            </p>
            <p className="mt-2 font-body text-xs font-medium text-[#7b8da3]">
              {metric.helper}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[2rem] border border-[#dbe6f1] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-[#7b8da3]">
                Needs action
              </p>
              <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.04em] text-[#0b4a7a]">
                Recent inquiries
              </h2>
            </div>
            <Link
              href="/admin/inquiries"
              className="rounded-full border border-[#dbe6f1] px-3 py-1.5 font-body text-xs font-semibold text-[#52677f] transition-colors hover:bg-[#eef5ff] hover:text-[#0b4a7a]"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-[#e7eef7]">
            {recentInquiries.map((inquiry) => (
              <article
                key={inquiry.id}
                className="grid gap-3 py-4 first:pt-0 last:pb-0 md:grid-cols-[1fr_auto] md:items-center"
              >
                <div>
                  <p className="font-body text-base font-bold text-[#0b4a7a]">
                    {inquiry.business || inquiry.name}
                  </p>
                  <p className="mt-1 font-body text-sm font-medium text-[#52677f]">
                    {inquiry.goal || inquiry.business_type || inquiry.email}
                  </p>
                  <p className="mt-2 font-body text-xs font-medium text-[#7b8da3]">
                    {inquiry.name} · {formatDate(inquiry.created_at)}
                  </p>
                </div>
                <Link
                  href="/admin/inquiries"
                  className="w-fit rounded-full bg-[#0b4a7a] px-3 py-1.5 font-body text-xs font-bold text-white transition-colors hover:bg-[#08395e]"
                >
                  Review
                </Link>
              </article>
            ))}
            {recentInquiries.length === 0 && (
              <p className="font-body text-sm text-[#7b8da3]">
                No inquiries yet.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-[#dbe6f1] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-[#7b8da3]">
                Schedule
              </p>
              <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.04em] text-[#0b4a7a]">
                Next bookings
              </h2>
            </div>
            <Link
              href="/admin/calendar"
              className="rounded-full border border-[#dbe6f1] px-3 py-1.5 font-body text-xs font-semibold text-[#52677f] transition-colors hover:bg-[#eef5ff] hover:text-[#0b4a7a]"
            >
              Calendar
            </Link>
          </div>
          <div className="grid gap-3">
            {upcomingBookings.slice(0, 5).map((booking) => (
              <article
                key={booking.id}
                className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] p-4"
              >
                <p className="font-body font-bold text-[#0b4a7a]">
                  {booking.title}
                </p>
                <p className="mt-2 font-body text-sm font-medium text-[#7b8da3]">
                  {formatDate(booking.starts_at)}
                </p>
              </article>
            ))}
            {upcomingBookings.length === 0 && (
              <p className="font-body text-sm text-[#7b8da3]">
                No bookings scheduled.
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-[2rem] border border-[#dbe6f1] bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-[#7b8da3]">
              Pipeline
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.04em] text-[#0b4a7a]">
              Deal flow by stage
            </h2>
          </div>
          <Link
            href="/admin/pipeline"
            className="w-fit rounded-full border border-[#dbe6f1] px-3 py-1.5 font-body text-xs font-semibold text-[#52677f] transition-colors hover:bg-[#eef5ff] hover:text-[#0b4a7a]"
          >
            Manage pipeline
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          {openStages.map((stage) => {
            const stageDeals = openDeals.filter(
              (deal) => deal.status === stage.value,
            );
            const stageValue = stageDeals.reduce(
              (total, deal) => total + (deal.value ?? 0),
              0,
            );

            return (
              <article
                key={stage.value}
                className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-body text-sm font-bold text-[#0b4a7a]">
                    {stage.label}
                  </p>
                  <span className="rounded-full bg-white px-2.5 py-1 font-body text-xs font-bold text-[#0b4a7a]">
                    {stageDeals.length}
                  </span>
                </div>
                <p className="mt-4 font-display text-3xl font-black tracking-[-0.055em] text-[#0b4a7a]">
                  {formatMoney(stageValue)}
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e1ebf5]">
                  <div
                    className="h-full rounded-full bg-[#0b4a7a]"
                    style={{
                      width: `${Math.min(100, Math.max(12, stageDeals.length * 24))}%`,
                    }}
                  />
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {openDeals.slice(0, 6).map((deal) => (
            <article
              key={deal.id}
              className="rounded-2xl border border-[#dbe6f1] p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-body font-bold text-[#0b4a7a]">
                    {deal.title}
                  </p>
                  <p className="mt-2 font-body text-sm font-medium text-[#7b8da3]">
                    {dealStatuses.find((status) => status.value === deal.status)
                      ?.label ?? deal.status}
                  </p>
                </div>
                <p className="font-body text-sm font-bold text-[#0b4a7a]">
                  {formatMoney(deal.value ?? 0)}
                </p>
              </div>
            </article>
          ))}
          {openDeals.length === 0 && (
            <p className="font-body text-sm text-[#7b8da3]">No open deals yet.</p>
          )}
        </div>
      </section>
    </AdminShell>
  );
}
