import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageHero } from "@/components/PageHero";
import { PageCta } from "@/components/PageCta";
import { Reveal } from "@/components/Reveal";
import { IconCheck, IconClipboard, IconQr, IconShield } from "@/components/icons";

export const metadata: Metadata = {
  title: "Solutions for Fire Contractors - AssetFinder",
  description:
    "Log installs and services against AS 1851 from the field, and prove compliance to every client without the paperwork chase.",
};

const cards = [
  {
    icon: IconClipboard,
    title: "Log against AS 1851",
    desc: "Record inspections, services and defects against the relevant AS 1851 schedule from the field, with photos and notes attached to the asset, not a paper docket that gets lost.",
  },
  {
    icon: IconShield,
    title: "Prove compliance instantly",
    desc: "Generate a compliance report for any asset, system or site the moment a client or auditor asks, backed by a timestamped history that stands up to scrutiny.",
  },
  {
    icon: IconQr,
    title: "Work from the field, not the office",
    desc: "Scan an asset's QR tag to pull its full history on site, log the visit, and move to the next job: no re-keying paperwork back at the depot.",
  },
];

const checklist = [
  "Inspection and service logs matched to AS 1851 schedules",
  "Photo and note evidence attached to every scan",
  "Instant, client-ready compliance reports: no report writing after hours",
  "Fewer callbacks and disputes over whether work was completed",
  "Offline logging in the field, synced automatically when back online",
];

export default function FireContractorsPage() {
  return (
    <main>
      <div className="bg-brand-dark">
        <Header />
      </div>
      <PageHero
        eyebrow="SOLUTIONS"
        title="Deliver compliant installs and maintenance, every time."
        subtitle="Log every install and service against AS 1851 in the field, and prove compliance to every client without the paperwork chase."
      />

      <section className="bg-white px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-black/60">
              Fire contractors carry the risk when records don&apos;t hold up:
              a missed service, a lost docket, a defect that was never
              followed up. AssetFinder puts inspection and service logging in
              your technicians&apos; pockets, matched to the standard your
              clients expect.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map(({ icon: Icon, title, desc }, i) => (
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

      <section className="bg-brand-dark-2 px-6 py-20 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] text-brand-lime">
              FEWER DISPUTES, FASTER SIGN-OFF
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              One source of truth for every job.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/50">
              AssetFinder gives your technicians and your clients the same
              record, so there&apos;s nothing to reconcile after the fact.
            </p>
          </Reveal>

          <ul className="mt-10 grid gap-4 text-left sm:grid-cols-2">
            {checklist.map((item, i) => (
              <Reveal key={item} delay={i * 80}>
                <li className="flex items-start gap-2.5 text-sm text-white/80">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-lime/15 text-brand-lime">
                    <IconCheck className="h-2.5 w-2.5" />
                  </span>
                  {item}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <PageCta
        title="See how AssetFinder fits your service rounds."
        subtitle="Book a demo and we'll walk through logging, compliance reporting and mobile field access."
      />
      <Footer />
    </main>
  );
}
