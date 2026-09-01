import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageHero } from "@/components/PageHero";
import { PageCta } from "@/components/PageCta";
import { Reveal } from "@/components/Reveal";
import { IconCheck, IconDoc, IconGrid, IconShield } from "@/components/icons";

export const metadata: Metadata = {
  title: "Solutions for Builders - AssetFinder",
  description:
    "Track every fire and building asset across the build program and hand over with a compliance record that's already complete, so there's no scramble on handover day.",
};

const cards = [
  {
    icon: IconGrid,
    title: "Track assets across the build program",
    desc: "Every tagged asset, from sprinkler heads to exit signage, is visible on one dashboard, so you always know what's installed, what's outstanding and what's compliant before the next stage sign-off.",
  },
  {
    icon: IconDoc,
    title: "Clean handover packages, every time",
    desc: "Generate a branded, audit-ready compliance report for the whole site in minutes, instead of weeks spent chasing subcontractors for paperwork.",
  },
  {
    icon: IconShield,
    title: "Avoid rework and disputes",
    desc: "A complete, timestamped record of who installed and serviced each asset means fewer arguments over missing documentation after the building owner moves in.",
  },
];

const checklist = [
  "Every asset tagged and logged as it's installed, not reconstructed later",
  "Real-time visibility into what's compliant and what's outstanding",
  "Branded, audit-ready handover packages generated in minutes",
  "A clear record of who installed, serviced and signed off each asset",
  "Facilities and building management teams inherit clean records from day one",
];

export default function BuildersPage() {
  return (
    <main>
      <div className="bg-brand-dark">
        <Header />
      </div>
      <PageHero
        eyebrow="SOLUTIONS"
        title="Keep every asset on program, and handover with complete visibility."
        subtitle="Track tagged assets from install to sign-off, and hand building owners and facilities teams a compliance record that's already complete."
      />

      <section className="bg-white px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-black/60">
              Builders carry the risk when handover packages are built from
              spreadsheets, paper dockets and a dozen subcontractors&apos;
              inboxes. AssetFinder gives every fire and building asset a
              scannable identity from the moment it&apos;s installed, so the
              record is already complete when handover day arrives.
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
              BUILT FOR HANDOVER DAY
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              No scramble at the end of the program.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/50">
              AssetFinder keeps the record building as the build happens, so
              there&apos;s nothing left to reconstruct when it&apos;s time to
              hand over.
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
        title="See how AssetFinder fits your next handover."
        subtitle="Book a demo and we'll walk through tagging, tracking and handover reporting for your program."
      />
      <Footer />
    </main>
  );
}
