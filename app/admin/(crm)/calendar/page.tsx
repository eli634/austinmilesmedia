import { Button } from "@/components/ui/button";
import { isAdminDemoMode } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

import { createBooking, updateBookingStatus } from "../../actions";
import { bookingStatuses } from "../../constants";
import { demoBookings, demoContacts, demoDeals } from "../../demo-data";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

const monthDays = Array.from({ length: 35 }, (_, index) => index + 1);
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default async function AdminCalendarPage() {
  const demoMode = isAdminDemoMode();
  const supabase = demoMode ? null : await createClient();

  let bookings: (typeof demoBookings)[number][];
  let deals: (typeof demoDeals)[number][];
  let contacts: (typeof demoContacts)[number][];

  if (demoMode) {
    bookings = demoBookings;
    deals = demoDeals.filter(
      (deal) => deal.status !== "won" && deal.status !== "lost",
    );
    contacts = demoContacts;
  } else {
    const [bookingsResult, dealsResult, contactsResult] = await Promise.all([
      supabase!
        .from("bookings")
        .select("*")
        .order("starts_at", { ascending: true })
        .limit(100),
      supabase!
        .from("deals")
        .select("*")
        .not("status", "in", "(won,lost)")
        .order("updated_at", { ascending: false }),
      supabase!
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    bookings = bookingsResult.data ?? [];
    deals = dealsResult.data ?? [];
    contacts = contactsResult.data ?? [];
  }

  const contactsById = new Map(
    contacts.map((contact) => [contact.id, contact]),
  );
  const today = new Date();
  const monthLabel = new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(today);
  const bookingsByDay = new Map<number, typeof bookings>();

  for (const booking of bookings) {
    const day = new Date(booking.starts_at).getDate();
    bookingsByDay.set(day, [...(bookingsByDay.get(day) ?? []), booking]);
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="font-body text-3xl font-black tracking-[-0.045em] text-[#0b4a7a]">
            Calendar
          </h1>
          <p className="mt-1 font-body text-sm text-[#52677f]">
            Track calls, shoots, reviews, and next-step meetings.
          </p>
        </div>
        <button className="w-fit rounded-xl bg-[#0b4a7a] px-5 py-3 font-body text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,74,122,0.18)]">
          + New Booking
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="overflow-hidden rounded-3xl border border-[#dbe6f1] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#eaf1f8] px-6 py-5">
            <div>
              <p className="font-body text-sm font-semibold text-[#7b8da3]">
                Schedule
              </p>
              <h2 className="mt-1 font-body text-2xl font-black tracking-[-0.04em] text-[#0b4a7a]">
                {monthLabel}
              </h2>
            </div>
            <div className="flex gap-2">
              <button className="rounded-xl border border-[#dbe6f1] px-3 py-2 font-body text-sm font-bold text-[#52677f]">
                Prev
              </button>
              <button className="rounded-xl border border-[#dbe6f1] px-3 py-2 font-body text-sm font-bold text-[#52677f]">
                Next
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-[#eaf1f8] bg-[#f8fbff]">
            {weekdays.map((day) => (
              <div
                key={day}
                className="px-3 py-3 text-center font-body text-xs font-bold uppercase tracking-[0.12em] text-[#7b8da3]"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {monthDays.map((day) => {
              const dayBookings = bookingsByDay.get(day) ?? [];
              const isToday = day === today.getDate();

              return (
                <div
                  key={day}
                  className="min-h-28 border-b border-r border-[#eef3f8] p-3 last:border-r-0"
                >
                  <span
                    className={`flex size-8 items-center justify-center rounded-full font-body text-sm font-bold ${
                      isToday
                        ? "bg-[#0b4a7a] text-white"
                        : "text-[#52677f]"
                    }`}
                  >
                    {day}
                  </span>
                  <div className="mt-2 grid gap-1">
                    {dayBookings.slice(0, 2).map((booking) => (
                      <div
                        key={booking.id}
                        className="truncate rounded-md bg-[#eaf3ff] px-2 py-1 font-body text-[0.68rem] font-semibold text-[#0b4a7a]"
                      >
                        {booking.title}
                      </div>
                    ))}
                    {dayBookings.length > 2 && (
                      <p className="font-body text-[0.68rem] text-[#7b8da3]">
                        +{dayBookings.length - 2} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="grid gap-5">
          <section className="rounded-3xl border border-[#dbe6f1] bg-white p-6 shadow-sm">
            <h2 className="font-body text-xl font-black tracking-[-0.04em] text-[#0b4a7a]">
              Add booking
            </h2>
          <form action={createBooking} className="mt-6 grid gap-4">
            <label className="grid gap-2 font-body text-sm text-[#52677f]">
              Title
              <input
                name="title"
                required
                placeholder="Discovery call"
                className="rounded-xl border border-[#dbe6f1] bg-white px-3 py-3 text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
              />
            </label>
            <label className="grid gap-2 font-body text-sm text-[#52677f]">
              Date and time
              <input
                name="startsAt"
                type="datetime-local"
                required
                className="rounded-xl border border-[#dbe6f1] bg-white px-3 py-3 text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
              />
            </label>
            <label className="grid gap-2 font-body text-sm text-[#52677f]">
              Deal
              <select
                name="dealId"
                className="rounded-xl border border-[#dbe6f1] bg-white px-3 py-3 text-[#0b4a7a] outline-none"
              >
                <option value="">No deal</option>
                {deals.map((deal) => (
                  <option key={deal.id} value={deal.id}>
                    {deal.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 font-body text-sm text-[#52677f]">
              Contact
              <select
                name="contactId"
                className="rounded-xl border border-[#dbe6f1] bg-white px-3 py-3 text-[#0b4a7a] outline-none"
              >
                <option value="">No contact</option>
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.business || contact.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 font-body text-sm text-[#52677f]">
              Location or link
              <input
                name="location"
                placeholder="Google Meet, phone, job site..."
                className="rounded-xl border border-[#dbe6f1] bg-white px-3 py-3 text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
              />
            </label>
            <label className="grid gap-2 font-body text-sm text-[#52677f]">
              Notes
              <textarea
                name="notes"
                rows={4}
                className="resize-none rounded-xl border border-[#dbe6f1] bg-white px-3 py-3 text-[#0b4a7a] outline-none focus:border-[#0b4a7a]"
              />
            </label>
            <Button
              type="submit"
              size="lg"
              className="border-[#0b4a7a] bg-[#0b4a7a] text-white hover:bg-[#0b4a7a] hover:text-white"
            >
              Create booking
            </Button>
          </form>
          </section>

          <section className="rounded-3xl border border-[#dbe6f1] bg-white p-6 shadow-sm">
          <h2 className="font-body text-xl font-black tracking-[-0.04em] text-[#0b4a7a]">
            Agenda
          </h2>
          <div className="mt-6 grid gap-3">
            {bookings.map((booking) => {
              const contact = booking.contact_id
                ? contactsById.get(booking.contact_id)
                : null;

              return (
                <article
                  key={booking.id}
                  className="rounded-2xl border border-[#dbe6f1] p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-body text-base font-semibold text-[#0b4a7a]">
                        {booking.title}
                      </h3>
                      <p className="mt-2 font-body text-sm text-[#7b8da3]">
                        {formatDate(booking.starts_at)}
                      </p>
                      {contact && (
                        <p className="mt-1 font-body text-sm text-[#7b8da3]">
                          {contact.business || contact.name}
                        </p>
                      )}
                      {booking.location && (
                        <p className="mt-3 font-body text-sm text-[#52677f]">
                          {booking.location}
                        </p>
                      )}
                      {booking.notes && (
                        <p className="max-w-[62ch] font-body font-medium leading-relaxed text-[#52677f] mt-3 text-sm">{booking.notes}</p>
                      )}
                    </div>

                    <form action={updateBookingStatus} className="grid gap-2 sm:w-40">
                      <input type="hidden" name="id" value={booking.id} />
                      <select
                        name="status"
                        defaultValue={booking.status}
                        className="rounded-xl border border-[#dbe6f1] bg-white px-3 py-2 font-body text-sm text-[#0b4a7a] outline-none"
                      >
                        {bookingStatuses.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="submit"
                        variant="outline"
                        size="sm"
                        className="border-[#0b4a7a] text-[#0b4a7a] hover:bg-[#0b4a7a] hover:text-white"
                      >
                        Save
                      </Button>
                    </form>
                  </div>
                </article>
              );
            })}

            {bookings.length === 0 && (
              <p className="rounded-2xl border border-[#dbe6f1] p-5 font-body text-sm text-[#7b8da3]">
                No bookings yet.
              </p>
            )}
          </div>
          </section>
        </aside>
      </div>
    </>
  );
}
