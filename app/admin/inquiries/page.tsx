import { isAdminDemoMode } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

import { AdminShell } from "../admin-shell";
import { promoteInquiry, updateInquiryStatus } from "../actions";
import { inquiryStatuses } from "../constants";
import { demoInquiries } from "../demo-data";

export default async function AdminInquiriesPage() {
  const inquiries = isAdminDemoMode()
    ? demoInquiries
    : ((await (await createClient())
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100)).data ?? []);

  return (
    <AdminShell>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="font-body text-3xl font-black tracking-[-0.045em] text-[#0b4a7a]">
            Contacts
          </h1>
          <p className="mt-1 font-body text-sm text-[#52677f]">
            {inquiries.length.toLocaleString()} contacts
          </p>
        </div>
        <button className="w-fit rounded-xl bg-[#0b4a7a] px-5 py-3 font-body text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,74,122,0.18)]">
          + Add Contact
        </button>
      </div>

      <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
        <div className="flex items-center gap-3 rounded-xl border border-[#dbe6f1] bg-white px-4 py-3 shadow-sm">
          <span className="font-body text-sm text-[#7b8da3]">Search</span>
          <input
            placeholder="Search by name, email, company..."
            className="w-full bg-transparent font-body text-sm text-[#0b4a7a] outline-none placeholder:text-[#9aabc0]"
          />
        </div>
        <select className="rounded-xl border border-[#dbe6f1] bg-white px-4 py-3 font-body text-sm text-[#0b4a7a] shadow-sm outline-none">
          <option>All Status</option>
          {inquiryStatuses.map((status) => (
            <option key={status.value}>{status.label}</option>
          ))}
        </select>
        <select className="rounded-xl border border-[#dbe6f1] bg-white px-4 py-3 font-body text-sm text-[#0b4a7a] shadow-sm outline-none">
          <option>All Owners</option>
          <option>Austin</option>
        </select>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#dbe6f1] bg-white shadow-sm">
        <div className="grid grid-cols-[1.2fr_1.2fr_0.8fr_0.7fr_0.55fr_0.3fr] border-b border-[#eaf1f8] px-5 py-3 font-body text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#7b8da3]">
          <span>Name</span>
          <span>Email</span>
          <span>Phone</span>
          <span>Status</span>
          <span>Owner</span>
          <span />
        </div>

        {inquiries.map((inquiry) => (
          <div
            key={inquiry.id}
            className="grid grid-cols-[1.2fr_1.2fr_0.8fr_0.7fr_0.55fr_0.3fr] items-center border-b border-[#eef3f8] px-5 py-4 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-[#eaf3ff] font-body text-xs font-bold text-[#0b4a7a]">
                {(inquiry.business || inquiry.name).slice(0, 1)}
              </span>
              <div>
                <p className="font-body text-sm font-bold text-[#0b4a7a]">
                  {inquiry.business || inquiry.name}
                </p>
                <p className="mt-0.5 font-body text-xs text-[#7b8da3]">
                  {inquiry.name}
                </p>
              </div>
            </div>
            <p className="font-body text-sm text-[#52677f]">{inquiry.email}</p>
            <p className="font-body text-sm text-[#7b8da3]">
              {inquiry.phone || "-"}
            </p>
            <div>
              <span className="rounded-full bg-[#eaf3ff] px-2.5 py-1 font-body text-xs font-bold text-[#0b4a7a]">
                {inquiry.status}
              </span>
            </div>
            <p className="font-body text-sm text-[#52677f]">Austin</p>
            <details className="relative">
              <summary className="cursor-pointer list-none font-body text-lg text-[#7b8da3]">
                ...
              </summary>
              <div className="absolute right-0 z-10 mt-2 grid w-44 gap-2 rounded-xl border border-[#dbe6f1] bg-white p-3 shadow-xl">
                <form action={promoteInquiry}>
                  <input type="hidden" name="inquiryId" value={inquiry.id} />
                  <button className="text-left font-body text-sm font-semibold text-[#0b4a7a]">
                    Promote to deal
                  </button>
                </form>
                <form action={updateInquiryStatus} className="grid gap-2">
                  <input type="hidden" name="id" value={inquiry.id} />
                  <select
                    name="status"
                    defaultValue={inquiry.status}
                    className="rounded-lg border border-[#dbe6f1] px-2 py-1 font-body text-xs"
                  >
                    {inquiryStatuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  <button className="text-left font-body text-sm font-semibold text-[#0b4a7a]">
                    Save status
                  </button>
                </form>
              </div>
            </details>
          </div>
        ))}
      </section>
    </AdminShell>
  );
}
