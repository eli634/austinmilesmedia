import Link from "next/link";

export const metadata = {
  title: "Privacy Notice",
  description: "Privacy notice for Austin Miles Media.",
};

export default function PrivacyPage() {
  return (
    <main className="relative z-10 min-h-screen bg-ink px-5 py-10 text-creme">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(2,7,19,0.28)] backdrop-blur-xl sm:p-8">
        <Link
          href="/"
          className="font-body text-sm font-semibold text-creme/62 transition-colors hover:text-creme"
        >
          Back to site
        </Link>

        <h1 className="mt-8 font-display text-4xl font-black tracking-[-0.055em] sm:text-5xl">
          Privacy Notice
        </h1>
        <p className="mt-4 font-body text-sm leading-relaxed text-creme/64">
          Last updated June 29, 2026
        </p>

        <div className="mt-8 grid gap-7 font-body text-base leading-relaxed text-creme/72">
          <section>
            <h2 className="font-display text-2xl font-extrabold tracking-[-0.04em] text-creme">
              What We Collect
            </h2>
            <p className="mt-3">
              If you submit a form, we collect the contact details and project
              information you provide, such as your name, email, phone, business,
              goals, and message.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-extrabold tracking-[-0.04em] text-creme">
              How We Use It
            </h2>
            <p className="mt-3">
              We use submitted information to respond to inquiries, manage client
              relationships, schedule work, and improve our services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-extrabold tracking-[-0.04em] text-creme">
              Cookies And Ads
            </h2>
            <p className="mt-3">
              The site uses essential cookies for security and admin sessions. If
              advertising or analytics tools such as Meta Pixel are added, they
              may use cookies or similar technology to measure campaign
              performance and improve ad relevance.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-extrabold tracking-[-0.04em] text-creme">
              Data Sharing
            </h2>
            <p className="mt-3">
              We do not sell personal information. We may use trusted service
              providers for hosting, database storage, email delivery, analytics,
              advertising measurement, and business operations.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-extrabold tracking-[-0.04em] text-creme">
              Contact
            </h2>
            <p className="mt-3">
              To request access, correction, or deletion of your information,
              contact us at{" "}
              <a
                href="mailto:austin@austinmilesmedia.com"
                className="font-semibold text-creme underline"
              >
                austin@austinmilesmedia.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
