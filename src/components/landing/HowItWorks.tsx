import { IconArrowRight, IconDoc, IconLink, IconMail, IconQr } from "@/components/icons";
import { StockPhoto } from "@/components/StockPhoto";
import { Reveal } from "@/components/Reveal";

export async function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#f6f6f4] px-6 pb-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="text-center text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
            One scan. The whole story.
          </h2>
        </Reveal>

        <div className="relative mt-14 grid gap-10 sm:grid-cols-3 sm:items-stretch sm:gap-6">
          <div className="pointer-events-none absolute left-0 right-0 top-3 hidden border-t border-dashed border-black/15 sm:block" />

          <Step
            delay={0}
            number="01"
            title="Scan the code"
            desc="Instantly capture the asset in the field."
          >
            <div className="group relative h-full min-h-[220px] overflow-hidden rounded-xl border border-black/10 transition-shadow duration-300 hover:shadow-lg">
              <StockPhoto
                query="hand scanning qr code warehouse"
                variant="scan"
                icon="📷"
                alt="Technician scanning an asset QR tag"
                className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 text-xs font-medium text-brand-dark shadow">
                <span className="h-3.5 w-3.5 animate-pulse rounded-sm border-2 border-brand-lime-dark" />
                Scanning…
                <IconArrowRight className="ml-auto h-3.5 w-3.5 text-black/40" />
              </div>
            </div>
          </Step>

          <Step
            delay={120}
            number="02"
            title="Verify the record"
            desc="See verified data and compliance status."
          >
            <div className="flex h-full min-h-[220px] flex-col rounded-xl border border-black/10 bg-white p-4 text-xs shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <p className="text-sm font-semibold text-brand-dark">AF-2048</p>
              <p className="text-black/40">Sprinkler Control Valve</p>
              <div className="mt-3 space-y-2 border-t border-black/10 pt-3">
                <div className="flex justify-between">
                  <span className="text-black/40">Status</span>
                  <span className="rounded-full bg-lime-100 px-2 py-0.5 font-medium text-lime-700">
                    Compliant
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/40">Standard</span>
                  <span className="font-medium text-brand-dark">AS 1851.3:2017</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/40">Installed</span>
                  <span className="font-medium text-brand-dark">14 Nov 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/40">Location</span>
                  <span className="font-medium text-brand-dark">L2, Plant Room 3</span>
                </div>
              </div>
              <a
                href="#"
                className="group/link mt-auto flex items-center gap-1 pt-3 font-semibold text-brand-dark"
              >
                View full record
                <IconArrowRight className="h-3 w-3 transition-transform duration-200 group-hover/link:translate-x-0.5" />
              </a>
            </div>
          </Step>

          <Step
            delay={240}
            number="03"
            title="Act with confidence"
            desc="Log actions, schedule work, share proof."
          >
            <div className="flex h-full min-h-[220px] flex-col rounded-xl border border-black/10 bg-white p-4 text-xs shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <p className="text-black/40">Next action</p>
              <p className="mt-1 text-sm font-semibold text-brand-dark">Annual inspection</p>
              <p className="text-black/40">Due 12 May 2026</p>
              <button className="mt-3 w-full rounded-full bg-brand-lime px-3 py-2 text-xs font-semibold text-brand-dark transition duration-200 hover:scale-[1.02] hover:bg-brand-lime-dark active:scale-95">
                Create work order
              </button>
              <div className="mt-auto border-t border-black/10 pt-3">
                <p className="text-black/40">Share record</p>
                <div className="mt-2 flex items-center gap-3 text-black/50">
                  <IconMail className="h-4 w-4 transition hover:text-brand-dark" />
                  <IconLink className="h-4 w-4 transition hover:text-brand-dark" />
                  <IconDoc className="h-4 w-4 transition hover:text-brand-dark" />
                  <IconQr className="h-4 w-4 transition hover:text-brand-dark" />
                </div>
              </div>
            </div>
          </Step>
        </div>
      </div>
    </section>
  );
}

function Step({
  number,
  title,
  desc,
  delay,
  children,
}: {
  number: string;
  title: string;
  desc: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <Reveal delay={delay} className="relative flex h-full flex-col">
      <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-brand-lime text-xs font-bold text-brand-dark">
        {number}
      </span>
      <div className="mt-4 min-h-[74px]">
        <h3 className="text-lg font-semibold text-brand-dark">{title}</h3>
        <p className="mt-1 text-sm text-black/50">{desc}</p>
      </div>
      <div className="mt-5 flex-1">{children}</div>
    </Reveal>
  );
}
