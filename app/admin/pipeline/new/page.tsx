import Link from "next/link";

import type { DealStatus } from "@/lib/supabase/types";

import { createDealWithContact } from "../../actions";
import { AdminShell } from "../../admin-shell";
import { dealStatuses } from "../../constants";

export default async function NewDealPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: DealStatus }>;
}) {
  const params = await searchParams;
  const defaultStatus = params?.status ?? "new_inquiry";

  return (
    <AdminShell>
      <div className="mb-6">
        <Link
          href="/admin/pipeline"
          className="font-body text-sm font-semibold text-[#7b8da3] transition-colors hover:text-[#0b4a7a]"
        >
          ← Back to pipeline
        </Link>
        <h1 className="mt-4 font-display text-4xl font-black tracking-[-0.055em] text-[#0b4a7a]">
          Add deal
        </h1>
        <p className="mt-2 font-body text-sm font-medium text-[#52677f]">
          Create the deal and its contact together so the pipeline and contacts stay
          synced.
        </p>
      </div>

      <form action={createDealWithContact} className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
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
                required
                placeholder="Summit Roofing managed content"
                className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none placeholder:text-[#9aabc0] focus:border-[#0b4a7a]"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-body text-sm font-bold text-[#0b4a7a]">Stage</span>
              <select
                name="status"
                defaultValue={defaultStatus}
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
                placeholder="4500"
                className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none placeholder:text-[#9aabc0] focus:border-[#0b4a7a]"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-body text-sm font-bold text-[#0b4a7a]">
                Next follow-up
              </span>
              <input
                name="nextFollowUp"
                type="date"
                className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
              />
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="font-body text-sm font-bold text-[#0b4a7a]">Notes</span>
              <textarea
                name="notes"
                rows={6}
                placeholder="What does Austin need to know about this deal?"
                className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none placeholder:text-[#9aabc0] focus:border-[#0b4a7a]"
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

          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="font-body text-sm font-bold text-[#0b4a7a]">Name</span>
              <input
                name="contactName"
                required
                placeholder="Jake Miller"
                className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none placeholder:text-[#9aabc0] focus:border-[#0b4a7a]"
              />
            </label>
            <label className="grid gap-2">
              <span className="font-body text-sm font-bold text-[#0b4a7a]">Business</span>
              <input
                name="business"
                placeholder="Summit Roofing Co."
                className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none placeholder:text-[#9aabc0] focus:border-[#0b4a7a]"
              />
            </label>
            <label className="grid gap-2">
              <span className="font-body text-sm font-bold text-[#0b4a7a]">Email</span>
              <input
                name="email"
                type="email"
                required
                placeholder="jake@summitroofing.co"
                className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none placeholder:text-[#9aabc0] focus:border-[#0b4a7a]"
              />
            </label>
            <label className="grid gap-2">
              <span className="font-body text-sm font-bold text-[#0b4a7a]">Phone</span>
              <input
                name="phone"
                placeholder="(512) 555-0128"
                className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none placeholder:text-[#9aabc0] focus:border-[#0b4a7a]"
              />
            </label>
            <label className="grid gap-2">
              <span className="font-body text-sm font-bold text-[#0b4a7a]">Handle</span>
              <input
                name="handle"
                placeholder="@summitroofing"
                className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none placeholder:text-[#9aabc0] focus:border-[#0b4a7a]"
              />
            </label>
            <label className="grid gap-2">
              <span className="font-body text-sm font-bold text-[#0b4a7a]">
                Business type
              </span>
              <input
                name="businessType"
                placeholder="Local service business"
                className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none placeholder:text-[#9aabc0] focus:border-[#0b4a7a]"
              />
            </label>
            <label className="grid gap-2">
              <span className="font-body text-sm font-bold text-[#0b4a7a]">
                Contact notes
              </span>
              <textarea
                name="contactNotes"
                rows={4}
                placeholder="Fit, preferences, context, or anything Austin should know."
                className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none placeholder:text-[#9aabc0] focus:border-[#0b4a7a]"
              />
            </label>
          </div>
        </section>

        <div className="xl:col-span-2">
          <button className="rounded-full bg-[#0b4a7a] px-6 py-3 font-body text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,74,122,0.18)] transition-colors hover:bg-[#08395e]">
            Create deal
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
