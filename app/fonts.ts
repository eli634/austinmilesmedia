import { Fragment_Mono, Inter_Tight } from "next/font/google";

export const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-goliath-sans",
  display: "swap",
});

export const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-goliath-mono",
  display: "swap",
});
