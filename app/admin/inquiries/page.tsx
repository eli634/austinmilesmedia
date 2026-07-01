import Link from "next/link";

import { isAdminDemoMode } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

import { AdminShell } from "../admin-shell";
import {
  createContact,
  deleteContact,
  updateContactDetails,
} from "../actions";
import { dealStatuses } from "../constants";
import { demoContacts, demoDeals } from "../demo-data";

type Contact = Database["public"]["Tables"]["contacts"]["Row"];
type Deal = Database["public"]["Tables"]["deals"]["Row"];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export default async function AdminContactsPage({
  searchParams,
}: {
  searchParams?: Promise<{ contact?: string }>;
}) {
  const params = await searchParams;
  const demoMode = isAdminDemoMode();
  const supabase = demoMode ? null : await createClient();

  let contacts: Contact[];
  let deals: Deal[];

  if (demoMode) {
    contacts = demoContacts;
    deals = demoDeals;
  } else {
    const [contactsResult, dealsResult] = await Promise.all([
      supabase!
        .from("contacts")
        .select("*")
        .order("updated_at", { ascending: false }),
      supabase!
        .from("deals")
        .select("*")
        .order("updated_at", { ascending: false }),
    ]);

    contacts = contactsResult.data ?? [];
    deals = dealsResult.data ?? [];
  }
  const selectedContact =
    params?.contact && params.contact !== "new"
      ? contacts.find((contact) => contact.id === params.contact) ?? null
      : null;
  const isAddingContact = params?.contact === "new";
  const contactDeals = new Map<string, Deal[]>();

  for (const deal of deals) {
    if (!deal.contact_id) {
      continue;
    }

    contactDeals.set(deal.contact_id, [
      ...(contactDeals.get(deal.contact_id) ?? []),
      deal,
    ]);
  }

  return (
    <AdminShell>
      <div
        className={
          selectedContact || isAddingContact
            ? "pointer-events-none select-none blur-[2px] transition-[filter]"
            : "transition-[filter]"
        }
      >
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="font-body text-3xl font-black tracking-[-0.045em] text-[#0b4a7a]">
              Contacts
            </h1>
            <p className="mt-1 font-body text-sm text-[#52677f]">
              {contacts.length.toLocaleString()} CRM contacts synced with pipeline deals
            </p>
          </div>
          <Link
            href="/admin/inquiries?contact=new"
            className="w-fit rounded-xl bg-[#0b4a7a] px-5 py-3 font-body text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,74,122,0.18)]"
          >
            + Add Contact
          </Link>
        </div>

        <section className="overflow-hidden rounded-2xl border border-[#dbe6f1] bg-white shadow-sm">
          <div className="grid grid-cols-[1.2fr_1.1fr_0.8fr_0.7fr_0.55fr_0.45fr] border-b border-[#eaf1f8] px-5 py-3 font-body text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#7b8da3]">
            <span>Name</span>
            <span>Email</span>
            <span>Phone</span>
            <span>Deals</span>
            <span>Updated</span>
            <span />
          </div>

          {contacts.map((contact) => {
            const dealsForContact = contactDeals.get(contact.id) ?? [];
            const activeDeal = dealsForContact.find(
              (deal) => deal.status !== "won" && deal.status !== "lost",
            );
            const statusLabel = activeDeal
              ? dealStatuses.find((status) => status.value === activeDeal.status)?.label
              : null;

            return (
              <div
                key={contact.id}
                className="grid grid-cols-[1.2fr_1.1fr_0.8fr_0.7fr_0.55fr_0.45fr] items-center border-b border-[#eef3f8] px-5 py-4 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-[#eaf3ff] font-body text-xs font-bold text-[#0b4a7a]">
                    {(contact.business || contact.name).slice(0, 1)}
                  </span>
                  <div>
                    <p className="font-body text-sm font-bold text-[#0b4a7a]">
                      {contact.business || contact.name}
                    </p>
                    <p className="mt-0.5 font-body text-xs text-[#7b8da3]">
                      {contact.name}
                    </p>
                  </div>
                </div>
                <p className="font-body text-sm text-[#52677f]">{contact.email}</p>
                <p className="font-body text-sm text-[#7b8da3]">
                  {contact.phone || "-"}
                </p>
                <div>
                  <span className="rounded-full bg-[#eaf3ff] px-2.5 py-1 font-body text-xs font-bold text-[#0b4a7a]">
                    {dealsForContact.length} {dealsForContact.length === 1 ? "deal" : "deals"}
                  </span>
                  {statusLabel && (
                    <p className="mt-1 font-body text-[0.68rem] text-[#7b8da3]">
                      {statusLabel}
                    </p>
                  )}
                </div>
                <p className="font-body text-sm text-[#52677f]">
                  {formatDate(contact.updated_at)}
                </p>
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/pipeline/new?contactId=${contact.id}`}
                    className="rounded-full border border-[#dbe6f1] px-3 py-1.5 font-body text-xs font-bold text-[#52677f] transition-colors hover:bg-[#eef5ff] hover:text-[#0b4a7a]"
                  >
                    Deal
                  </Link>
                  <Link
                    href={`/admin/inquiries?contact=${contact.id}`}
                    className="rounded-full bg-[#0b4a7a] px-3 py-1.5 font-body text-xs font-bold text-white"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            );
          })}

          {contacts.length === 0 && (
            <div className="px-5 py-10 text-center">
              <p className="font-body text-sm font-semibold text-[#0b4a7a]">
                No contacts yet.
              </p>
              <p className="mt-2 font-body text-sm text-[#7b8da3]">
                Add a CRM contact or create a deal to sync one automatically.
              </p>
            </div>
          )}
        </section>
      </div>

      {(selectedContact || isAddingContact) && (
        <ContactModal
          contact={selectedContact}
          dealCount={selectedContact ? contactDeals.get(selectedContact.id)?.length ?? 0 : 0}
        />
      )}
    </AdminShell>
  );
}

function ContactModal({
  contact,
  dealCount,
}: {
  contact: Contact | null;
  dealCount: number;
}) {
  const action = contact ? updateContactDetails : createContact;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <Link
        href="/admin/inquiries"
        aria-label="Close contact details"
        className="absolute inset-0 bg-[#031024]/35 backdrop-blur-md"
      />

      <form
        action={action}
        className="relative z-10 max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-[#dbe6f1] bg-white p-5 shadow-[0_30px_90px_rgba(3,16,36,0.22)] sm:p-6"
      >
        {contact && <input type="hidden" name="id" value={contact.id} />}

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-[#7b8da3]">
              CRM contact
            </p>
            <h2 className="mt-2 font-display text-3xl font-black tracking-[-0.055em] text-[#0b4a7a]">
              {contact ? contact.business || contact.name : "Add contact"}
            </h2>
            {contact && (
              <p className="mt-2 font-body text-sm font-medium text-[#52677f]">
                Linked to {dealCount} {dealCount === 1 ? "deal" : "deals"}.
              </p>
            )}
          </div>
          <Link
            href="/admin/inquiries"
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#dbe6f1] font-body text-xl leading-none text-[#7b8da3] transition-colors hover:bg-[#f6f9fc] hover:text-[#0b4a7a]"
          >
            ×
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="font-body text-sm font-bold text-[#0b4a7a]">Name</span>
            <input
              name="contactName"
              required
              defaultValue={contact?.name ?? ""}
              className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
            />
          </label>
          <label className="grid gap-2">
            <span className="font-body text-sm font-bold text-[#0b4a7a]">Business</span>
            <input
              name="business"
              defaultValue={contact?.business ?? ""}
              className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
            />
          </label>
          <label className="grid gap-2">
            <span className="font-body text-sm font-bold text-[#0b4a7a]">Email</span>
            <input
              name="email"
              type="email"
              required
              defaultValue={contact?.email ?? ""}
              className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
            />
          </label>
          <label className="grid gap-2">
            <span className="font-body text-sm font-bold text-[#0b4a7a]">Phone</span>
            <input
              name="phone"
              defaultValue={contact?.phone ?? ""}
              className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
            />
          </label>
          <label className="grid gap-2">
            <span className="font-body text-sm font-bold text-[#0b4a7a]">Handle</span>
            <input
              name="handle"
              defaultValue={contact?.handle ?? ""}
              className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
            />
          </label>
          <label className="grid gap-2">
            <span className="font-body text-sm font-bold text-[#0b4a7a]">
              Business type
            </span>
            <input
              name="businessType"
              defaultValue={contact?.business_type ?? ""}
              className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
            />
          </label>
          <label className="grid gap-2 md:col-span-2">
            <span className="font-body text-sm font-bold text-[#0b4a7a]">
              Contact notes
            </span>
            <textarea
              name="contactNotes"
              rows={5}
              defaultValue={contact?.notes ?? ""}
              className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          {contact ? (
            <button
              type="submit"
              formAction={deleteContact}
              className="w-fit rounded-full border border-[#dbe6f1] px-5 py-3 font-body text-sm font-bold text-[#9a2f2f] transition-colors hover:border-[#9a2f2f]/30 hover:bg-[#fff5f5]"
            >
              Delete contact
            </button>
          ) : (
            <Link
              href="/admin/inquiries"
              className="w-fit rounded-full border border-[#dbe6f1] px-5 py-3 font-body text-sm font-bold text-[#52677f] transition-colors hover:bg-[#f6f9fc]"
            >
              Cancel
            </Link>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {contact && (
              <Link
                href={`/admin/pipeline/new?contactId=${contact.id}`}
                className="rounded-full border border-[#0b4a7a] px-5 py-3 font-body text-sm font-bold text-[#0b4a7a] transition-colors hover:bg-[#eef5ff]"
              >
                Add deal
              </Link>
            )}
            <button className="rounded-full bg-[#0b4a7a] px-6 py-3 font-body text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,74,122,0.18)] transition-colors hover:bg-[#08395e]">
              {contact ? "Save contact" : "Create contact"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
