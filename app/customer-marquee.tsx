import Image from "next/image";

import { cn } from "@/lib/utils";

type Customer = {
  name: string;
  logo?: string;
  logoClass?: string;
};

export const customers: Customer[] = [
  {
    name: "Kooks Headers",
    logo: "/customer-logos/kooks-headers.png",
    logoClass: "h-9 w-9",
  },
  { name: "Hubbard Clothing Co" },
  {
    name: "Wood Motor Co",
    logo: "/customer-logos/wood-motor-co.png",
    logoClass: "h-8 w-auto max-w-[6.75rem]",
  },
  { name: "Landers Toyota NWA" },
  {
    name: "McLarty Daniel Toyota",
    logo: "/customer-logos/mclarty-daniel-toyota.png",
    logoClass: "h-12 w-12",
  },
  {
    name: "Honey Brake",
    logo: "/customer-logos/honey-brake.png",
    logoClass: "size-7 max-w-7",
  },
  {
    name: "TMPL",
    logo: "/customer-logos/tmpl.png",
    logoClass: "h-9 w-9",
  },
  {
    name: "Palm Beach Sports Clubs",
    logo: "/customer-logos/palm-beach-sports-clubs.png",
    logoClass: "h-9 w-auto max-w-[4.5rem]",
  },
  {
    name: "Boss Hawg Offroad",
    logo: "/customer-logos/boss-hawg-offroad.png",
    logoClass: "h-9 w-auto max-w-[8rem]",
  },
  {
    name: "SEC",
    logo: "/customer-logos/sec.png",
    logoClass: "h-9 w-9",
  },
  {
    name: "Carlisle Watch Co",
    logo: "/customer-logos/carlisle-watch-co.png",
    logoClass: "h-9 w-auto max-w-[3.75rem]",
  },
  {
    name: "NASCAR",
    logo: "/customer-logos/nascar.png",
    logoClass: "h-9 w-9",
  },
  {
    name: "Lindsey Management",
    logo: "/customer-logos/lindsey-management.png",
    logoClass: "h-9 w-auto max-w-[9rem]",
  },
  {
    name: "Treasure Island Outfitters",
    logo: "/customer-logos/treasure-island-outfitters.png",
    logoClass: "h-9 w-9",
  },
];

const logoClassName =
  "object-contain object-left opacity-45 grayscale contrast-125 transition-opacity duration-300 group-hover:opacity-70";

export function CustomerMarquee() {
  return (
    <section
      aria-label="Trusted operators"
      className="relative z-10 pb-8 pt-2 lg:pb-10 lg:pt-2"
    >
      <p className="mx-auto mb-6 max-w-[28ch] px-5 text-center font-body text-xl font-medium leading-tight tracking-[-0.04em] text-creme/70 sm:max-w-none sm:text-2xl lg:mb-7 lg:text-3xl">
        Trusted by{" "}
        <span className="font-bold text-creme">industry leaders</span> across
        the country
      </p>
      <div className="edge-fade overflow-hidden">
        <div className="marquee flex items-center gap-20 pr-20">
          {[...customers, ...customers].map((customer, index) => (
            <span
              key={`${customer.name}-${index}`}
              className="group flex shrink-0 items-center gap-3 whitespace-nowrap"
            >
              {customer.logo && (
                <Image
                  src={customer.logo}
                  alt=""
                  aria-hidden
                  width={120}
                  height={36}
                  className={cn(
                    logoClassName,
                    customer.logoClass ?? "h-9 w-auto max-w-[7rem]",
                  )}
                />
              )}
              <span className="font-body text-lg font-semibold tracking-tight text-creme/35 transition-colors duration-300 group-hover:text-creme/70">
                {customer.name}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
