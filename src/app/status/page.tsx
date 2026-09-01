import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Gauge } from "@/components/Gauge";
import { IconBolt, IconBox, IconGrid, IconPlug } from "@/components/icons";

export const metadata: Metadata = {
  title: "System Status - AssetFinder",
  description:
    "Live status of AssetFinder's web application, API, mobile app and Uptick integration.",
};

const components = [
  { icon: IconGrid, name: "Web application", status: "Operational" },
  { icon: IconBolt, name: "API", status: "Operational" },
  { icon: IconBox, name: "Mobile app", status: "Operational" },
  { icon: IconPlug, name: "Uptick integration", status: "Operational" },
];

export default function StatusPage() {
  return (
    <main>
      <div className="bg-brand-dark">
        <Header />
      </div>
      <PageHero
        eyebrow="PLATFORM"
        title="System status."
        subtitle="Real-time visibility into the health of AssetFinder's platform and integrations."
      />

      <section className="bg-white px-6 py-20 md:px-10">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="flex flex-col items-center gap-8 rounded-2xl border border-black/10 bg-[#f6f6f4] px-8 py-12 text-center sm:flex-row sm:justify-between sm:gap-10 sm:px-12 sm:text-left">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-lime opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-lime" />
                </span>
                <span className="rounded-full bg-lime-100 px-3 py-1.5 text-sm font-semibold text-lime-700">
                  All systems operational
                </span>
              </div>
              <Gauge value={99.99} decimals={2} label="UPTIME (LAST 90 DAYS)" />
            </div>
          </Reveal>

          <div className="mt-10 divide-y divide-black/10 overflow-hidden rounded-xl border border-black/10">
            {components.map(({ icon: Icon, name, status }, i) => (
              <Reveal key={name} delay={i * 80}>
                <div className="flex items-center justify-between gap-4 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-50 text-brand-dark">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-semibold text-brand-dark">{name}</span>
                  </div>
                  <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-medium text-lime-700">
                    {status}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-8 text-center text-xs leading-relaxed text-black/40">
            This page reflects the current operating status of AssetFinder. For incident history
            or to report a problem, contact your account manager or email
            charbel@assetfinder.au.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
