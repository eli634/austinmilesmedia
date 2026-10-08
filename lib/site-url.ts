const PRODUCTION_SITE_URL = "https://attentionmeansmoney.com";

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");

  if (configured) {
    return configured;
  }

  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_SITE_URL;
  }

  return "http://localhost:3000";
}
