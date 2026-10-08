"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAdminDemoMode } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { BookingStatus, DealStatus, InquiryStatus } from "@/lib/supabase/types";

import { inquiryStatuses } from "./constants";

async function requireAdminClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile, error } = await supabase
    .from("admin_profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile) {
    redirect("/admin/login");
  }

  return supabase;
}

function isInquiryStatus(value: string): value is InquiryStatus {
  return inquiryStatuses.some((status) => status.value === value);
}

function deletionConfirmed(formData: FormData) {
  return String(formData.get("confirm") ?? "") === "delete";
}

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
  const status = String(formData.get("status") ?? "");

  if (!id || !isInquiryStatus(status)) {
    return;
  }

  if (isAdminDemoMode()) {
    revalidatePath("/admin/inquiries");
    revalidatePath("/admin");
    redirect(`/admin/inquiries?inquiry=${id}`);
  }

  const supabase = await requireAdminClient();
  await supabase.from("inquiries").update({ status }).eq("id", id);
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
  redirect(`/admin/inquiries?inquiry=${id}`);
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
    redirect("/admin/pipeline");
  }

  const supabase = await requireAdminClient();
  const { data: inquiry } = await supabase
    .from("inquiries")
    .select("*")
    .eq("id", inquiryId)
    .single();

  if (!inquiry) {
    return;
  }

  const { data: existingDeal } = await supabase
    .from("deals")
    .select("id")
    .eq("inquiry_id", inquiry.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingDeal) {
    await supabase
      .from("inquiries")
      .update({ status: "promoted" })
      .eq("id", inquiry.id);
    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");
    revalidatePath("/admin/contacts");
    revalidatePath("/admin/pipeline");
    redirect(`/admin/pipeline/${existingDeal.id}`);
  }

  const { data: existingContact } = await supabase
    .from("contacts")
    .select("id")
    .eq("inquiry_id", inquiry.id)
    .limit(1)
    .maybeSingle();

  let contactId = existingContact?.id ?? null;

  if (!contactId) {
    const { data: contact, error } = await supabase
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

    if (error || !contact) {
      redirect(
        `/admin/inquiries?inquiry=${inquiry.id}&error=${encodeURIComponent("Could not save this lead.")}`,
      );
    }

    contactId = contact.id;
  }

  const title = inquiry.business || inquiry.name;
  const { data: deal, error: dealError } = await supabase
    .from("deals")
    .insert({
      contact_id: contactId,
      inquiry_id: inquiry.id,
      title,
      status: "new_inquiry",
      notes: inquiry.goal,
    })
    .select("id")
    .single();

  if (dealError || !deal) {
    redirect(
      `/admin/inquiries?inquiry=${inquiry.id}&error=${encodeURIComponent("Could not save this lead.")}`,
    );
  }

  await supabase
    .from("inquiries")
    .update({ status: "promoted" })
    .eq("id", inquiry.id);

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/contacts");
  revalidatePath("/admin/pipeline");
  redirect(`/admin/pipeline/${deal.id}`);
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

  const supabase = await requireAdminClient();
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

  const supabase = await requireAdminClient();
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

export async function createContact(formData: FormData) {
  const name = String(formData.get("contactName") ?? "").trim();
  const business = String(formData.get("business") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const handle = String(formData.get("handle") ?? "").trim() || null;
  const businessType = String(formData.get("businessType") ?? "").trim() || null;
  const notes = String(formData.get("contactNotes") ?? "").trim() || null;

  if (!name || !email) {
    return;
  }

  if (isAdminDemoMode()) {
    revalidatePath("/admin/contacts");
    return;
  }

  const supabase = await requireAdminClient();
  await supabase.from("contacts").insert({
    name,
    business,
    email,
    phone,
    handle,
    business_type: businessType,
    notes,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/contacts");
  revalidatePath("/admin/pipeline");
}

export async function updateContactDetails(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("contactName") ?? "").trim();
  const business = String(formData.get("business") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const handle = String(formData.get("handle") ?? "").trim() || null;
  const businessType = String(formData.get("businessType") ?? "").trim() || null;
  const notes = String(formData.get("contactNotes") ?? "").trim() || null;

  if (!id || !name || !email) {
    return;
  }

  if (isAdminDemoMode()) {
    revalidatePath("/admin/contacts");
    return;
  }

  const supabase = await requireAdminClient();
  await supabase
    .from("contacts")
    .update({
      name,
      business,
      email,
      phone,
      handle,
      business_type: businessType,
      notes,
    })
    .eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/admin/contacts");
  revalidatePath("/admin/pipeline");
}

export async function deleteContact(formData: FormData) {
  const id = String(formData.get("id") ?? "");

  if (!id || !deletionConfirmed(formData)) {
    return;
  }

  if (isAdminDemoMode()) {
    revalidatePath("/admin/inquiries");
    revalidatePath("/admin/contacts");
    redirect("/admin/contacts");
  }

  const supabase = await requireAdminClient();
  await supabase.from("contacts").delete().eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/contacts");
  revalidatePath("/admin/pipeline");
  revalidatePath("/admin/calendar");
  redirect("/admin/contacts");
}

export async function deleteDeal(formData: FormData) {
  const id = String(formData.get("id") ?? "");

  if (!id || !deletionConfirmed(formData)) {
    return;
  }

  if (isAdminDemoMode()) {
    revalidatePath("/admin");
    revalidatePath("/admin/pipeline");
    redirect("/admin/pipeline");
  }

  const supabase = await requireAdminClient();
  await supabase.from("deals").delete().eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/pipeline");
  revalidatePath("/admin/calendar");
  redirect("/admin/pipeline");
}

export async function createDealWithContact(formData: FormData) {
  const existingContactId = String(formData.get("contactId") ?? "") || null;
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

  const supabase = await requireAdminClient();
  const value = valueRaw ? Number(valueRaw) : null;
  let contactId = existingContactId;

  if (!contactId) {
    const { data: existingContact } = await supabase
      .from("contacts")
      .select("id")
      .eq("email", email)
      .limit(1)
      .maybeSingle();

    contactId = existingContact?.id ?? null;
  }

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

  const supabase = await requireAdminClient();
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

  const supabase = await requireAdminClient();
  await supabase.from("bookings").update({ status }).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/admin/calendar");
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password !== confirm) {
    redirect("/admin/account?error=Passwords%20do%20not%20match.");
  }

  if (password.length < 8) {
    redirect("/admin/account?error=Use%20at%20least%208%20characters.");
  }

  if (isAdminDemoMode()) {
    redirect("/admin/account?updated=1");
  }

  const supabase = await requireAdminClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect("/admin/account?error=Could%20not%20update%20password.");
  }

  redirect("/admin/account?updated=1");
}
