import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageHero } from "@/components/PageHero";
import { PageCta } from "@/components/PageCta";
import { Reveal } from "@/components/Reveal";
import { IconClipboard, IconGrid, IconQr, IconShield } from "@/components/icons";

export const metadata: Metadata = {
  title: "Case Studies - AssetFinder",
  description:
    "How builders, fire contractors, certifiers and facilities teams use AssetFinder to keep fire and building assets compliant and accounted for.",
};

const useCases = [
  {
    icon: IconQr,
    title: "New building handover",
    desc: "Every fire and building asset is tagged and logged as it's installed, so the compliance record is already complete when it's time to hand the building over to its owner.",
  },
  {
    icon: IconClipboard,
    title: "Annual fire safety audit",
    desc: "Instead of chasing service records from multiple contractors, compile a full, site-wide compliance report in minutes, ready for the auditor.",
  },
  {
    icon: IconGrid,
    title: "Multi-site portfolio management",
    desc: "Track the compliance status of every asset across dozens of buildings from one dashboard, with drill-down into any site, floor or asset.",
  },
  {
    icon: IconShield,
    title: "Contractor accountability",
    desc: "A timestamped record of every scan and sign-off shows exactly who serviced what and when, so accountability doesn't depend on a paper trail.",
  },
];

export default function UseCasesPage() {
  return (
    <main>
      <div className="bg-brand-dark">
        <Header />
      </div>
      <PageHero
        eyebrow="CASE STUDIES"
        title="AssetFinder in the field."
        subtitle="Four ways builders, fire contractors, certifiers and facilities teams use AssetFinder to keep assets compliant and accounted for."
      />

      <section className="bg-white px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-2">
            {useCases.map(({ icon: Icon, title, desc }, i) => (
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
