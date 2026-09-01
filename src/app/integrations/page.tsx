import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageHero } from "@/components/PageHero";
import { PageCta } from "@/components/PageCta";
import { Reveal } from "@/components/Reveal";
import {
  IconBolt,
  IconBox,
  IconCheck,
  IconDoc,
  IconLink,
  IconPlug,
  IconShield,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Integrations - AssetFinder",
  description:
    "Connect AssetFinder to Uptick and the rest of your stack: single sign-on, a REST API and webhooks, accounting exports and document storage sync.",
};

const uptickPoints = [
  "Two-way asset sync: assets created or updated in either platform stay in step automatically.",
  "Inspection and service records logged in AssetFinder flow straight into Uptick job history.",
  "Compliance status changes trigger updates on both sides, so nothing goes stale.",
  "No double entry for technicians working across both tools in the field.",
];

const integrations = [
  {
    icon: IconShield,
    title: "Single sign-on (SSO)",
    desc: "Let your team sign in with the identity provider you already use, with centralised access management.",
  },
  {
    icon: IconLink,
    title: "REST API & webhooks",
    desc: "Pull asset and compliance data into your own systems, or subscribe to real-time events as records change.",
  },
  {
    icon: IconDoc,
    title: "Accounting / ERP export",
    desc: "Export asset registers and job costs in formats ready to drop into your accounting or ERP platform.",
  },
  {
    icon: IconBox,
    title: "Document storage sync",
    desc: "Keep certificates, photos and reports mirrored to the document store your organisation already relies on.",
  },
  {
    icon: IconBolt,
    title: "Notifications & alerts",
    desc: "Push compliance and inspection alerts into the messaging or ticketing tools your team monitors daily.",
  },
];

export default function IntegrationsPage() {
  return (
    <main>
      <div className="bg-brand-dark">
        <Header />
      </div>
      <PageHero
        eyebrow="PLATFORM"
        title="Connect AssetFinder to the tools you already use."
        subtitle="A growing set of integrations keeps asset and compliance data flowing between AssetFinder and the rest of your stack, starting with a deep, two-way connection to Uptick."
      />

      <section className="bg-white px-6 pt-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="grid gap-10 rounded-2xl border border-black/10 bg-[#f6f6f4] px-8 py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:px-12 md:py-14">
              <div>
                <span className="inline-flex items-center rounded-full bg-lime-100 px-3 py-1 text-[11px] font-semibold tracking-[0.15em] text-lime-700">
                  PRIMARY INTEGRATION
                </span>
                <div className="mt-5 flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lime-50 text-brand-dark">
                    <IconPlug className="h-7 w-7" />
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl">
                    Uptick
                  </h2>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-black/60">
                  Uptick is where most of our customers already manage servicing and job
                  scheduling. AssetFinder connects directly to it, so asset records and
                  inspection data stay in sync in both directions: no exports, no manual
                  re-keying.
                </p>
              </div>
              <ul className="flex flex-col gap-4">
                {uptickPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime-100 text-lime-700">
                      <IconCheck className="h-3 w-3" />
                    </span>
                    <span className="text-sm leading-relaxed text-black/60">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="text-center text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
              And the rest of your stack.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 80} className="h-full">
                <div className="group flex h-full flex-col gap-4 rounded-xl border border-black/10 p-6 transition duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-lg">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-50 text-brand-dark transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-brand-dark">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-black/50">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <PageCta />
      <Footer />
    </main>
  );
}
