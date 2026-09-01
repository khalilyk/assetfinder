import { Reveal } from "@/components/Reveal";

const logos = [
  { name: "Redstone Constructions", mark: "R" },
  { name: "Summit Group", mark: "▲" },
  { name: "Brighton Building", mark: "▥" },
  { name: "Southern Fire Services", mark: "🔥" },
  { name: "Harbourline Facilities", mark: "≡" },
];

export function TrustedBy() {
  return (
    <section className="bg-[#f6f6f4] px-6 py-16 md:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-center text-xs font-semibold tracking-[0.2em] text-black/40">
            TRUSTED IN THE FIELD
          </p>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-5">
          {logos.map((logo, i) => (
            <Reveal key={logo.name} delay={i * 60}>
              <div className="flex items-center justify-center gap-2 text-black/40 grayscale transition duration-300 hover:text-black/70 hover:grayscale-0">
                <span className="text-lg">{logo.mark}</span>
                <span className="text-sm font-semibold">{logo.name}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
