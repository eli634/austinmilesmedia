import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CustomerMarquee } from "./customer-marquee";
import { Hero } from "./hero";
import { HowItWorks } from "./how-it-works";
import { Nav } from "./nav";

const leadBenefitBody =
  "No brief to write, no camera to hold, no editor to learn, no freelancer to babysit. The crew shows up, films on site, and cuts everything in-house. It ships looking like Austin shot it, or it doesn\u2019t ship. Hundreds of pieces a month, none of it on your desk.";

const services = [
  {
    index: "01",
    title: "Content only",
    body: "We come to you, shoot on site, and hand off finished, ready-to-post video. You run distribution. Same crew every time, and you stay in control.",
  },
  {
    index: "02",
    title: "Managed",
    body: "We film, we edit, and we run the calendar: posting, formats, cadence, all handled. You approve, we ship. The volume runs without you touching it.",
  },
  {
    index: "03",
    title: "Full white-glove",
    body: "The whole operation, off your plate. Strategy, filming, editing, posting, and reporting, run by the crew and signed off by Austin before anything goes live. You get the booked jobs and a portal that shows exactly what\u2019s working.",
    flagship: true,
  },
];

const reels = ["Roofing", "HVAC", "Custom builders", "Sports"];

const founderQuote =
  "\u201CNothing ships that I wouldn\u2019t put my own name on. And there\u2019s no one between you and the people making it.\u201D";

const founderBody = [
  "Austin Miles started shooting at 15. While everyone else was hunting a first job, he was filming six car dealerships and shooting sports on the weekends. That\u2019s nine years behind a camera before most people own one.",
  "Today he runs a tight crew, small on purpose. Not juniors learning on your account, not an offshore edit farm, not whoever\u2019s cheapest this quarter. The same hands on every shoot, people he\u2019s worked with for years, all cut to one rule: it ships looking like he shot it himself, or it doesn\u2019t ship.",
  "That\u2019s the trade. You\u2019re not paying for a freelancer\u2019s calendar or an agency\u2019s overhead. You\u2019re paying for a crew that\u2019s already good and a bar that doesn\u2019t move, with no account-manager wall between you and the work.",
];

const objections = [
  {
    q: "Is this worth what it costs?",
    a: "Compare it to the real alternative: a videographer day rate, plus an editor, plus your time managing both, for a fraction of the output. One job booked off one video usually covers the month. You\u2019re not buying content. You\u2019re buying the jobs it brings in.",
  },
  {
    q: "I don\u2019t want to be locked into a retainer.",
    a: "The retainer buys you volume and a standing crew, not a cage. We run 3, 6, and 12-month terms, and you watch the work stack up in your portal the whole way. If it isn\u2019t booking jobs, you\u2019ll see it there before you feel it.",
  },
  {
    q: "I hate being on camera.",
    a: "Most of what we shoot has you on camera for none of it: job sites, crews, before-and-afters, the work itself. Want to be on screen? We make it quick and painless. Never want to? The content still books jobs. Your call.",
  },
  {
    q: "Will this actually book jobs, or just get likes?",
    a: "Likes don\u2019t fill your schedule. We shoot for the homeowner who\u2019s about to call someone. Proof, process, finished jobs, not a viral moment. Every piece is built to move someone from scrolling to scheduling, and the portal shows you what\u2019s converting.",
  },
  {
    q: "My last agency took my money and disappeared.",
    a: "Fair. That\u2019s the whole reason we\u2019re built the way we are. No offshore handoff, no account-manager wall, no rotating cast. You deal with the crew making your content and with Austin, who sets the bar they cut to. Everything you pay for shows up in one portal: what we shot, what shipped, what it\u2019s doing. No black box, no ghosting, no \u201Cwe\u2019ll circle back.\u201D",
  },
];

const ctaOffer =
  "Point us at your socials and your service area. We\u2019ll come back with the actual content we\u2019d post for you, built around the jobs you want to book more of. No cost, no pitch deck. Like what you see, we scale it.";

