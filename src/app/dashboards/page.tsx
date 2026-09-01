import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageHero } from "@/components/PageHero";
import { PageCta } from "@/components/PageCta";
import { Reveal } from "@/components/Reveal";
import { IconCheck, IconChart, IconGrid, IconShield } from "@/components/icons";

export const metadata: Metadata = {
  title: "Dashboards - AssetFinder",
  description:
    "Custom dashboards configured around your team's KPIs and org structure: compliance rate, overdue inspections and assets by site, with role-based access for every team.",
};

const dashboardViews = [
  {
    icon: IconShield,
    title: "Compliance overview",
    desc: "A single view of compliance rate across every site or region you're responsible for, with drill-down into what's driving the number.",
  },
  {
    icon: IconChart,
    title: "Overdue inspections",
    desc: "A live list of overdue and upcoming inspections, sorted the way your team prioritises work: by site, asset type or due date.",
  },
  {
    icon: IconGrid,
    title: "Assets by site",
    desc: "Asset counts and status broken down by site or building, so site managers and portfolio owners can see their patch at a glance.",
  },
  {
    icon: IconCheck,
    title: "Team performance",
    desc: "Inspection throughput and turnaround by technician or crew, built for team leads who need to track workload and pace.",
  },
];

const benefits = [
  "Views and KPIs configured around your org structure: by site, region, business unit or client.",
  "Role-based access, so field technicians, site managers and executives each see the view built for them.",
  "Set up once by our team, then live and up to date as new inspections and records come in.",
];

export default function DashboardsPage() {
  return (
    <main>
      <div className="bg-brand-dark">
        <Header />
      </div>
      <PageHero
        eyebrow="SERVICES"
        title="Dashboards built around how your team works."
        subtitle="We configure views and KPIs: compliance rate, overdue inspections, assets by site, tailored to your org structure, with role-based access for every team."
      />

      <section className="bg-white px-6 pt-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="grid gap-10 rounded-2xl border border-black/10 bg-[#f6f6f4] px-8 py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:px-12 md:py-14">
              <div>
                <span className="inline-flex items-center rounded-full bg-lime-100 px-3 py-1 text-[11px] font-semibold tracking-[0.15em] text-lime-700">
                  CUSTOM DASHBOARDS
                </span>
                <div className="mt-5 flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lime-50 text-brand-dark">
                    <IconGrid className="h-7 w-7" />
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl">
                    The right view, for the right person
                  </h2>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-black/60">
                  A field technician, a site manager and an executive need different
                  things from the same compliance data. We work with your team to
                  configure dashboards around the KPIs that matter to each role and the
                  way your organisation is structured, so everyone opens AssetFinder to
                  the view that&apos;s actually useful to them.
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

      <section className="bg-white py-20">
        <div className="relative left-1/2 w-screen -translate-x-1/2">
          <div className="grid sm:grid-cols-3">
            {dashboardViews.slice(0, 3).map(({ icon: Icon, title }, i) => (
              <Reveal key={title} delay={i * 80}>
                <div
                  className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-brand-dark sm:aspect-square"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                  }}
                >
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-lime/15">
                    <Icon className="h-9 w-9 text-brand-lime" />
                  </span>
                  <span className="absolute bottom-5 left-5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                    {title}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="text-center text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
              Example dashboard views.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dashboardViews.map(({ icon: Icon, title, desc }, i) => (
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
        title="Want a dashboard built around your team?"
        subtitle="Book a call and we'll map out the views and KPIs that matter most to your organisation."
      />
      <Footer />
    </main>
  );
}
