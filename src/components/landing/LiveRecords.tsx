import {
  IconArrowRight,
  IconBox,
  IconCheck,
  IconChart,
  IconClipboard,
  IconGear,
  IconGrid,
  IconPuzzle,
} from "@/components/icons";
import { Reveal } from "@/components/Reveal";

const checklist = [
  "Real-time compliance status",
  "Ownership and location hierarchy",
  "Asset photos and documents",
  "Service history and maintenance",
  "Audit trail and user actions",
  "Export reports in one click",
];

const sidebar = [
  { label: "Dashboard", icon: IconGrid },
  { label: "Assets", icon: IconBox },
  { label: "Inspections", icon: IconCheck },
  { label: "Work Orders", icon: IconClipboard },
  { label: "Reports", icon: IconChart },
  { label: "Integrations", icon: IconPuzzle },
  { label: "Settings", icon: IconGear },
];

const tabs = ["Service history", "Audit trail", "Documents"];

const history = [
  { date: "12 May 2025", type: "Inspection", tech: "J. Smith", outcome: "Compliant" },
  { date: "6 Feb 2025", type: "Service", tech: "M. Patel", outcome: "Compliant" },
  { date: "14 Nov 2024", type: "Installation", tech: "T. Nguyen", outcome: "Completed" },
];

export function LiveRecords() {
  return (
    <section className="overflow-x-hidden bg-brand-dark px-6 py-24 md:px-10">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.2em] text-brand-lime">
            LIVE ASSET RECORDS
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            From plant room to proof.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/50">
            Every asset record in one place. Complete visibility, compliance
            and audit-ready reports.
          </p>

          <ul className="mt-7 space-y-3">
            {checklist.map((item, i) => (
              <li
                key={item}
                className="reveal is-visible flex items-center gap-2.5 text-sm text-white/80"
                style={{ animationDelay: `${150 + i * 70}ms` }}
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-lime/15 text-brand-lime">
                  <IconCheck className="h-2.5 w-2.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <a
            href="#"
            className="btn-glow-green group mt-8 inline-flex items-center gap-1.5 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:scale-105 hover:border-white/50 hover:bg-white/5 active:scale-95"
          >
            Explore the platform
            <IconArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:rotate-45" />
          </a>
        </Reveal>

        <Reveal delay={150} className="relative mx-auto w-full max-w-lg">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-brand-dark-2 shadow-2xl shadow-black/50 transition duration-500 hover:shadow-brand-lime/5 sm:mr-[60px] lg:mr-[100px]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/af-icon.png" alt="" className="h-3.5 w-auto" />
                <span className="text-xs font-semibold text-white">AssetFinder</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/5 text-white/50">
                  <IconGear className="h-3 w-3" />
                </span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-lime/80 text-[8px] font-bold text-brand-dark">
                  6
                </span>
              </div>
            </div>

            <div className="flex">
              <div className="hidden w-32 shrink-0 border-r border-white/10 py-3 sm:block">
                {sidebar.map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2 px-4 py-2 text-[11px] font-medium ${
                      label === "Assets"
                        ? "border-l-2 border-brand-lime bg-white/5 text-white"
                        : "text-white/40"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {label}
                  </div>
                ))}
              </div>

              <div className="flex-1 p-4 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">AF-2048</p>
                    <p className="text-white/40">Sprinkler Control Valve</p>
                  </div>
                  <span className="rounded-full bg-brand-lime/15 px-2 py-0.5 font-medium text-brand-lime">
                    Compliant
                  </span>
                </div>

                <div className="mt-3 flex gap-4 border-t border-white/10 pt-3">
                  <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-1.5">
                    <Field label="Location" value="Level 2, Plant Room 3" />
                    <Field label="Asset type" value="Fire Control Valve" />
                    <Field label="Installed" value="14 Nov 2024" />
                    <Field label="Owner" value="ABC Facilities Pty Ltd" />
                  </div>
                  <div className="hidden w-24 shrink-0 sm:block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/af-header.png"
                      alt="AF-2048 sprinkler control valve"
                      className="h-16 w-24 rounded-md object-cover object-[75%_center]"
                    />
                    <a
                      href="#"
                      className="mt-1 block text-right text-[10px] font-medium text-brand-lime"
                    >
                      View photos (8)
                    </a>
                  </div>
                </div>

                <div className="mt-3 border-t border-white/10 pt-2">
                  <div className="flex gap-4">
                    {tabs.map((tab) => (
                      <span
                        key={tab}
                        className={`border-b-2 pb-1.5 text-[11px] font-medium ${
                          tab === "Service history"
                            ? "border-brand-lime text-white"
                            : "border-transparent text-white/40"
                        }`}
                      >
                        {tab}
                      </span>
                    ))}
                  </div>
                  <table className="mt-2 w-full text-left">
                    <thead>
                      <tr className="text-white/30">
                        <th className="pb-1 font-medium">Date</th>
                        <th className="pb-1 font-medium">Type</th>
                        <th className="pb-1 font-medium">Technician</th>
                        <th className="pb-1 font-medium">Outcome</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((row) => (
                        <tr key={row.date} className="text-white/70">
                          <td className="py-1 pr-2">{row.date}</td>
                          <td className="py-1 pr-2">{row.type}</td>
                          <td className="py-1 pr-2">{row.tech}</td>
                          <td className="py-1 text-brand-lime">{row.outcome}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/af-phone.png"
            alt="AssetFinder mobile app showing asset AF-2048's compliance record"
            className="animate-float absolute -bottom-10 -right-6 w-32 drop-shadow-2xl transition-transform duration-500 hover:-translate-y-1 sm:-bottom-12 sm:-right-10 sm:w-40"
          />
        </Reveal>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-white/30">{label}</p>
      <p className="font-medium text-white/80">{value}</p>
    </div>
  );
}
