import { IconBolt, IconQr, IconShield } from "@/components/icons";
import { Reveal } from "@/components/Reveal";

const stats = [
  { icon: IconQr, value: "100K+", label: "ASSETS TRACKED" },
  { icon: IconShield, value: "99.99%", label: "UPTIME" },
  { icon: IconBolt, value: "3.2 SEC", label: "AVG. LOOKUP" },
];

export function StatsBar() {
  return (
    <section className="border-t border-white/10 px-6 py-8 md:px-10">
      <Reveal className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {stats.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="group flex items-center justify-center gap-3 py-4 transition sm:py-2"
          >
            <Icon className="h-6 w-6 text-brand-lime transition-transform duration-300 group-hover:scale-110" />
            <div>
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-[11px] tracking-wide text-white/40">{label}</p>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
