import { IconArrowRight, IconCheck, IconPlay } from "@/components/icons";
import { Reveal } from "@/components/Reveal";

const timeline = [
  { date: "12 May 2025", label: "Inspection completed" },
  { date: "6 Feb 2025", label: "Service completed" },
  { date: "14 Nov 2024", label: "Installation recorded" },
];

export function Hero() {
  return (
    <section className="relative flex min-h-[560px] items-center overflow-hidden px-6 py-16 md:aspect-[1672/941] md:min-h-0 md:px-10 md:py-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/af-header.png"
        alt="Field technician scanning a fire control valve's QR asset tag"
        className="animate-hero-zoom absolute inset-0 h-full w-full object-cover object-[75%_center] md:object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/75 to-brand-dark/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark/40" />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="max-w-lg">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] text-brand-lime">
              BUILT FOR FIELD TEAMS
            </p>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl">
              Know every asset.
              <br />
              Prove every check.
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
              Scan, verify and track critical fire and building assets—from
              installation to inspection—in one auditable record.
            </p>
          </Reveal>

          <Reveal delay={270}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#demo"
                className="flex items-center gap-1.5 rounded-full bg-brand-lime px-5 py-3 text-sm font-semibold text-brand-dark transition duration-200 hover:scale-105 hover:bg-brand-lime-dark active:scale-95"
              >
                Book a demo
                <IconArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#how-it-works"
                className="group flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:scale-105 hover:border-white/40 active:scale-95"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 transition group-hover:bg-white/20">
                  <IconPlay className="h-3 w-3 text-white" />
                </span>
                See how it works
              </a>
            </div>
          </Reveal>

          <Reveal delay={360}>
            <div className="mt-10 flex items-center gap-2 text-xs text-white/40">
              <svg viewBox="0 0 16 16" className="h-4 w-4 fill-none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
                <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              Works seamlessly with{" "}
              <span className="font-medium text-white/70">Uptick</span>
            </div>
          </Reveal>
        </div>

        <Reveal
          delay={200}
          className="animate-float absolute right-0 top-2 hidden w-72 rounded-xl border border-white/10 bg-brand-dark-2/95 p-4 shadow-2xl shadow-black/40 backdrop-blur transition-shadow duration-500 hover:shadow-brand-lime/10 sm:top-6 md:block lg:right-4 lg:w-80"
        >
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-brand-lime/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-brand-lime">
              VERIFIED
            </span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-lime/15 text-brand-lime">
              <IconCheck className="h-3 w-3" />
            </span>
          </div>
          <p className="mt-3 text-base font-semibold text-white">AF-2048</p>
          <p className="text-xs text-white/50">Sprinkler Control Valve</p>

          <div className="mt-4 space-y-2 border-t border-white/10 pt-3 text-xs">
            <Row label="Compliance">
              <span className="rounded-full bg-brand-lime/15 px-2 py-0.5 font-medium text-brand-lime">
                Compliant
              </span>
            </Row>
            <Row label="Last scan" value="12 May 2025, 09:41" />
            <Row label="Location" value="Level 2, Plant Room 3" />
            <Row label="Asset type" value="Fire Control Valve" />
            <Row label="Owner" value="ABC Facilities Pty Ltd" />
          </div>

          <div className="mt-4 border-t border-white/10 pt-3">
            <p className="text-[10px] font-semibold tracking-wide text-white/40">
              MAINTENANCE TIMELINE
            </p>
            <ul className="mt-2 space-y-2">
              {timeline.map((t) => (
                <li key={t.label} className="flex items-start gap-2 text-xs">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-lime" />
                  <span className="text-white/70">
                    <span className="text-white/40">{t.date}</span> {t.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <a
            href="#"
            className="group/link mt-4 flex items-center gap-1 text-xs font-semibold text-brand-lime"
          >
            View full history
            <IconArrowRight className="h-3 w-3 transition-transform duration-200 group-hover/link:translate-x-0.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/40">{label}</span>
      {children ?? <span className="font-medium text-white/80">{value}</span>}
    </div>
  );
}
