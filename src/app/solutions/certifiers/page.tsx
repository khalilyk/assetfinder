import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageHero } from "@/components/PageHero";
import { PageCta } from "@/components/PageCta";
import { Reveal } from "@/components/Reveal";
import { IconCheck, IconDoc, IconQr } from "@/components/icons";

export const metadata: Metadata = {
  title: "Solutions for Certifiers - AssetFinder",
  description:
    "Pull a complete, scannable service history for any asset on site, and issue certificates backed by an audit trail that holds up.",
};

const cards = [
  {
    icon: IconQr,
    title: "Verify in seconds, not site visits",
    desc: "Scan any tagged asset to see its full install, inspection and service history on the spot, without waiting on someone else's paperwork.",
  },
  {
    icon: IconDoc,
    title: "A complete audit trail",
    desc: "Every scan, edit and sign-off is timestamped and attributed, giving you the evidence trail a certificate needs to stand up later.",
  },
  {
    icon: IconCheck,
    title: "Issue with confidence",
    desc: "Reports are formatted for certification, so you can move from verification to sign-off without reformatting someone else's spreadsheet.",
  },
];

const checklist = [
  "Scan any asset to pull its full service and inspection history",
  "Every action timestamped and attributed for later scrutiny",
  "Reports formatted for certification submission",
  "Less time on site chasing paperwork from multiple contractors",
  "Confidence that nothing was missed before you sign off",
];

export default function CertifiersPage() {
  return (
    <main>
      <div className="bg-brand-dark">
        <Header />
      </div>
      <PageHero
        eyebrow="SOLUTIONS"
        title="Verify faster, and issue with confidence."
        subtitle="Pull a complete, scannable service history for any asset on site, and issue certificates backed by an audit trail that holds up."
      />

      <section className="bg-white px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-black/60">
              Certifiers are asked to sign off on records they didn&apos;t
              create and can&apos;t always verify on the spot. AssetFinder
              turns every tagged asset into a scannable record of its full
              service and inspection history, so verification doesn&apos;t
              mean chasing down a contractor&apos;s files.
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
              LESS TIME ON SITE
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              More confidence in the record.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/50">
              AssetFinder gives certifiers the same record contractors and
              building owners are already working from.
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
        title="See how AssetFinder speeds up verification."
        subtitle="Book a demo and we'll walk through scanning, audit trails and certification-ready reporting."
      />
      <Footer />
    </main>
  );
}
