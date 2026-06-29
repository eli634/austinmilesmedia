"use client";

import Link from "next/link";
import { useMemo, useState, useTransition, type DragEvent } from "react";

import type { Database, DealStatus } from "@/lib/supabase/types";

import { updateDealStatus } from "../actions";
import { dealStatuses } from "../constants";

type Contact = Database["public"]["Tables"]["contacts"]["Row"];
type Deal = Database["public"]["Tables"]["deals"]["Row"];

const statusMeta: Record<
  DealStatus,
  { icon: string; label: string; accent: string }
> = {
  new_inquiry: {
    icon: "◎",
    label: "Interested",
    accent: "text-[#0b4a7a]",
  },
  contacted: {
    icon: "↗",
    label: "Proposal Sent",
    accent: "text-[#0b4a7a]",
  },
  call_booked: {
    icon: "◈",
    label: "Negotiation",
    accent: "text-[#0b4a7a]",
  },
  proposal_sent: {
    icon: "▭",
    label: "Pending Collection",
    accent: "text-[#0b4a7a]",
  },
  won: {
    icon: "♕",
    label: "Deal Won",
    accent: "text-[#0b4a7a]",
  },
  lost: {
    icon: "⊗",
    label: "Deal Lost",
    accent: "text-[#52677f]",
  },
};

