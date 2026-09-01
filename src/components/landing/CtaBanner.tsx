import { IconBolt, IconCheck, IconShield } from "@/components/icons";
import { Reveal } from "@/components/Reveal";

const points = [
  { text: "Reduce risk and rework", icon: IconShield },
  { text: "Stay compliant, every time", icon: IconCheck },
  { text: "Audit-ready in seconds", icon: IconBolt },
];

export function CtaBanner() {
  return (
    <section className="grid overflow-hidden sm:grid-cols-2">
      <Reveal className="relative flex flex-col justify-center gap-5 bg-brand-orange px-8 py-16 sm:px-12">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url(/af-accountable.png)" }}
        />
        <h2 className="relative max-w-xs text-4xl font-bold leading-tight tracking-tight text-brand-dark sm:text-5xl">
          Make every asset accountable.
        </h2>
      </Reveal>

      <Reveal
        delay={120}
        className="relative grid grid-cols-1 items-center gap-4 bg-brand-dark px-8 py-16 sm:grid-cols-3 sm:px-12"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      >
        {points.map(({ text, icon: Icon }, i) => (
          <div
            key={text}
            className="reveal is-visible aspect-[2/1] rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm transition duration-300 hover:bg-white/10 sm:aspect-square"
            style={{ animationDelay: `${300 + i * 100}ms` }}
          >
            <div
              className="animate-float flex h-full flex-col items-center justify-center gap-2 p-3 text-center"
              style={{ animationDelay: `${i * 400}ms` }}
            >
              <Icon className="h-5 w-5 shrink-0 text-brand-orange" />
              <span className="text-sm font-medium text-white/90 sm:text-base">{text}</span>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
