import Link from "next/link";

import { isAdminDemoMode } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Database, DealStatus } from "@/lib/supabase/types";

import { AdminShell } from "../admin-shell";
import { deleteDeal, updateDealDetails } from "../actions";
import { dealStatuses } from "../constants";
import { demoContacts, demoDeals } from "../demo-data";
import { KanbanBoard } from "./kanban-board";

type Contact = Database["public"]["Tables"]["contacts"]["Row"];
type Deal = Database["public"]["Tables"]["deals"]["Row"];

const statusMeta: Record<
  DealStatus,
  { icon: string; label: string; accent: string; badge: string }
> = {
  new_inquiry: {
    icon: "◎",
    label: "Interested",
    accent: "text-[#0b4a7a]",
    badge: "bg-[#eaf3ff] text-[#0b4a7a]",
  },
  contacted: {
    icon: "↗",
    label: "Proposal Sent",
    accent: "text-[#0b4a7a]",
    badge: "bg-[#eaf3ff] text-[#0b4a7a]",
  },
  call_booked: {
    icon: "◈",
    label: "Negotiation",
    accent: "text-[#0b4a7a]",
    badge: "bg-[#eaf3ff] text-[#0b4a7a]",
  },
  proposal_sent: {
    icon: "▭",
    label: "Pending Collection",
    accent: "text-[#0b4a7a]",
    badge: "bg-[#eaf3ff] text-[#0b4a7a]",
  },
  won: {
    icon: "♕",
    label: "Deal Won",
    accent: "text-[#0b4a7a]",
    badge: "bg-[#eaf3ff] text-[#0b4a7a]",
  },
  lost: {
    icon: "⊗",
    label: "Deal Lost",
    accent: "text-[#52677f]",
    badge: "bg-[#eef5ff] text-[#52677f]",
  },
};

