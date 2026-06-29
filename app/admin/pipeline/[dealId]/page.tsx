import Link from "next/link";
import { notFound } from "next/navigation";

import { isAdminDemoMode } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

import { deleteDeal, updateDealDetails } from "../../actions";
import { AdminShell } from "../../admin-shell";
import { dealStatuses } from "../../constants";
import { demoContacts, demoDeals } from "../../demo-data";

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

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ dealId: string }>;
}) {
  const { dealId } = await params;
  const demoMode = isAdminDemoMode();
  const supabase = demoMode ? null : await createClient();

  const deal = demoMode
    ? demoDeals.find((item) => item.id === dealId) ?? null
    : ((await supabase!.from("deals").select("*").eq("id", dealId).single()).data ??
      null);

  if (!deal) {
    notFound();
  }

  const contact = demoMode
    ? deal.contact_id
      ? demoContacts.find((item) => item.id === deal.contact_id) ?? null
      : null
    : deal.contact_id
      ? ((await supabase!
          .from("contacts")
          .select("*")
          .eq("id", deal.contact_id)
          .single()).data ?? null)
      : null;

  return (
    <AdminShell>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link
            href="/admin/pipeline"
            className="font-body text-sm font-semibold text-[#7b8da3] transition-colors hover:text-[#0b4a7a]"
          >
            ← Back to pipeline
          </Link>
          <h1 className="mt-4 font-display text-4xl font-black tracking-[-0.055em] text-[#0b4a7a]">
            {deal.title}
          </h1>
          <p className="mt-2 font-body text-sm font-medium text-[#52677f]">
            Edit deal details and the linked contact from one place.
          </p>
        </div>
        <div className="rounded-2xl border border-[#dbe6f1] bg-white px-5 py-4 shadow-sm">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-[#7b8da3]">
            Deal value
          </p>
          <p className="mt-1 font-display text-3xl font-black tracking-[-0.055em] text-[#0b4a7a]">
            {formatMoney(deal.value)}
          </p>
        </div>
      </div>

      <form action={updateDealDetails} className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <input type="hidden" name="id" value={deal.id} />
        <input type="hidden" name="contactId" value={contact?.id ?? ""} />

        <section className="rounded-[2rem] border border-[#dbe6f1] bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-[#7b8da3]">
              Kanban details
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.04em] text-[#0b4a7a]">
              Deal
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 md:col-span-2">
              <span className="font-body text-sm font-bold text-[#0b4a7a]">Title</span>
              <input
                name="title"
                defaultValue={deal.title}
                className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-body text-sm font-bold text-[#0b4a7a]">Stage</span>
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
              <span className="font-body text-sm font-bold text-[#0b4a7a]">Value</span>
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
                Next follow-up
              </span>
              <input
                name="nextFollowUp"
                type="date"
                defaultValue={deal.next_follow_up ?? ""}
                className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
              />
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="font-body text-sm font-bold text-[#0b4a7a]">Notes</span>
              <textarea
                name="notes"
                defaultValue={deal.notes ?? ""}
                rows={6}
                className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
              />
            </label>
          </div>
        </section>

        <section className="rounded-[2rem] border border-[#dbe6f1] bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-[#7b8da3]">
              Synced contact
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.04em] text-[#0b4a7a]">
              Contact
            </h2>
          </div>

          {contact ? (
            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="font-body text-sm font-bold text-[#0b4a7a]">Name</span>
                <input
                  name="contactName"
                  defaultValue={contact.name}
                  className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
                />
              </label>
              <label className="grid gap-2">
                <span className="font-body text-sm font-bold text-[#0b4a7a]">
                  Business
                </span>
                <input
                  name="business"
                  defaultValue={contact.business ?? ""}
                  className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
                />
              </label>
              <label className="grid gap-2">
                <span className="font-body text-sm font-bold text-[#0b4a7a]">Email</span>
                <input
                  name="email"
                  type="email"
                  defaultValue={contact.email}
                  className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
                />
              </label>
              <label className="grid gap-2">
                <span className="font-body text-sm font-bold text-[#0b4a7a]">Phone</span>
                <input
                  name="phone"
                  defaultValue={contact.phone ?? ""}
                  className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
                />
              </label>
              <label className="grid gap-2">
                <span className="font-body text-sm font-bold text-[#0b4a7a]">Handle</span>
                <input
                  name="handle"
                  defaultValue={contact.handle ?? ""}
                  className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
                />
              </label>
              <label className="grid gap-2">
                <span className="font-body text-sm font-bold text-[#0b4a7a]">
                  Business type
                </span>
                <input
                  name="businessType"
                  defaultValue={contact.business_type ?? ""}
                  className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
                />
              </label>
              <label className="grid gap-2">
                <span className="font-body text-sm font-bold text-[#0b4a7a]">
                  Contact notes
                </span>
                <textarea
                  name="contactNotes"
                  defaultValue={contact.notes ?? ""}
                  rows={4}
                  className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
                />
              </label>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#dbe6f1] bg-[#f8fbff] p-5">
              <p className="font-body text-sm font-semibold text-[#0b4a7a]">
                No contact linked yet.
              </p>
              <p className="mt-2 font-body text-sm text-[#52677f]">
                Create new deals through the pipeline add flow to generate a synced
                contact automatically.
              </p>
            </div>
          )}
        </section>

        <div className="flex flex-col-reverse gap-3 xl:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            formAction={deleteDeal}
            className="w-fit rounded-full border border-[#dbe6f1] px-5 py-3 font-body text-sm font-bold text-[#9a2f2f] transition-colors hover:border-[#9a2f2f]/30 hover:bg-[#fff5f5]"
          >
            Delete deal
          </button>
          <button className="w-fit rounded-full bg-[#0b4a7a] px-6 py-3 font-body text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,74,122,0.18)] transition-colors hover:bg-[#08395e]">
            Save deal
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
