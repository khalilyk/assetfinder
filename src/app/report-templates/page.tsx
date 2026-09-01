import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageHero } from "@/components/PageHero";
import { PageCta } from "@/components/PageCta";
import { Reveal } from "@/components/Reveal";
import { IconBox, IconCheck, IconClipboard, IconDoc } from "@/components/icons";

export const metadata: Metadata = {
  title: "Report Templates - AssetFinder",
  description:
    "Custom-branded compliance report templates, tailored to your standards and company branding: AS 1851 inspection reports, handover packages and portfolio summaries.",
};

const reportTypes = [
  {
    icon: IconClipboard,
    title: "AS 1851 inspection reports",
    desc: "Inspection and service reports laid out to match AS 1851 requirements, with the fields and sign-offs your auditors expect.",
  },
  {
    icon: IconDoc,
    title: "Handover packages",
    desc: "A complete, branded package of certificates, records and asset registers ready to hand to a client or building owner at project close.",
  },
  {
    icon: IconBox,
    title: "Portfolio summaries",
    desc: "A roll-up view of compliance status across every site in a portfolio, formatted for property managers and facility owners.",
  },
  {
    icon: IconCheck,
    title: "Defect & remediation reports",
    desc: "Clear, evidence-backed reports on outstanding defects and remediation work, tailored to how your business tracks them through to close-out.",
  },
];

const benefits = [
  "Your logo, colours and document structure applied consistently across every report AssetFinder generates.",
  "Layouts matched to the compliance standard you report against, not a generic one-size-fits-all template.",
  "Once built, your templates are ready to generate on demand: for a single asset, a site or a whole portfolio.",
];

export default function ReportTemplatesPage() {
  return (
    <main>
      <div className="bg-brand-dark">
        <Header />
      </div>
      <PageHero
        eyebrow="SERVICES"
        title="Compliance reports, branded to match."
        subtitle="We tailor AssetFinder's report layouts and branding to match your compliance standard and your company, so every report you send out looks and reads like it came from you."
      />

      <section className="bg-white px-6 pt-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="grid gap-10 rounded-2xl border border-black/10 bg-[#f6f6f4] px-8 py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:px-12 md:py-14">
              <div>
                <span className="inline-flex items-center rounded-full bg-lime-100 px-3 py-1 text-[11px] font-semibold tracking-[0.15em] text-lime-700">
                  CUSTOM TEMPLATES
                </span>
                <div className="mt-5 flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lime-50 text-brand-dark">
                    <IconDoc className="h-7 w-7" />
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl">
                    Built around how your team reports
                  </h2>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-black/60">
                  Every compliance team formats reports a little differently: the
                  standard they inspect against, the way defects are recorded, the
                  branding a client expects on a handover package. We work with you to
                  build report templates that match your requirements, so the reports
                  AssetFinder generates are audit-ready and consistent from day one.
                </p>
              </div>
              <ul className="flex flex-col gap-4">
                {benefits.map((point) => (
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
              Templates for how you already report.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reportTypes.map(({ icon: Icon, title, desc }, i) => (
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

      <PageCta
        title="Want reports that look like they came from you?"
        subtitle="Book a call and we'll scope the templates your compliance reports need: standards, branding and all."
      />
      <Footer />
    </main>
  );
}
