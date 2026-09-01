import { IconArrowRight, IconChart, IconDoc, IconPlug, IconPuzzle } from "@/components/icons";
import { Reveal } from "@/components/Reveal";

const tools = [
  {
    icon: IconPlug,
    title: "Uptick setup",
    desc: "Pre-configured integration for fast, reliable data flow.",
  },
  {
    icon: IconDoc,
    title: "Custom report templates",
    desc: "Tailored reports to match your compliance and branding.",
  },
  {
    icon: IconChart,
    title: "Dashboards",
    desc: "Real-time insights across assets, sites and teams.",
  },
  {
    icon: IconPuzzle,
    title: "Integrations",
    desc: "Connect with the systems you already use.",
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
          {tools.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 80} className="h-full">
              <div className="group flex h-full flex-col rounded-xl border border-black/10 p-5 transition duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-lg">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-50 text-brand-lime-dark transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-brand-dark">{title}</h3>
                <p className="mt-1 text-sm text-black/50">{desc}</p>
                <a
                  href="#"
                  className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold text-brand-dark"
                >
                  Learn more
                  <IconArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
