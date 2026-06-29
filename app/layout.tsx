import type { Metadata, Viewport } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import { fragmentMono, interTight } from "./fonts";
import { Grain } from "./grain";
import { PrivacyNotice } from "./privacy-notice";
import { SmoothScroll } from "./smooth-scroll";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Austin Miles Media",
    template: "%s | Austin Miles Media",
  },
  description:
    "In-house video for roofing, HVAC, and custom builders who want more booked jobs from content they never have to film.",
  openGraph: {
    title: "Austin Miles Media",
    description:
      "In-house video for roofing, HVAC, and custom builders who want more booked jobs from content they never have to film.",
    siteName: "Austin Miles Media",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Austin Miles Media wordmark on ink.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Austin Miles Media",
    description:
      "In-house video for roofing, HVAC, and custom builders who want more booked jobs from content they never have to film.",
    images: ["/og-image.png"],
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
