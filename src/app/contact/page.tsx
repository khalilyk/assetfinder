import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { IconArrowRight, IconMail } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact - AssetFinder",
  description:
    "Get in touch with AssetFinder: general enquiries, support and our Sydney office.",
};

function IconPin({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9" r="2.3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconPhone({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.8 21 3 13.2 3 3.9c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.2 2.2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const contactPoints = [
  {
    icon: IconMail,
    label: "General enquiries",
    value: "charbel@assetfinder.au",
  },
  {
    icon: IconPhone,
    label: "Phone",
    value: "+61 428 083 706",
  },
  {
    icon: IconPin,
    label: "Office",
    value: "Sydney, NSW, Australia",
  },
];

export default function ContactPage() {
  return (
    <main>
      <div className="bg-brand-dark">
        <Header />
      </div>
      <PageHero
        eyebrow="COMPANY"
        title="Let's talk."
        subtitle="Questions about the platform, pricing, or how AssetFinder fits your sites? We'd love to hear from you."
      />

      <section className="bg-white px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-6xl items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <Reveal className="md:sticky md:top-24">
            <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-[#f6f6f4] p-8">
              <h2 className="text-xl font-bold tracking-tight text-brand-dark">Get in touch</h2>
              <p className="text-sm leading-relaxed text-black/60">
                Reach out directly, or send us a message and we&rsquo;ll get back to you shortly.
              </p>
              <div className="mt-4 flex flex-col gap-5">
                {contactPoints.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lime-50 text-brand-dark">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs tracking-wide text-black/40">{label.toUpperCase()}</p>
                      <p className="text-sm font-semibold text-brand-dark">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="rounded-2xl border border-black/10 p-8">
              <h2 className="text-xl font-bold tracking-tight text-brand-dark">Send a message</h2>
              <form className="mt-6 flex flex-col gap-5">
                <div>
                  <label
                    htmlFor="name"
                    className="text-xs font-semibold tracking-wide text-black/50"
                  >
                    NAME
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Jane Smith"
                    className="mt-2 w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-brand-dark placeholder:text-black/30 focus:border-brand-lime focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="text-xs font-semibold tracking-wide text-black/50"
                  >
                    WORK EMAIL
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="jane@company.com"
                    className="mt-2 w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-brand-dark placeholder:text-black/30 focus:border-brand-lime focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="reason"
                    className="text-xs font-semibold tracking-wide text-black/50"
                  >
                    REASON
                  </label>
                  <select
                    id="reason"
                    defaultValue="Book a demo"
                    className="mt-2 w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-brand-dark focus:border-brand-lime focus:outline-none"
                  >
                    <option>Book a demo</option>
                    <option>General enquiry</option>
                    <option>Support</option>
                    <option>Partnership</option>
                    <option>Careers</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="text-xs font-semibold tracking-wide text-black/50"
                  >
                    MESSAGE
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us a bit about your sites and what you're looking for."
                    className="mt-2 w-full resize-none rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-brand-dark placeholder:text-black/30 focus:border-brand-lime focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-glow group mt-2 flex w-full items-center justify-center gap-1.5 rounded-full bg-brand-lime px-5 py-3 text-sm font-semibold text-brand-dark transition duration-200 hover:scale-105 hover:bg-brand-lime-dark active:scale-95 sm:w-auto"
                >
                  Send message
                  <IconArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:rotate-45" />
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
