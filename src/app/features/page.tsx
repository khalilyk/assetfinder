import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageHero } from "@/components/PageHero";
import { PageCta } from "@/components/PageCta";
import { Reveal } from "@/components/Reveal";
import {
  IconBox,
  IconCheck,
  IconClipboard,
  IconDoc,
  IconGrid,
  IconQr,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Features - AssetFinder",
  description:
    "QR asset tagging, real-time compliance dashboards, inspection logging, audit trails, reporting and a mobile app: everything you need to prove compliance.",
};

const features = [
  {
    icon: IconQr,
    title: "QR asset tagging",
    desc: "Give every fire and building asset a unique, scannable identity that travels with it for life, from installation to decommission.",
  },
  {
    icon: IconGrid,
    title: "Real-time compliance dashboard",
    desc: "See the compliance status of every site, floor and asset at a glance, with drill-down into any record.",
  },
  {
    icon: IconClipboard,
    title: "Inspection logging",
    desc: "Log inspections, services and defects from the field in seconds, with photos and notes attached to the asset.",
  },
  {
    icon: IconCheck,
    title: "Audit trail",
    desc: "Every scan, edit and sign-off is timestamped and attributed, so records stand up to scrutiny.",
  },
  {
    icon: IconDoc,
    title: "Custom reporting",
    desc: "Generate branded, audit-ready compliance reports for a single asset, a site or an entire portfolio.",
  },
  {
    icon: IconBox,
    title: "Mobile app",
    desc: "Scan, log and update records from any device in the field, including offline, with sync when you're back online.",
  },
];

export default function FeaturesPage() {
  return (
    <main>
      <div className="bg-brand-dark">
        <Header />
      </div>
      <PageHero
        eyebrow="PLATFORM"
        title="Everything you need to prove compliance."
        subtitle="One platform for tagging, tracking, inspecting and reporting on every fire and building safety asset you're responsible for."
      />

      <section className="bg-white py-20">
        <div className="flex flex-col gap-20">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title}>
              <div className="grid items-center md:grid-cols-2">
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#f6f6f4] md:aspect-[3/2]">
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage:
                          "radial-gradient(rgba(11,14,18,0.08) 1px, transparent 1px)",
                        backgroundSize: "18px 18px",
                      }}
                    />
                    <span className="absolute left-5 top-5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold tracking-[0.1em] text-black/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-lime-100">
                      <Icon className="h-11 w-11 text-lime-700" />
                    </span>
                  </div>
                </div>
                <div
                  className={`px-6 py-10 sm:px-12 md:py-0 ${i % 2 === 1 ? "md:order-1" : ""}`}
                >
                  <h3 className="text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl">
                    {title}
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-black/60">{desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <PageCta />
      <Footer />
    </main>
  );
}
