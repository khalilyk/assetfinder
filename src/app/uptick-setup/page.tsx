import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageHero } from "@/components/PageHero";
import { PageCta } from "@/components/PageCta";
import { Reveal } from "@/components/Reveal";
import { WaveConnector } from "@/components/WaveConnector";
import { IconCheck, IconLink, IconPlug } from "@/components/icons";

export const metadata: Metadata = {
  title: "Uptick Setup - AssetFinder",
  description:
    "AssetFinder's team connects your account to Uptick and configures the two-way sync between asset records and job workflows, so you go live without the setup work.",
};

const steps = [
  {
    number: "01",
    title: "Connect accounts",
    desc: "We link your AssetFinder and Uptick accounts and confirm the right permissions are in place on both sides.",
  },
  {
    number: "02",
    title: "Map your asset types",
    desc: "We work through your asset register with you, mapping asset types and locations so records line up cleanly between platforms.",
  },
  {
    number: "03",
    title: "Go live with synced records",
    desc: "Once mapping is confirmed, we switch on the sync: inspections logged in AssetFinder flow into Uptick job history automatically, and stay that way.",
  },
];

const outcomes = [
  "Assets created or updated in either platform stay in step, with no manual re-keying.",
  "Inspection and service records logged in the field land straight in Uptick job history.",
  "Your team keeps working the way it already does. The sync runs quietly in the background.",
];

export default function UptickSetupPage() {
  return (
    <main>
      <div className="bg-brand-dark">
        <Header />
      </div>
      <PageHero
        eyebrow="SERVICES"
        title="Get set up with Uptick, fast."
        subtitle="AssetFinder's Uptick integration keeps your asset and inspection records in sync with Uptick's job and maintenance workflows. Our team handles the setup for you, end to end."
      />

      <section className="bg-white px-6 pt-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="grid gap-10 rounded-2xl border border-black/10 bg-[#f6f6f4] px-8 py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:px-12 md:py-14">
              <div>
                <span className="inline-flex items-center rounded-full bg-lime-100 px-3 py-1 text-[11px] font-semibold tracking-[0.15em] text-lime-700">
                  DONE FOR YOU
                </span>
                <div className="mt-5 flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lime-50 text-brand-dark">
                    <IconPlug className="h-7 w-7" />
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl">
                    A two-way sync, without the setup work
                  </h2>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-black/60">
                  The AssetFinder–Uptick integration keeps asset records and inspection
                  history flowing in both directions, so field teams never have to enter
                  the same data twice. Instead of leaving your team to configure it
                  themselves, our team sets it up for you and confirms everything is
                  syncing correctly before handover.
                </p>
              </div>
              <ul className="flex flex-col gap-4">
                {outcomes.map((point) => (
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
              What setup involves.
            </h2>
          </Reveal>

          <div className="relative mt-14 grid gap-10 sm:grid-cols-3 sm:gap-6">
            <WaveConnector />
            {steps.map(({ number, title, desc }, i) => (
              <Reveal key={number} delay={i * 120} className="relative flex flex-col">
                <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-brand-lime text-xs font-bold text-brand-dark">
                  {number}
                </span>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-brand-dark">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/50">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f6f6f4] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="flex flex-col items-start gap-4 rounded-xl border border-black/10 bg-white p-8 sm:flex-row sm:items-center">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lime-50 text-brand-dark">
                <IconLink className="h-6 w-6" />
              </span>
              <p className="text-sm leading-relaxed text-black/60">
                Already using Uptick across multiple sites or business units? We can plan
                a staged rollout, so each team goes live once its asset data is mapped
                and verified, with no big-bang cutover required.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <PageCta
        title="Ready to connect AssetFinder and Uptick?"
        subtitle="Book a setup call and we'll map out what your Uptick integration looks like, then handle the configuration for you."
      />
      <Footer />
    </main>
  );
}