function formatMoney(value: number | null) {
  if (!value) {
    return "Value not set";
  }

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function AdminPipelinePage({
  searchParams,
}: {
  searchParams?: Promise<{ view?: string; deal?: string }>;
}) {
  const params = await searchParams;
  const view = params?.view === "list" ? "list" : "board";
  const demoMode = isAdminDemoMode();
  const supabase = demoMode ? null : await createClient();

  let deals: Deal[];
  let contacts: Contact[];

  if (demoMode) {
    deals = demoDeals;
    contacts = demoContacts;
  } else {
    const [dealsResult, contactsResult] = await Promise.all([
      supabase!
        .from("deals")
        .select("*")
        .order("updated_at", { ascending: false }),
      supabase!.from("contacts").select("*"),
    ]);

    deals = dealsResult.data ?? [];
    contacts = contactsResult.data ?? [];
  }

  const contactsById = new Map(
    contacts.map((contact) => [contact.id, contact]),
  );
  const selectedDeal = params?.deal
    ? deals.find((deal) => deal.id === params.deal) ?? null
    : null;
  const selectedContact = selectedDeal?.contact_id
    ? contactsById.get(selectedDeal.contact_id) ?? null
    : null;
  const closeHref = view === "list" ? "/admin/pipeline?view=list" : "/admin/pipeline";

  return (
    <AdminShell>
      <div
        className={
          selectedDeal
            ? "pointer-events-none select-none blur-[2px] transition-[filter]"
            : "transition-[filter]"
        }
      >
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="font-body text-3xl font-black tracking-[-0.045em] text-[#0b4a7a]">
              Sales Pipeline
            </h1>
            <p className="mt-1 font-body text-sm text-[#52677f]">
              Drag deals between stages to update
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-xl border border-[#dbe6f1] bg-white p-1 shadow-sm">
            <Link
              href="/admin/pipeline"
              className={`rounded-lg px-3 py-2 font-body text-xs font-bold transition-colors ${
                view === "board"
                  ? "bg-[#0b4a7a] text-white shadow-sm"
                  : "text-[#52677f] hover:bg-[#f6f9fc]"
              }`}
            >
              Board
            </Link>
            <Link
              href="/admin/pipeline?view=list"
              className={`rounded-lg px-3 py-2 font-body text-xs font-bold transition-colors ${
                view === "list"
                  ? "bg-[#0b4a7a] text-white shadow-sm"
                  : "text-[#52677f] hover:bg-[#f6f9fc]"
              }`}
            >
              List
            </Link>
            </div>
            <Link
              href="/admin/pipeline/new"
              className="rounded-xl bg-[#0b4a7a] px-5 py-3 font-body text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,74,122,0.18)]"
            >
              + New Deal
            </Link>
          </div>
        </div>

        <div className="mb-5 grid gap-4 md:grid-cols-2">
          <MetricCard
            label="Deals Won"
            value={formatMoney(
              deals
                .filter((deal) => deal.status === "won")
                .reduce((sum, deal) => sum + (deal.value ?? 0), 0),
            )}
            icon="$"
            tone="teal"
          />
          <MetricCard
            label="Pipeline Value"
            value={formatMoney(deals.reduce((sum, deal) => sum + (deal.value ?? 0), 0))}
            icon="@"
            tone="pink"
          />
        </div>

        {view === "list" ? (
          <PipelineList deals={deals} contactsById={contactsById} />
        ) : (
          <KanbanBoard deals={deals} contacts={contacts} />
        )}
      </div>

      {selectedDeal && (
        <DealQuickEditModal
          deal={selectedDeal}
          contact={selectedContact}
          closeHref={closeHref}
        />
      )}
    </AdminShell>
  );
}

function MetricCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: string;
  tone: "teal" | "pink";
}) {
  return (
    <article className="rounded-2xl border border-[#dbe6f1] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className={`flex size-10 items-center justify-center rounded-xl font-body text-lg font-bold ${
            tone === "teal"
              ? "bg-[#eaf3ff] text-[#0b4a7a]"
              : "bg-[#eaf3ff] text-[#0b4a7a]"
          }`}
        >
          {icon}
        </span>
        <p className="font-body text-sm font-medium text-[#52677f]">{label}</p>
      </div>
      <p
        className={`mt-5 font-body text-3xl font-black tracking-[-0.04em] ${
          tone === "teal" ? "text-[#0b4a7a]" : "text-[#0b4a7a]"
        }`}
      >
        {value}
      </p>
    </article>
  );
}

function DealQuickEditModal({
  deal,
  contact,
  closeHref,
}: {
  deal: Deal;
  contact: Contact | null;
  closeHref: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <Link
        href={closeHref}
        aria-label="Close deal details"
        className="absolute inset-0 bg-[#031024]/35 backdrop-blur-md"
      />

      <form
        action={updateDealDetails}
        className="relative z-10 max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-[#dbe6f1] bg-white p-5 shadow-[0_30px_90px_rgba(3,16,36,0.22)] sm:p-6"
      >
        <input type="hidden" name="id" value={deal.id} />
        <input type="hidden" name="contactId" value={contact?.id ?? ""} />

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-[#7b8da3]">
              Deal details
            </p>
            <h2 className="mt-2 font-display text-3xl font-black tracking-[-0.055em] text-[#0b4a7a]">
              {deal.title}
            </h2>
          </div>
          <Link
            href={closeHref}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#dbe6f1] font-body text-xl leading-none text-[#7b8da3] transition-colors hover:bg-[#f6f9fc] hover:text-[#0b4a7a]"
          >
            ×
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
          <section className="grid gap-4">
            <label className="grid gap-2">
              <span className="font-body text-sm font-bold text-[#0b4a7a]">Title</span>
              <input
                name="title"
                defaultValue={deal.title}
                className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="grid gap-2">
                <span className="font-body text-sm font-bold text-[#0b4a7a]">
                  Stage
                </span>
                <select
                  name="status"
                  defaultValue={deal.status}
                  className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
                >
                  {dealStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="font-body text-sm font-bold text-[#0b4a7a]">
                  Value
                </span>
                <input
                  name="value"
                  type="number"
                  min="0"
                  step="100"
                  defaultValue={deal.value ?? ""}
                  className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
                />
              </label>

              <label className="grid gap-2">
                <span className="font-body text-sm font-bold text-[#0b4a7a]">
                  Follow-up
                </span>
                <input
                  name="nextFollowUp"
                  type="date"
                  defaultValue={deal.next_follow_up ?? ""}
                  className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="font-body text-sm font-bold text-[#0b4a7a]">Notes</span>
              <textarea
                name="notes"
                defaultValue={deal.notes ?? ""}
                rows={7}
                className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
              />
            </label>
          </section>

          <section className="grid content-start gap-4 rounded-3xl border border-[#dbe6f1] bg-[#f8fbff] p-4">
            <div>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[#7b8da3]">
                Synced contact
              </p>
              <p className="mt-2 font-body text-sm font-semibold text-[#52677f]">
                Changes here update the matching contact record.
              </p>
            </div>

            {contact ? (
              <>
                <label className="grid gap-2">
                  <span className="font-body text-sm font-bold text-[#0b4a7a]">
                    Name
                  </span>
                  <input
                    name="contactName"
                    defaultValue={contact.name}
                    className="rounded-2xl border border-[#dbe6f1] bg-white px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="font-body text-sm font-bold text-[#0b4a7a]">
                    Business
                  </span>
                  <input
                    name="business"
                    defaultValue={contact.business ?? ""}
                    className="rounded-2xl border border-[#dbe6f1] bg-white px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="font-body text-sm font-bold text-[#0b4a7a]">
                    Email
                  </span>
                  <input
                    name="email"
                    type="email"
                    defaultValue={contact.email}
                    className="rounded-2xl border border-[#dbe6f1] bg-white px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <label className="grid gap-2">
                    <span className="font-body text-sm font-bold text-[#0b4a7a]">
                      Phone
                    </span>
                    <input
                      name="phone"
                      defaultValue={contact.phone ?? ""}
                      className="rounded-2xl border border-[#dbe6f1] bg-white px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="font-body text-sm font-bold text-[#0b4a7a]">
                      Handle
                    </span>
                    <input
                      name="handle"
                      defaultValue={contact.handle ?? ""}
                      className="rounded-2xl border border-[#dbe6f1] bg-white px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
                    />
                  </label>
                </div>
                <input
                  type="hidden"
                  name="businessType"
                  value={contact.business_type ?? ""}
                />
                <input type="hidden" name="contactNotes" value={contact.notes ?? ""} />
              </>
            ) : (
              <p className="rounded-2xl border border-dashed border-[#dbe6f1] bg-white p-4 font-body text-sm text-[#52677f]">
                No contact is linked to this deal yet.
              </p>
            )}
          </section>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/admin/pipeline/${deal.id}`}
            className="font-body text-sm font-semibold text-[#7b8da3] transition-colors hover:text-[#0b4a7a]"
          >
            Open full page
          </Link>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="submit"
              formAction={deleteDeal}
              className="rounded-full border border-[#dbe6f1] px-5 py-3 font-body text-sm font-bold text-[#9a2f2f] transition-colors hover:border-[#9a2f2f]/30 hover:bg-[#fff5f5]"
            >
              Delete deal
            </button>
            <button className="rounded-full bg-[#0b4a7a] px-6 py-3 font-body text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,74,122,0.18)] transition-colors hover:bg-[#08395e]">
              Save changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function PipelineList({
  deals,
  contactsById,
}: {
  deals: Deal[];
  contactsById: Map<string, Contact>;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#dbe6f1] bg-white shadow-sm">
      <div className="grid grid-cols-[1.4fr_1fr_0.7fr_0.8fr_0.5fr] border-b border-[#e7eff7] px-5 py-3 font-body text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#7b8da3]">
        <span>Deal</span>
        <span>Contact</span>
        <span>Status</span>
        <span>Value</span>
        <span>Owner</span>
      </div>
      {deals.map((deal) => {
        const contact = deal.contact_id ? contactsById.get(deal.contact_id) : null;
        const status = dealStatuses.find((item) => item.value === deal.status);

        return (
          <Link
            href={`/admin/pipeline?view=list&deal=${deal.id}`}
            key={deal.id}
            className="grid grid-cols-[1.4fr_1fr_0.7fr_0.8fr_0.5fr] items-center border-b border-[#eaf1f8] px-5 py-4 transition-colors last:border-b-0 hover:bg-[#f8fbff]"
          >
            <div>
              <p className="font-body text-sm font-bold text-[#0b4a7a]">
                {deal.title}
              </p>
              <p className="mt-1 line-clamp-1 font-body text-xs text-[#7b8da3]">
                {deal.notes ?? "No notes"}
              </p>
            </div>
            <p className="font-body text-sm text-[#52677f]">
              {contact?.business ?? contact?.name ?? "-"}
            </p>
            <span
              className={`w-fit rounded-full px-2.5 py-1 font-body text-[0.65rem] font-bold ${
                statusMeta[deal.status].badge
              }`}
            >
              {status ? statusMeta[status.value].label : deal.status}
            </span>
            <p className="font-body text-sm font-bold text-[#0b4a7a]">
              {formatMoney(deal.value)}
            </p>
            <p className="font-body text-sm text-[#52677f]">Austin</p>
          </Link>
        );
      })}
    </section>
  );
}
