import { IconArrowRight } from "@/components/icons";
import { Reveal } from "@/components/Reveal";

export function PageCta({
  title = "Ready to see AssetFinder in action?",
  subtitle = "Book a demo and we'll walk through how it fits your sites and workflows.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden px-6 py-20 md:px-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/af-demo.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-brand-dark/40" />
      <Reveal className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-2xl border border-white/30 bg-white/20 px-8 py-14 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
        <p className="max-w-md text-sm leading-relaxed text-white/80">{subtitle}</p>
        <a
          href="/contact"
          className="btn-glow group flex items-center gap-1.5 rounded-full bg-brand-lime px-5 py-3 text-sm font-semibold text-brand-dark transition duration-200 hover:scale-105 hover:bg-brand-lime-dark active:scale-95"
        >
          Book a demo
          <IconArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:rotate-45" />
        </a>
      </Reveal>
    </section>
  );
}
