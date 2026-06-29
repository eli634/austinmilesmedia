import type {
  BookingStatus,
  DealStatus,
  InquiryStatus,
} from "@/lib/supabase/types";

export const inquiryStatuses: Array<{ value: InquiryStatus; label: string }> = [
  { value: "new", label: "New" },
  { value: "reviewed", label: "Reviewed" },
  { value: "promoted", label: "Promoted" },
  { value: "archived", label: "Archived" },
];

export const dealStatuses: Array<{ value: DealStatus; label: string }> = [
  { value: "new_inquiry", label: "New inquiry" },
  { value: "contacted", label: "Contacted" },
  { value: "call_booked", label: "Call booked" },
  { value: "proposal_sent", label: "Proposal sent" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export const bookingStatuses: Array<{ value: BookingStatus; label: string }> = [
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];