export default function Home() {
  return (
    <main className="relative">
      <Nav />
      <Hero />

      <CustomerMarquee />

      {/* LEAD BENEFIT */}
      <section className="relative z-10 mx-auto grid w-full max-w-[1320px] gap-10 px-5 py-28 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:px-10 lg:py-36">
          <div>
            <p className="eyebrow mb-6">
              The operation
            </p>
            <h2 className="h2 max-w-[18ch]">
              We run your content engine.
            </h2>
          </div>
          <p className="body text-lg lg:pb-2">
            {leadBenefitBody}
          </p>
      </section>

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* SERVICES */}
      <section
        id="services"
        className="relative z-10 scroll-mt-24 bg-creme text-[#08294a]"
      >
        <div className="mx-auto w-full max-w-[1320px] px-5 py-28 sm:px-8 lg:px-10 lg:py-36">
          <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-6 font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[#607086]">
                How we work together
              </p>
              <h2 className="h2 max-w-[16ch] text-[#08294a]">
                Three ways to run your content.
              </h2>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="hover-glow group overflow-hidden rounded-3xl border border-[#d8e3ef] bg-white p-7 shadow-[0_18px_55px_rgba(3,16,36,0.07)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-bold text-[#0f5d73]">
                      {service.index}
                    </span>
                    {service.flagship && (
                      <span className="font-mono text-[0.64rem] uppercase tracking-[0.22em] text-[#607086]">
                        Flagship
                      </span>
                    )}
                  </div>

                  <h3 className="mt-7 font-display text-3xl font-extrabold leading-none tracking-[-0.05em] text-[#08294a]">
                    {service.title}
                  </h3>
                  <p className="mt-4 font-body text-[0.95rem] font-medium leading-relaxed text-[#52677f]">
                    {service.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-[#08294a]/20 text-[#08294a] hover:bg-[#08294a] hover:text-creme"
            >
              <Link href="/get-started">Get started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* WORK / REELS */}
      <section
        id="work"
        className="relative z-10 scroll-mt-24 bg-creme text-[#08294a]"
      >
        <div className="mx-auto w-full max-w-[1320px] px-5 pb-28 sm:px-8 lg:px-10 lg:pb-36">
          <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-6 font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[#607086]">
                Work by industry
              </p>
              <h2 className="h2 max-w-[14ch] text-[#08294a]">
                See work from your industry.
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {reels.map((label) => (
              <div
                key={label}
                className="group overflow-hidden rounded-3xl border border-[#d8e3ef] bg-white p-3 shadow-[0_18px_55px_rgba(3,16,36,0.07)] transition-transform duration-300 ease-expo hover:-translate-y-1"
              >
                <div className="relative aspect-[9/16] overflow-hidden rounded-[1.25rem] border border-white/10 bg-gradient-to-b from-[#06111f] via-[#0a2842] to-[#0f5d73]">
                  <Image
                    src="/amm-signature-white-transparent.png"
                    alt=""
                    aria-hidden
                    width={400}
                    height={200}
                    className="pointer-events-none absolute left-1/2 top-1/2 w-3/4 -translate-x-1/2 -translate-y-1/2 opacity-[0.08] transition-opacity duration-300 group-hover:opacity-[0.13]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex size-12 items-center justify-center rounded-full border border-white/30 bg-ink/40 text-white backdrop-blur-sm transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-ink">
                      ▶
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-1 pt-4">
                  <span className="font-body text-sm font-semibold text-[#08294a]">
                    {label}
                  </span>
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[#607086]">
                    Reel
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section
        id="founder"
        className="relative z-10 mx-auto grid w-full max-w-[1320px] scroll-mt-24 gap-12 px-5 py-28 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-10 lg:py-36"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-creme/10 bg-surface">
          <Image
            src="/austin-founder.png"
            alt="Austin Miles in the field with a cinema camera rig."
            fill
            sizes="(min-width: 1024px) 420px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
          <span className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-ink/35 px-3 py-1 font-body text-xs font-semibold text-white/80 backdrop-blur-md">
            Austin on shoot
          </span>
        </div>

        <div>
          <p className="eyebrow mb-6">The founder</p>
          <h2 className="max-w-[34ch] font-display text-[clamp(1.6rem,3vw,3rem)] font-extrabold leading-[1.02] tracking-[-0.045em] text-creme">
            {founderQuote}
          </h2>
          <p className="mt-5 font-body text-sm uppercase tracking-[0.2em] text-creme/50">
            — Austin Miles
          </p>
          {founderBody.map((paragraph, index) => (
            <p key={index} className={`body ${index === 0 ? "mt-8" : "mt-4"}`}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10">
        <div className="divider" />
      </div>

      {/* OBJECTIONS */}
      <section
        aria-label="Straight answers"
        className="relative z-10 mx-auto w-full max-w-[1320px] px-5 py-28 sm:px-8 lg:px-10 lg:py-36"
      >
        <div className="mb-14">
          <p className="eyebrow mb-6">Straight answers</p>
          <h2 className="h2 max-w-[18ch]">
            The questions you&apos;re actually asking.
          </h2>
        </div>

        <div className="mx-auto max-w-[860px] border-t border-creme/10">
          {objections.map((item) => (
            <details
              key={item.q}
              className="group border-b border-creme/10 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-7">
                <span className="font-body text-lg font-medium tracking-[-0.02em] text-creme/85 sm:text-xl">
                  {item.q}
                </span>
                <span className="shrink-0 text-2xl font-light leading-none text-creme/50 transition-transform duration-300 ease-expo group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="body max-w-[72ch] pb-7">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA BAND */}
      <section className="relative z-10 overflow-hidden border-t border-creme/10">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[40rem] w-[60rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(closest-side,rgba(248,251,255,0.06),transparent)]"
        />
        <div className="relative mx-auto w-full max-w-[1320px] px-5 py-28 text-center sm:px-8 lg:px-10 lg:py-40">
          <p className="eyebrow mb-8">See it before you pay</p>
          <h2 className="display mx-auto max-w-[16ch]">
            See if this works, on us.
          </h2>
          <p className="body mx-auto mt-8 text-lg">{ctaOffer}</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg">
              <Link href="/get-started">Get started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#missing-booking-link">Book a call</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-creme/10">
        <div className="mx-auto w-full max-w-[1320px] px-5 pb-12 pt-20 sm:px-8 lg:px-10">
          <div className="relative h-20 w-64 sm:h-24 sm:w-80">
            <Image
              src="/amm-signature-white-transparent.png"
              alt="Austin Miles Media"
              fill
              sizes="(min-width: 640px) 320px, 256px"
              className="object-contain object-left"
            />
          </div>

          <div className="mt-16 flex flex-col gap-6 border-t border-creme/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              <Link
                href="#missing-contact-email"
                className="font-body text-sm text-creme/60 transition-colors hover:text-creme"
              >
                hello@austinmilesmedia.com
              </Link>
              <Link
                href="#missing-ig-url"
                className="font-body text-sm text-creme/60 transition-colors hover:text-creme"
              >
                Instagram
              </Link>
              <Link
                href="#missing-yt-url"
                className="font-body text-sm text-creme/60 transition-colors hover:text-creme"
              >
                YouTube
              </Link>
            </div>
            <p className="font-body text-sm text-creme/40">
              © {new Date().getFullYear()} Austin Miles Media
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

