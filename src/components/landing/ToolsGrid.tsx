import { IconArrowRight, IconChart, IconDoc, IconPlug, IconPuzzle } from "@/components/icons";
import { Reveal } from "@/components/Reveal";

const tools = [
  {
    icon: IconPlug,
    title: "Uptick setup",
    desc: "Pre-configured integration for fast, reliable data flow.",
    href: "/uptick-setup",
  },
  {
    icon: IconDoc,
    title: "Custom report templates",
    desc: "Tailored reports to match your compliance and branding.",
    href: "/report-templates",
  },
  {
    icon: IconChart,
    title: "Dashboards",
    desc: "Real-time insights across assets, sites and teams.",
    href: "/dashboards",
  },
  {
    icon: IconPuzzle,
    title: "Integrations",
    desc: "Connect with the systems you already use.",
    href: "/integrations",
  },
];

export function ToolsGrid() {
  return (
    <section className="bg-white px-6 pb-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="text-center text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
            The tools and services that power accountability.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map(({ icon: Icon, title, desc, href }, i) => (
            <Reveal key={title} delay={i * 80} className="h-full">
              <div className="group flex h-full gap-4 rounded-xl border border-black/10 p-5 transition duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-lg">
                <div className="flex shrink-0 items-center">
                  <span className="transition-transform duration-300 group-hover:scale-110">
                    <span
                      className="animate-icon-float flex h-14 w-14 items-center justify-center rounded-full bg-lime-50 text-brand-dark"
                      style={{ animationDelay: `${i * 250}ms` }}
                    >
                      <Icon className="h-7 w-7" />
                    </span>
                  </span>
                </div>
                <div className="flex flex-1 flex-col">
                  <h3 className="text-sm font-semibold text-brand-dark">{title}</h3>
                  <p className="mt-1 text-sm text-black/50">{desc}</p>
                  <a
                    href={href}
                    className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold text-brand-dark"
                  >
                    Learn more
                    <IconArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 group-hover:rotate-45" />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
