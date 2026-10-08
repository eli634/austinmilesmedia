import Link from "next/link";

import { isAdminDemoMode } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Database, InquiryStatus } from "@/lib/supabase/types";

import { promoteInquiry, updateInquiryStatus } from "../../actions";
import { inquiryStatuses } from "../../constants";
import { demoDeals, demoInquiries } from "../../demo-data";

type Inquiry = Omit<Database["public"]["Tables"]["inquiries"]["Row"], "raw_payload">;

const FILTERS = ["all", "new", "reviewed", "promoted", "archived"] as const;
type InquiryFilter = (typeof FILTERS)[number];

const PAGE_ERRORS = new Set(["Could not save this lead."]);

const statusTone: Record<InquiryStatus, string> = {
  new: "bg-[#eaf3ff] text-[#0b4a7a]",
  reviewed: "bg-[#f4f7fb] text-[#52677f]",
  promoted: "bg-[#eaf3ff] text-[#0b4a7a]",
  archived: "bg-[#f4f7fb] text-[#7b8da3]",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function isFilter(value: string | undefined): value is InquiryFilter {
  return FILTERS.some((filter) => filter === value);
}

function statusLabel(status: InquiryStatus) {
  return inquiryStatuses.find((item) => item.value === status)?.label ?? status;
}

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams?: Promise<{ inquiry?: string; filter?: string; error?: string }>;
}) {
  const params = await searchParams;
  const filter: InquiryFilter = isFilter(params?.filter) ? params.filter : "all";
  const error = params?.error && PAGE_ERRORS.has(params.error) ? params.error : undefined;
  const demoMode = isAdminDemoMode();
  const supabase = demoMode ? null : await createClient();

  let inquiries: Inquiry[];
  let dealsByInquiry = new Map<string, string>();

  if (demoMode) {
    inquiries = demoInquiries;
    dealsByInquiry = new Map(
      demoDeals
        .filter((deal) => deal.inquiry_id)
        .map((deal) => [deal.inquiry_id as string, deal.id]),
    );
  } else {
    const [inquiriesResult, dealsResult] = await Promise.all([
      supabase!
        .from("inquiries")
        .select(
          "id,created_at,status,business_type,goal,name,business,handle,email,phone,message,source",
        )
        .order("created_at", { ascending: false }),
      supabase!.from("deals").select("id,inquiry_id").not("inquiry_id", "is", null),
    ]);

    inquiries = inquiriesResult.data ?? [];
    dealsByInquiry = new Map(
      (dealsResult.data ?? [])
        .filter((deal) => deal.inquiry_id)
        .map((deal) => [deal.inquiry_id as string, deal.id]),
    );
  }

  const visible =
    filter === "all" ? inquiries : inquiries.filter((inquiry) => inquiry.status === filter);
  const newCount = inquiries.filter((inquiry) => inquiry.status === "new").length;
  const selected =
    inquiries.find((inquiry) => inquiry.id === params?.inquiry) ?? null;
  const selectedDealId = selected ? dealsByInquiry.get(selected.id) : undefined;

  return (
    <>
      <div className={selected ? "pointer-events-none select-none blur-[2px]" : undefined}>
        <div className="mb-6">
          <h1 className="font-body text-2xl font-black tracking-[-0.04em] text-[#0b4a7a]">
            Inquiries
          </h1>
          <p className="mt-1 font-body text-sm text-[#52677f]">
            {newCount.toLocaleString()} new · {inquiries.length.toLocaleString()} total from the
            website form
          </p>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {FILTERS.map((item) => {
            const label = item === "all" ? "All" : statusLabel(item);
            const active = filter === item;

            return (
              <Link
                key={item}
                href={item === "all" ? "/admin/inquiries" : `/admin/inquiries?filter=${item}`}
                className={
                  active
                    ? "rounded-full bg-[#0b4a7a] px-3 py-1.5 font-body text-xs font-bold text-white"
                    : "rounded-full border border-[#dbe6f1] bg-white px-3 py-1.5 font-body text-xs font-bold text-[#52677f] transition-colors hover:bg-[#eef5ff] hover:text-[#0b4a7a]"
                }
              >
                {label}
              </Link>
            );
          })}
        </div>

        <section className="grid gap-3">
          {visible.map((inquiry) => (
            <article
              key={inquiry.id}
              className="rounded-2xl border border-[#dbe6f1] bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-body text-base font-bold text-[#0b4a7a]">
                      {inquiry.business || inquiry.name}
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-1 font-body text-xs font-bold ${statusTone[inquiry.status]}`}
                    >
                      {statusLabel(inquiry.status)}
                    </span>
                  </div>
                  <p className="mt-1 font-body text-sm text-[#52677f]">
                    {inquiry.name}
                    {inquiry.goal ? ` · ${inquiry.goal}` : ""}
                    {inquiry.business_type ? ` · ${inquiry.business_type}` : ""}
                  </p>
                  <p className="mt-1 font-body text-xs text-[#7b8da3]">
                    {formatDate(inquiry.created_at)}
                  </p>
                </div>
                <Link
                  href={`/admin/inquiries?inquiry=${inquiry.id}${filter === "all" ? "" : `&filter=${filter}`}`}
                  className="w-fit rounded-full bg-[#0b4a7a] px-4 py-2 font-body text-xs font-bold text-white transition-colors hover:bg-[#08395e]"
                >
                  Open
                </Link>
              </div>
            </article>
          ))}

          {visible.length === 0 && (
            <div className="rounded-2xl border border-[#dbe6f1] bg-white px-5 py-10 text-center shadow-sm">
              <p className="font-body text-sm font-semibold text-[#0b4a7a]">
                No inquiries in this view.
              </p>
              <p className="mt-2 font-body text-sm text-[#7b8da3]">
                New website forms show up here as soon as they are saved.
              </p>
            </div>
          )}
        </section>
      </div>

      {selected && (
        <InquiryModal
          inquiry={selected}
          dealId={selectedDealId}
          filter={filter}
          error={error}
        />
      )}
    </>
  );
}

function InquiryModal({
  inquiry,
  dealId,
  filter,
  error,
}: {
  inquiry: Inquiry;
  dealId?: string;
  filter: InquiryFilter;
  error?: string;
}) {
  const closeHref =
    filter === "all" ? "/admin/inquiries" : `/admin/inquiries?filter=${filter}`;
  const fields: Array<[string, string | null]> = [
    ["Email", inquiry.email],
    ["Phone", inquiry.phone],
    ["Website", inquiry.handle],
    ["Business type", inquiry.business_type],
    ["Goal", inquiry.goal],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <Link
        href={closeHref}
        aria-label="Close inquiry"
        className="absolute inset-0 bg-[#031024]/35 backdrop-blur-md"
      />

      <div className="relative z-10 max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-[#dbe6f1] bg-white p-5 shadow-[0_30px_90px_rgba(3,16,36,0.22)] sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-xl font-black tracking-[-0.03em] text-[#0b4a7a]">
                {inquiry.business || inquiry.name}
              </h2>
              <span
                className={`rounded-full px-2.5 py-1 font-body text-xs font-bold ${statusTone[inquiry.status]}`}
              >
                {statusLabel(inquiry.status)}
              </span>
            </div>
            <p className="mt-2 font-body text-sm font-medium text-[#52677f]">
              {inquiry.name} · {formatDate(inquiry.created_at)}
            </p>
          </div>
          <Link
            href={closeHref}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#dbe6f1] font-body text-xl leading-none text-[#7b8da3] transition-colors hover:bg-[#f6f9fc] hover:text-[#0b4a7a]"
          >
            ×
          </Link>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt className="font-body text-xs font-bold uppercase tracking-[0.12em] text-[#7b8da3]">
                {label}
              </dt>
              <dd className="mt-1 font-body text-sm text-[#0b4a7a]">
                {label === "Email" && value ? (
                  <a className="underline decoration-[#dbe6f1] underline-offset-4" href={`mailto:${value}`}>
                    {value}
                  </a>
                ) : label === "Phone" && value ? (
                  <a className="underline decoration-[#dbe6f1] underline-offset-4" href={`tel:${value}`}>
                    {value}
                  </a>
                ) : (
                  value || "—"
                )}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] p-4">
          <p className="font-body text-xs font-bold uppercase tracking-[0.12em] text-[#7b8da3]">
            Message
          </p>
          <p className="mt-2 whitespace-pre-wrap font-body text-sm leading-relaxed text-[#0b4a7a]">
            {inquiry.message?.trim() || "No message included."}
          </p>
        </div>

        {error && (
          <p className="mt-4 rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm font-semibold text-[#0b4a7a]">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {inquiry.status !== "reviewed" && inquiry.status !== "promoted" && (
              <form action={updateInquiryStatus}>
                <input type="hidden" name="id" value={inquiry.id} />
                <input type="hidden" name="status" value="reviewed" />
                <button className="rounded-full border border-[#dbe6f1] px-4 py-2.5 font-body text-sm font-bold text-[#52677f] transition-colors hover:bg-[#f6f9fc] hover:text-[#0b4a7a]">
                  Mark reviewed
                </button>
              </form>
            )}
            {inquiry.status !== "archived" && (
              <form action={updateInquiryStatus}>
                <input type="hidden" name="id" value={inquiry.id} />
                <input type="hidden" name="status" value="archived" />
                <button className="rounded-full border border-[#dbe6f1] px-4 py-2.5 font-body text-sm font-bold text-[#52677f] transition-colors hover:bg-[#f6f9fc] hover:text-[#0b4a7a]">
                  Archive
                </button>
              </form>
            )}
            {inquiry.status === "archived" && (
              <form action={updateInquiryStatus}>
                <input type="hidden" name="id" value={inquiry.id} />
                <input type="hidden" name="status" value="new" />
                <button className="rounded-full border border-[#dbe6f1] px-4 py-2.5 font-body text-sm font-bold text-[#52677f] transition-colors hover:bg-[#f6f9fc] hover:text-[#0b4a7a]">
                  Mark new
                </button>
              </form>
            )}
          </div>

          {dealId ? (
            <Link
              href={`/admin/pipeline/${dealId}`}
              className="w-fit rounded-full bg-[#0b4a7a] px-5 py-2.5 font-body text-sm font-bold text-white transition-colors hover:bg-[#08395e]"
            >
              Open deal
            </Link>
          ) : (
            <form action={promoteInquiry}>
              <input type="hidden" name="inquiryId" value={inquiry.id} />
              <button className="w-fit rounded-full bg-[#0b4a7a] px-5 py-2.5 font-body text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,74,122,0.18)] transition-colors hover:bg-[#08395e]">
                Add to pipeline
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
