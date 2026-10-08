import type { Metadata, Viewport } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import { fragmentMono, interTight } from "./fonts";
import { Grain } from "./grain";
import { PrivacyNotice } from "./privacy-notice";
import { getSiteUrl } from "@/lib/site-url";
import { SmoothScroll } from "./smooth-scroll";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AMM | Attention Means Money",
    template: "%s | AMM",
  },
  description:
    "In-house video for roofing, HVAC, and custom builders who want more booked jobs from content they never have to film.",
  openGraph: {
    title: "AMM | Attention Means Money",
    description:
      "In-house video for roofing, HVAC, and custom builders who want more booked jobs from content they never have to film.",
    siteName: "AMM",
    type: "website",
    images: [
      {
        url: "/og-image-amm.png",
        width: 1200,
        height: 630,
        alt: "AMM, Attention Means Money, preview card.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AMM | Attention Means Money",
    description:
      "In-house video for roofing, HVAC, and custom builders who want more booked jobs from content they never have to film.",
    images: ["/og-image-amm.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${fragmentMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="spotlight" aria-hidden />
        <SmoothScroll>{children}</SmoothScroll>
        <PrivacyNotice />
        <Grain />
      </body>
    </html>
  );
}