function formatMoney(value: number | null) {
  if (!value) {
    return "No value";
  }

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function KanbanBoard({
  deals,
  contacts,
}: {
  deals: Deal[];
  contacts: Contact[];
}) {
  const [items, setItems] = useState(deals);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overStatus, setOverStatus] = useState<DealStatus | null>(null);
  const [, startTransition] = useTransition();

  const contactsById = useMemo(
    () => new Map(contacts.map((contact) => [contact.id, contact])),
    [contacts],
  );

  const dealsByStatus = useMemo(() => {
    const map = new Map<DealStatus, Deal[]>();
    for (const status of dealStatuses) {
      map.set(status.value, []);
    }
    for (const deal of items) {
      map.get(deal.status)?.push(deal);
    }
    return map;
  }, [items]);

  function onDragStart(event: DragEvent<HTMLElement>, dealId: string) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", dealId);
    setDraggingId(dealId);
  }

  function onDragOver(event: DragEvent<HTMLElement>, status: DealStatus) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setOverStatus(status);
  }

  function onDrop(event: DragEvent<HTMLElement>, status: DealStatus) {
    event.preventDefault();
    const dealId = event.dataTransfer.getData("text/plain");
    setDraggingId(null);
    setOverStatus(null);

    if (!dealId) {
      return;
    }

    setItems((current) =>
      current.map((deal) =>
        deal.id === dealId ? { ...deal, status, updated_at: new Date().toISOString() } : deal,
      ),
    );

    const formData = new FormData();
    formData.set("id", dealId);
    formData.set("status", status);
    startTransition(() => {
      void updateDealStatus(formData);
    });
  }

  return (
    <div className="overflow-x-auto pb-3">
      <div className="grid min-w-[1180px] grid-cols-6 gap-3">
        {dealStatuses.map((status) => {
          const stageDeals = dealsByStatus.get(status.value) ?? [];
          const stageValue = stageDeals.reduce(
            (sum, deal) => sum + (deal.value ?? 0),
            0,
          );
          const isOver = overStatus === status.value;

          return (
            <section
              key={status.value}
              onDragOver={(event) => onDragOver(event, status.value)}
              onDragLeave={() => setOverStatus(null)}
              onDrop={(event) => onDrop(event, status.value)}
              className={`flex min-h-[34rem] flex-col rounded-2xl border p-3 shadow-sm transition-colors ${
                isOver
                  ? "border-[#0b4a7a] bg-[#eef5ff]"
                  : "border-[#dbe6f1] bg-[#fbfdff]"
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={`font-body text-xs font-black ${statusMeta[status.value].accent}`}
                  >
                    {statusMeta[status.value].icon}
                  </span>
                  <h2 className="truncate font-body text-xs font-black text-[#0b4a7a]">
                    {statusMeta[status.value].label}
                  </h2>
                  <span className="rounded-full bg-[#eef5ff] px-1.5 py-0.5 font-body text-[0.62rem] font-bold text-[#7b8da3]">
                    {stageDeals.length}
                  </span>
                </div>
                <span className="font-body text-[0.65rem] font-bold text-[#0b4a7a]">
                  {formatMoney(stageValue)}
                </span>
              </div>

              <div className="grid gap-3">
                {stageDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    contact={
                      deal.contact_id ? contactsById.get(deal.contact_id) ?? null : null
                    }
                    isDragging={draggingId === deal.id}
                    onDragStart={onDragStart}
                  />
                ))}

                <Link
                  href={`/admin/pipeline/new?status=${status.value}`}
                  className="rounded-xl border border-dashed border-[#dbe6f1] px-3 py-3 text-center font-body text-sm font-semibold text-[#7b8da3] transition-colors hover:border-[#0b4a7a]/40 hover:text-[#0b4a7a]"
                >
                  + Add
                </Link>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function DealCard({
  deal,
  contact,
  isDragging,
  onDragStart,
}: {
  deal: Deal;
  contact: Contact | null;
  isDragging: boolean;
  onDragStart: (event: DragEvent<HTMLElement>, dealId: string) => void;
}) {
  return (
    <article
      draggable
      role="link"
      tabIndex={0}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("a")) {
          return;
        }

        window.location.href = `/admin/pipeline?deal=${deal.id}`;
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          window.location.href = `/admin/pipeline?deal=${deal.id}`;
        }
      }}
      onDragStart={(event) => onDragStart(event, deal.id)}
      onDragEnd={() => {
        document.body.style.cursor = "";
      }}
      className={`group/card cursor-grab rounded-xl border border-[#dbe6f1] bg-white p-3 shadow-[0_8px_20px_rgba(16,24,40,0.04)] transition active:cursor-grabbing ${
        isDragging ? "scale-[0.98] opacity-45" : "hover:-translate-y-0.5"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/admin/pipeline?deal=${deal.id}`}
          className="line-clamp-1 font-body text-xs font-black text-[#0b4a7a] hover:underline"
        >
          {deal.title}
        </Link>
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="grid grid-cols-2 gap-0.5 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100"
          >
            {[0, 1, 2, 3, 4, 5].map((dot) => (
              <span key={dot} className="size-1 rounded-full bg-[#9aabc0]" />
            ))}
          </span>
          <span className="rounded-full bg-[#eaf3ff] px-2 py-0.5 font-body text-[0.52rem] font-black uppercase text-[#0b4a7a]">
            {(deal.value ?? 0) >= 7000 ? "High" : "Medium"}
          </span>
        </div>
      </div>
      <p className="mt-2 line-clamp-1 font-body text-xs text-[#7b8da3]">
        {contact?.business ?? contact?.name ?? "No contact"}
      </p>
      <div className="mt-3 grid gap-1 font-body text-xs text-[#52677f]">
        <span className="font-bold text-[#0b4a7a]">{formatMoney(deal.value)}</span>
        <span>
          Next follow-up:{" "}
          {deal.next_follow_up
            ? new Intl.DateTimeFormat("en", {
                month: "short",
                day: "numeric",
              }).format(new Date(deal.next_follow_up))
            : "Not set"}
        </span>
      </div>

      {deal.notes && (
        <p className="mt-2 line-clamp-2 font-body text-[0.68rem] leading-relaxed text-[#52677f]">
          {deal.notes}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span className="rounded-full bg-[#f6f9fc] px-2 py-1 font-body text-[0.62rem] font-bold text-[#7b8da3]">
          Austin
        </span>
        <Link
          href={`/admin/pipeline?deal=${deal.id}`}
          className="font-body text-lg leading-none text-[#9aabc0] transition-colors hover:text-[#0b4a7a]"
          aria-label={`Open ${deal.title}`}
        >
          ...
        </Link>
      </div>
    </article>
  );
}
