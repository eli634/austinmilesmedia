import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CustomerMarquee } from "./customer-marquee";
import { Hero } from "./hero";
import { HowItWorks } from "./how-it-works";
import { Nav } from "./nav";

const leadBenefitBody =
  "Full social media management from one lean, efficient team. We plan it, film it, edit it, and post it.";

const mission =
  "We create and run the content systems that keep brands visible, consistent, and growing\u2014so business owners can focus on what they do best.";

const vision =
  "To redefine what a content partner looks like by becoming the team brands trust to own their entire content operation, from strategy to execution.";

const servicesIntro =
  "Whether you need a reliable production team or want your entire content operation taken off your plate, choose the level of support that fits your business.";

const services = [
  {
    index: "01",
    title: "Starter",
    tagline: "Content production, handled.",
    audience:
      "For brands building a consistent presence while managing distribution internally.",
    body: [
      "We come to you, shoot on-site, edit everything, and deliver polished, ready-to-post content built around your brand.",
      "You stay in control of posting. We make sure you consistently have high-quality content ready to go.",
      "Because you work with the same team, we get to know your business, your voice, and how you show up best on camera.",
    ],
    includes: [
      "Custom monthly content calendar",
      "On-site photo + video production",
      "Professional editing",
      "Platform-ready content",
      "Monthly check-in meeting",
      "Organized content delivery",
    ],
    bestFor:
      "Brands that already have someone handling social media but need a dependable creative team producing consistent, professional content.",
  },
  {
    index: "02",
    title: "Growth",
    tagline: "Content creation + social media management.",
    audience:
      "For brands actively growing their audience and ready to take the day-to-day work off their plate.",
    body: [
      "Everything in Starter, plus we manage the distribution for you.",
      "We create the content, write the captions, format each piece for the right platform, schedule it, publish it, and manage your overall content calendar.",
      "Your role stays simple: you approve it, we run it.",
      "We also help keep your brand active beyond posting through community management, engagement, and audience replies.",
    ],
    includes: [
      "Everything in Starter",
      "Social media management",
      "Custom graphic content",
      "Captions + copywriting",
      "Multi-platform management",
      "Scheduling + publishing",
      "Community management + replies",
      "Content calendar management",
      "Ongoing content optimization",
    ],
    bestFor:
      "Brands that want a professional, consistent social presence without managing the process internally.",
  },
  {
    index: "03",
    title: "Pro",
    tagline: "Your full content and social operation.",
    audience:
      "For brands ready to scale organic content, paid media, and strategy under one team.",
    body: [
      "Everything in Growth, plus a higher level of strategy, creative oversight, and execution.",
      "We plan your content campaigns, create the content, manage your platforms, oversee distribution, support paid advertising, and use performance insights to guide what comes next.",
      "Rather than simply posting content, we help shape the strategy behind it\u2014what to create, where to distribute it, and what to double down on.",
      "You also receive priority turnaround and regular strategy sessions, giving you a clear view of what\u2019s being created, what\u2019s working, and where the brand should go next.",
    ],
    includes: [
      "Everything in Growth",
      "Full content strategy",
      "Campaign planning",
      "Paid ad management",
      "Expanded platform management",
      "Priority turnaround",
      "Monthly strategy session",
      "Ongoing strategic optimization",
    ],
    bestFor:
      "Brands that want one team responsible for the strategy, production, management, and growth of their entire social presence.",
  },
];

const servicesClose = "You run the business. We run the content.";

const founderQuote =
  "\u201CNothing ships that I wouldn\u2019t put my own name on.\u201D";

const founderBody = [
  "Austin has spent nine years behind a camera, across a wider range of industries than most agencies ever see: car dealerships, NASCAR drivers, professional businesses, real estate, and hunting lodges.",
  "The goal has never been to just hand you cool videos. It\u2019s to learn your business \u2014 how you get customers, what a good month looks like \u2014 and build content that actually feeds it.",
  "A lot of businesses hire a content guy to point and film. With us, you get a creative direction team that learns the business first and shoots second.",
];

const objections = [
  {
    q: "Is this worth what it costs?",
    a: "We run a lean, efficient team \u2014 no agency layers, no bloated production days, no overhead you\u2019re quietly paying for. You get the output of a full content and social media operation for a fraction of what staffing it yourself would cost, and every dollar goes to people actually doing the work.",
  },
  {
    q: "I don\u2019t want to be locked into a retainer.",
    a: "The retainer buys you volume and a standing crew, not a cage. We run 3, 6, and 12-month terms, and you watch the work stack up in your portal the whole way. If it isn\u2019t working, you\u2019ll see it there before you feel it.",
  },
  {
    q: "I hate being on camera.",
    a: "Most of what we shoot has you on camera for none of it: job sites, crews, before-and-afters, the work itself. Want to be on screen? We make it quick and painless. Never want to? The content still works. Your call.",
  },
  {
    q: "Will this actually bring in business, or just get likes?",
    a: "Likes aren\u2019t the goal. We build content for the people ready to buy: proof, process, finished work. That\u2019s what generates real attention and real inquiries. Closing them stays your side of the fence \u2014 our job is making sure your phone keeps ringing and your name keeps coming up.",
  },
  {
    q: "My last agency took my money and disappeared.",
    a: "Fair. That\u2019s why everything we do stays visible. You get a dedicated point of contact who actually answers, a direct line to the team making your content, and a portal that shows what we shot, what shipped, and what it\u2019s doing. No black box, no ghosting, no \u201Cwe\u2019ll circle back.\u201D",
  },
];

