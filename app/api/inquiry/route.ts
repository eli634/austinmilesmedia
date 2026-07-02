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

const MAX_BODY_BYTES = 32_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const inquiryAttempts = new Map<string, number[]>();

const fieldLimits: Record<keyof InquiryPayload, number> = {
  businessType: 120,
  goal: 120,
  name: 120,
  business: 160,
  handle: 180,
  email: 180,
  phone: 60,
  message: 2_000,
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sanitizeHeader(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function normalizePayload(data: InquiryPayload) {
  return Object.fromEntries(
    (Object.keys(fieldLimits) as Array<keyof InquiryPayload>).map((key) => [
      key,
      typeof data[key] === "string"
        ? data[key].trim().slice(0, fieldLimits[key])
        : undefined,
    ]),
  ) as InquiryPayload;
}

function getClientKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(request: Request) {
  const key = getClientKey(request);
  const now = Date.now();
  const recent = (inquiryAttempts.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    inquiryAttempts.set(key, recent);
    return true;
  }

  inquiryAttempts.set(key, [...recent, now]);
  return false;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (
    (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) ||
    isRateLimited(request)
  ) {
    return NextResponse.json(
      { ok: false, error: "Request could not be processed." },
      {
        status:
          Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES
            ? 413
            : 429,
      },
    );
  }

  const body = await request.text();

  if (new TextEncoder().encode(body).length > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Request is too large." },
      { status: 413 },
    );
  }

  let data: InquiryPayload;

  try {
    data = JSON.parse(body) as InquiryPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  data = normalizePayload(data);

  if (new TextEncoder().encode(JSON.stringify(data)).length > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Request is too large." },
      { status: 413 },
    );
  }

  const name = data.name?.trim();
  const email = data.email?.trim();
  const emailLooksValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !emailLooksValid) {
    return NextResponse.json(
      { ok: false, error: "A valid name and email are required." },
      { status: 400 },
    );
  }

  const fields: Array<[string, string | undefined]> = [
    ["Business type", data.businessType],
    ["Primary goal", data.goal],
    ["Name", name],
    ["Business", data.business],
    ["Website", data.handle],
    ["Email", email],
    ["Phone", data.phone],
    ["Message", data.message],
  ];

  const summary = fields
    .filter(([, value]) => value && value.trim().length > 0)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  console.log("[AMM] New inquiry received", {
    businessType: data.businessType?.trim() || null,
    goal: data.goal?.trim() || null,
    hasBusiness: Boolean(data.business?.trim()),
    hasPhone: Boolean(data.phone?.trim()),
    hasMessage: Boolean(data.message?.trim()),
  });

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
          subject: `New inquiry — ${sanitizeHeader(name)}`,
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
