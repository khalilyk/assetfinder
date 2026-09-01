import { IconArrowRight } from "@/components/icons";
import { StockPhoto } from "@/components/StockPhoto";
import { Reveal } from "@/components/Reveal";

const audiences = [
  {
    title: "Builders",
    desc: "Keep assets on program and handover with complete visibility.",
    variant: "builder" as const,
    emoji: "🏗️",
    query: "construction worker hard hat site",
    href: "/solutions/builders",
  },
  {
    title: "Fire contractors",
    desc: "Deliver compliant installs and maintenance, every time.",
    variant: "contractor" as const,
    emoji: "🧯",
    query: "firefighter equipment maintenance",
    href: "/solutions/fire-contractors",
  },
  {
    title: "Certifiers",
    desc: "Verify faster and issue with confidence.",
    variant: "certifier" as const,
    emoji: "📋",
    query: "building inspector clipboard safety",
    href: "/solutions/certifiers",
  },
];

export async function BuiltFor() {
  return (
    <section className="bg-white px-6 py-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="text-center text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
            Built for the people who keep projects safe.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {audiences.map((a, i) => (
            <Reveal key={a.title} delay={i * 100} className="h-full">
              <a
                href={a.href}
                className="group relative flex aspect-[4/5] h-full overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1"
              >
                <StockPhoto
                  query={a.query}
                  orientation="portrait"
                  variant={a.variant}
                  icon={a.emoji}
                  alt={a.title}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-base backdrop-blur transition duration-300 group-hover:bg-white/25">
                  {a.emoji}
                </span>

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="text-lg font-semibold text-white">{a.title}</h3>
                  <p className="mt-1 text-sm text-white/70">{a.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-lime">
                    Learn more
                    <IconArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 group-hover:rotate-45" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
