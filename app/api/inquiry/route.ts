import { NextResponse } from "next/server";

import { createAdminClient, hasAdminSupabaseEnv } from "@/lib/supabase/admin";

type InquiryPayload = {
  businessType?: string;
  goal?: string;
  name?: string;
  business?: string;
  handle?: string;
  email?: string;
  phone?: string;
  message?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let data: InquiryPayload;

  try {
    data = (await request.json()) as InquiryPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const name = data.name?.trim();
  const email = data.email?.trim();

  if (!name || !email) {
    return NextResponse.json(
      { ok: false, error: "Name and email are required." },
      { status: 400 },
    );
  }

  const fields: Array<[string, string | undefined]> = [
    ["Business type", data.businessType],
    ["Primary goal", data.goal],
    ["Name", name],
    ["Business", data.business],
    ["Handle / website", data.handle],
    ["Email", email],
    ["Phone", data.phone],
    ["Message", data.message],
  ];

  const summary = fields
    .filter(([, value]) => value && value.trim().length > 0)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  // Always log server-side so the inquiry is never lost, even before email is wired.
  console.log(`[AMM] New inquiry\n${summary}`);

  if (hasAdminSupabaseEnv()) {
    const supabase = createAdminClient();
    const { error } = await supabase.from("inquiries").insert({
      business_type: data.businessType?.trim() || null,
      goal: data.goal?.trim() || null,
      name,
      business: data.business?.trim() || null,
      handle: data.handle?.trim() || null,
      email,
      phone: data.phone?.trim() || null,
      message: data.message?.trim() || null,
      source: "get-started",
      raw_payload: JSON.parse(JSON.stringify(data)),
    });

    if (error) {
      console.error("[AMM] Supabase inquiry insert failed:", error);

      return NextResponse.json(
        { ok: false, error: "Could not save inquiry." },
        { status: 500 },
      );
    }
  } else {
    console.warn("[AMM] Supabase admin env missing; inquiry was only logged.");
  }

  // Pluggable notification: fires only when email delivery is configured.
  // Flag these as deploy tokens: RESEND_API_KEY, AUSTIN_NOTIFY_EMAIL, INQUIRY_FROM_EMAIL.
  const apiKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.AUSTIN_NOTIFY_EMAIL;
  const notifyFrom = process.env.INQUIRY_FROM_EMAIL;

  if (apiKey && notifyTo && notifyFrom) {
    const html = `<h2>New inquiry — ${escapeHtml(name)}</h2><pre style="font:14px/1.6 ui-sans-serif,system-ui">${escapeHtml(
      summary,
    )}</pre>`;

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: notifyFrom,
          to: notifyTo,
          reply_to: email,
          subject: `New inquiry — ${name}`,
          html,
        }),
      });

      if (!res.ok) {
        console.error("[AMM] Notification failed:", await res.text());
      }
    } catch (error) {
      console.error("[AMM] Notification error:", error);
    }
  }

  return NextResponse.json({ ok: true });
}
