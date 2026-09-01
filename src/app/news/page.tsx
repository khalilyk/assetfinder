import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { IconBox, IconDoc, IconPlug, IconQr } from "@/components/icons";

export const metadata: Metadata = {
  title: "News - AssetFinder",
  description:
    "Product news and updates from AssetFinder: offline scanning, Uptick sync, custom report branding and more.",
};

const updates = [
  {
    icon: IconBox,
    date: "August 2026",
    title: "Offline mode for the mobile app",
    desc: "The AssetFinder mobile app now scans, logs and updates records without a connection, syncing automatically once the technician is back online.",
  },
  {
    icon: IconPlug,
    date: "June 2026",
    title: "AssetFinder ships two-way Uptick sync",
    desc: "Assets and inspection records now stay in step automatically between AssetFinder and Uptick: no exports, no double entry.",
  },
  {
    icon: IconDoc,
    date: "March 2026",
    title: "Custom report branding now available",
    desc: "Compliance reports generated from AssetFinder can now carry your own logo and branding, ready to hand straight to clients and auditors.",
  },
  {
    icon: IconQr,
    date: "January 2026",
    title: "AssetFinder launches",
    desc: "AssetFinder is live: QR asset tagging, real-time compliance dashboards and inspection logging for fire and building safety teams.",
  },
];

export default function NewsPage() {
  return (
    <main>
      <div className="bg-brand-dark">
        <Header />
      </div>
      <PageHero
        eyebrow="COMPANY"
        title="News & product updates."
        subtitle="What's new in AssetFinder: features, integrations and improvements as we ship them."
      />

      <section className="bg-white px-6 py-20 md:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-4">
            {updates.map(({ icon: Icon, date, title, desc }, i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="group flex flex-col gap-4 rounded-xl border border-black/10 p-6 transition duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-lg sm:flex-row sm:items-start sm:gap-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lime-50 text-brand-dark transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold tracking-[0.15em] text-brand-lime">
                      {date.toUpperCase()}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-brand-dark">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-black/50">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
