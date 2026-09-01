import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { IconBox, IconChart, IconClipboard } from "@/components/icons";

export const metadata: Metadata = {
  title: "Careers - AssetFinder",
  description:
    "Join the small, Sydney-based team building AssetFinder: open roles in engineering, customer success and field compliance, plus speculative applications.",
};

const roles = [
  {
    icon: IconChart,
    title: "Senior Full-Stack Engineer",
    desc: "Help build the core platform, from the compliance dashboard to the mobile scanning app and our Uptick integration.",
    type: "Full-time · Sydney or Remote",
  },
  {
    icon: IconClipboard,
    title: "Customer Success Manager",
    desc: "Get new customers live and keep them there: onboarding, training and being the voice of the field team back into the product.",
    type: "Full-time · Sydney",
  },
  {
    icon: IconBox,
    title: "Field Compliance Specialist",
    desc: "Work directly with customers' technicians to map their asset registers and inspection workflows onto AssetFinder.",
    type: "Full-time · Remote",
  },
];

export default function CareersPage() {
  return (
    <main>
      <div className="bg-brand-dark">
        <Header />
      </div>
      <PageHero
        eyebrow="COMPANY"
        title="Help us make compliance provable."
        subtitle="We're a small, Sydney-based team building the tools fire and building compliance teams use every day, and we're remote-friendly for the right people."
      />

      <section className="bg-white px-6 py-20 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-base leading-relaxed text-black/60">
              We keep the team small and the feedback loop short: everyone here talks to
              customers, ships fast, and cares about getting the details right for the people
              relying on us in the field. We&rsquo;re based in Sydney, with remote team members
              across the rest of the country.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#f6f6f4] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="text-center text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
              Open roles.
            </h2>
          </Reveal>

          <div className="mt-14 flex flex-col gap-4">
            {roles.map(({ icon: Icon, title, desc, type }, i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="group flex flex-col gap-4 rounded-xl border border-black/10 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-lg sm:flex-row sm:items-center sm:gap-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lime-50 text-brand-dark transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="text-base font-semibold text-brand-dark">{title}</h3>
                      <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-medium text-lime-700">
                        {type}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-black/50">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl">
              Don&apos;t see the right role?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-black/60">
              We&rsquo;re always keen to hear from people who care about compliance and field
              software. Send a note and your background to{" "}
              <a
                href="mailto:charbel@assetfinder.au"
                className="font-semibold text-brand-dark underline decoration-brand-lime decoration-2 underline-offset-4"
              >
                charbel@assetfinder.au
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
