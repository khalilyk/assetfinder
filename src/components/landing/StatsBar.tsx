import { IconBolt, IconQr, IconShield } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";

const stats = [
  { icon: IconQr, end: 100, decimals: 0, suffix: "K+", label: "ASSETS TRACKED" },
  { icon: IconShield, end: 99.99, decimals: 2, suffix: "%", label: "UPTIME" },
  { icon: IconBolt, end: 3.2, decimals: 1, suffix: " SEC", label: "AVG. LOOKUP" },
];

export function StatsBar() {
  return (
    <section className="border-t border-white/10 px-6 py-8 md:px-10">
      <Reveal className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-white/10">
        {stats.map(({ icon: Icon, end, decimals, suffix, label }) => (
          <div
            key={label}
            className="group flex flex-col items-center justify-center gap-1 px-1 py-4 text-center transition sm:flex-row sm:gap-4 sm:py-3 sm:text-left"
          >
            <Icon className="h-6 w-6 text-brand-lime transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10" />
            <div>
              <p className="text-lg font-bold text-white sm:text-3xl">
                <CountUp end={end} decimals={decimals} suffix={suffix} />
              </p>
              <p className="text-[9px] tracking-wide text-white/40 sm:text-xs">{label}</p>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
