import { Reveal } from "@/components/Reveal";

const points = [
  "Reduce risk and rework",
  "Stay compliant, every time",
  "Audit-ready in seconds",
];

export function CtaBanner() {
  return (
    <section className="grid overflow-hidden sm:grid-cols-2">
      <Reveal className="relative flex flex-col justify-center gap-5 bg-brand-orange px-8 py-16 sm:px-12">
        <span className="absolute left-6 top-6 text-[10px] font-semibold tracking-[0.15em] text-black/40">
          AF-2048 · 247 · TRACE · VERIFY · PROVE
        </span>
        <h2 className="max-w-xs text-3xl font-bold leading-tight tracking-tight text-brand-dark">
          Make every asset accountable.
        </h2>
        <a
          href="#demo"
          className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-dark px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:scale-105 active:scale-95"
        >
          Book a demo
        </a>
      </Reveal>

      <Reveal
        delay={120}
        className="relative flex flex-col justify-center gap-4 bg-brand-dark px-8 py-16 sm:px-12"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      >
        {points.map((p, i) => (
          <div
            key={p}
            className="reveal is-visible flex items-center gap-3"
            style={{ animationDelay: `${300 + i * 100}ms` }}
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-brand-orange" />
            <span className="text-base font-medium text-white/90">{p}</span>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
