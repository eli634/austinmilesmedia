"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAdminDemoMode } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { BookingStatus, DealStatus, InquiryStatus } from "@/lib/supabase/types";

export async function signOut() {
  if (isAdminDemoMode()) {
    redirect("/admin");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateInquiryStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as InquiryStatus;

  if (!id || !status) {
    return;
  }

  if (isAdminDemoMode()) {
    revalidatePath("/admin/inquiries");
    return;
  }

  const supabase = await createClient();
  await supabase.from("inquiries").update({ status }).eq("id", id);
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}

export async function promoteInquiry(formData: FormData) {
  const inquiryId = String(formData.get("inquiryId") ?? "");

  if (!inquiryId) {
    return;
  }

  if (isAdminDemoMode()) {
    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");
    revalidatePath("/admin/pipeline");
    return;
  }

  const supabase = await createClient();
  const { data: inquiry } = await supabase
    .from("inquiries")
    .select("*")
    .eq("id", inquiryId)
    .single();

  if (!inquiry) {
    return;
  }

  const { data: contact } = await supabase
    .from("contacts")
    .insert({
      inquiry_id: inquiry.id,
      name: inquiry.name,
      business: inquiry.business,
      email: inquiry.email,
      phone: inquiry.phone,
      handle: inquiry.handle,
      business_type: inquiry.business_type,
      notes: inquiry.message,
    })
    .select("id")
    .single();

  const title = inquiry.business || inquiry.name;

  await supabase.from("deals").insert({
    contact_id: contact?.id ?? null,
    inquiry_id: inquiry.id,
    title,
    status: "new_inquiry",
    notes: inquiry.goal,
  });

  await supabase
    .from("inquiries")
    .update({ status: "promoted" })
    .eq("id", inquiry.id);

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/pipeline");
}

export async function updateDealStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as DealStatus;

  if (!id || !status) {
    return;
  }

  if (isAdminDemoMode()) {
    revalidatePath("/admin");
    revalidatePath("/admin/pipeline");
    return;
  }

  const supabase = await createClient();
  await supabase.from("deals").update({ status }).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/admin/pipeline");
}

export async function updateDealDetails(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const contactId = String(formData.get("contactId") ?? "") || null;
  const title = String(formData.get("title") ?? "").trim();
  const status = String(formData.get("status") ?? "") as DealStatus;
  const valueRaw = String(formData.get("value") ?? "").trim();
  const nextFollowUp = String(formData.get("nextFollowUp") ?? "") || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const contactName = String(formData.get("contactName") ?? "").trim();
  const business = String(formData.get("business") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const handle = String(formData.get("handle") ?? "").trim() || null;
  const businessType = String(formData.get("businessType") ?? "").trim() || null;
  const contactNotes = String(formData.get("contactNotes") ?? "").trim() || null;

  if (!id || !title || !status) {
    return;
  }

  if (isAdminDemoMode()) {
    revalidatePath("/admin");
    revalidatePath("/admin/pipeline");
    revalidatePath(`/admin/pipeline/${id}`);
    return;
  }

  const supabase = await createClient();
  const value = valueRaw ? Number(valueRaw) : null;

  if (contactId && contactName && email) {
    await supabase
      .from("contacts")
      .update({
        name: contactName,
        business,
        email,
        phone,
        handle,
        business_type: businessType,
        notes: contactNotes,
      })
      .eq("id", contactId);
  }

  await supabase
    .from("deals")
    .update({
      title,
      status,
      value: Number.isFinite(value) ? value : null,
      next_follow_up: nextFollowUp,
      notes,
    })
    .eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/pipeline");
  revalidatePath(`/admin/pipeline/${id}`);
}

export async function createDealWithContact(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const status = (String(formData.get("status") ?? "") || "new_inquiry") as DealStatus;
  const valueRaw = String(formData.get("value") ?? "").trim();
  const nextFollowUp = String(formData.get("nextFollowUp") ?? "") || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const contactName = String(formData.get("contactName") ?? "").trim();
  const business = String(formData.get("business") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const handle = String(formData.get("handle") ?? "").trim() || null;
  const businessType = String(formData.get("businessType") ?? "").trim() || null;
  const contactNotes = String(formData.get("contactNotes") ?? "").trim() || null;

  if (!title || !contactName || !email) {
    return;
  }

  if (isAdminDemoMode()) {
    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");
    revalidatePath("/admin/pipeline");
    redirect("/admin/pipeline");
  }

  const supabase = await createClient();
  const value = valueRaw ? Number(valueRaw) : null;
  const { data: existingContact } = await supabase
    .from("contacts")
    .select("id")
    .eq("email", email)
    .limit(1)
    .maybeSingle();

  let contactId = existingContact?.id ?? null;

  if (contactId) {
    await supabase
      .from("contacts")
      .update({
        name: contactName,
        business,
        phone,
        handle,
        business_type: businessType,
        notes: contactNotes,
      })
      .eq("id", contactId);
  } else {
    const { data: createdContact } = await supabase
      .from("contacts")
      .insert({
        name: contactName,
        business,
        email,
        phone,
        handle,
        business_type: businessType,
        notes: contactNotes,
      })
      .select("id")
      .single();

    contactId = createdContact?.id ?? null;
  }

  const { data: deal } = await supabase
    .from("deals")
    .insert({
      contact_id: contactId,
      title,
      status,
      value: Number.isFinite(value) ? value : null,
      next_follow_up: nextFollowUp,
      notes,
    })
    .select("id")
    .single();

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/pipeline");
  redirect(deal?.id ? `/admin/pipeline/${deal.id}` : "/admin/pipeline");
}

export async function createBooking(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const startsAt = String(formData.get("startsAt") ?? "");
  const dealId = String(formData.get("dealId") ?? "") || null;
  const contactId = String(formData.get("contactId") ?? "") || null;
  const location = String(formData.get("location") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!title || !startsAt) {
    return;
  }

  if (isAdminDemoMode()) {
    revalidatePath("/admin");
    revalidatePath("/admin/calendar");
    return;
  }

  const supabase = await createClient();
  await supabase.from("bookings").insert({
    title,
    starts_at: new Date(startsAt).toISOString(),
    deal_id: dealId,
    contact_id: contactId,
    location,
    notes,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/calendar");
}

export async function updateBookingStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as BookingStatus;

  if (!id || !status) {
    return;
  }

  if (isAdminDemoMode()) {
    revalidatePath("/admin");
    revalidatePath("/admin/calendar");
    return;
  }

  const supabase = await createClient();
  await supabase.from("bookings").update({ status }).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/admin/calendar");
}