const ctaOffer =
  "Book a call and we\u2019ll walk you through exactly how we can help, what the process looks like, and what would make sense for your brand.";

export default function Home() {
  return (
    <main className="relative">
      <Nav />
      <Hero />

      <CustomerMarquee />

      {/* LEAD BENEFIT */}
      <section className="relative z-10 mx-auto w-full max-w-[1320px] px-5 py-28 sm:px-8 lg:px-10 lg:py-36">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="eyebrow mb-6">The operation</p>
            <h2 className="h2 max-w-[18ch]">We run your social media.</h2>
          </div>
          <p className="body text-lg lg:pb-2">{leadBenefitBody}</p>
        </div>

        <div className="mt-16 grid gap-10 border-t border-creme/10 pt-14 sm:grid-cols-2 sm:gap-12 lg:mt-20 lg:gap-16">
          <div>
            <p className="eyebrow mb-4">Mission</p>
            <p className="body text-lg">{mission}</p>
          </div>
          <div>
            <p className="eyebrow mb-4">Vision</p>
            <p className="body text-lg">{vision}</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* SERVICES */}
      <section
        id="services"
        className="relative z-10 scroll-mt-24 bg-creme text-[#08294a]"
      >
        <div className="mx-auto w-full max-w-[1320px] px-5 pb-28 pt-10 sm:px-8 lg:px-10 lg:pb-36 lg:pt-12">
          <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div className="max-w-[28rem]">
              <p className="mb-6 font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[#607086]">
                How we work together
              </p>
              <h2 className="h2 max-w-[24ch] text-[#08294a]">
                Three ways to run your content.
              </h2>
            </div>
            <p className="max-w-[38rem] font-body text-base font-medium leading-relaxed text-[#52677f] lg:pb-1 lg:text-[1.05rem]">
              {servicesIntro}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
            {services.map((service) => (
              <article
                key={service.title}
                className="hover-glow group flex flex-col overflow-hidden rounded-3xl border border-[#d8e3ef] bg-white p-7 shadow-[0_18px_55px_rgba(3,16,36,0.07)] sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-[#0f5d73]">
                    {service.index}
                  </span>
                </div>

                <h3 className="mt-7 font-display text-3xl font-extrabold leading-none tracking-[-0.05em] text-[#08294a]">
                  {service.title}
                </h3>
                <p className="mt-3 font-display text-lg font-bold leading-snug tracking-[-0.03em] text-[#0f5d73]">
                  {service.tagline}
                </p>
                <p className="mt-4 font-body text-[0.9rem] font-semibold leading-relaxed text-[#08294a]/70">
                  {service.audience}
                </p>

                <div className="mt-5 space-y-3">
                  {service.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="font-body text-[0.92rem] font-medium leading-relaxed text-[#52677f]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-8 border-t border-[#d8e3ef] pt-6">
                  <p className="font-mono text-[0.64rem] uppercase tracking-[0.22em] text-[#607086]">
                    Includes
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {service.includes.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2.5 font-body text-[0.88rem] font-medium leading-snug text-[#31475f]"
                      >
                        <span
                          aria-hidden
                          className="mt-[0.45em] size-1.5 shrink-0 rounded-full bg-[#0f5d73]"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="mt-auto border-t border-[#d8e3ef] pt-6 font-body text-[0.88rem] font-medium leading-relaxed text-[#52677f]">
                  <span className="font-semibold text-[#08294a]">Best for: </span>
                  {service.bestFor}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-center gap-6 text-center">
            <p className="font-display text-2xl font-extrabold tracking-[-0.04em] text-[#08294a] sm:text-3xl">
              {servicesClose}
            </p>
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
          <h2 className="h2 max-w-[18ch]">
            The questions you&apos;re already asking.
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
          <h2 className="display mx-auto max-w-[18ch] !text-[clamp(2.35rem,5vw,4.5rem)]">
            Talk with a creative representative.
          </h2>
          <p className="body mx-auto mt-8 text-lg">{ctaOffer}</p>
          <div className="mt-10 flex justify-center">
            <Button asChild size="lg">
              <Link href="/get-started">Get started</Link>
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

