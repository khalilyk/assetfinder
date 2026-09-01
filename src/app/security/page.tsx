import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageHero } from "@/components/PageHero";
import { PageCta } from "@/components/PageCta";
import { Reveal } from "@/components/Reveal";
import { IconBox, IconCheck, IconGear, IconMail, IconShield } from "@/components/icons";

export const metadata: Metadata = {
  title: "Security - AssetFinder",
  description:
    "How AssetFinder protects compliance data: encryption in transit and at rest, role-based access controls, Australian data residency, backups and responsible disclosure.",
};

function IconPin({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9" r="2.3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

const pillars = [
  {
    icon: IconShield,
    title: "Encryption in transit & at rest",
    desc: "Data is encrypted in transit and at rest, and access to production systems is limited to what each service and person needs.",
  },
  {
    icon: IconGear,
    title: "Role-based access controls",
    desc: "Permissions are scoped by role, so people only see the sites, assets and actions relevant to their job. Every action is logged.",
  },
  {
    icon: IconCheck,
    title: "Audit logging",
    desc: "Scans, edits, sign-offs and access changes are timestamped and attributed, giving you a clear trail for every record.",
  },
  {
    icon: IconPin,
    title: "Australian data residency",
    desc: "Customer data is hosted on infrastructure located in Australia, keeping it close to the teams and sites it describes.",
  },
  {
    icon: IconBox,
    title: "Backups & availability",
    desc: "Data is backed up regularly and the platform is built for high availability, so records are there when your team needs them.",
  },
  {
    icon: IconMail,
    title: "Responsible disclosure",
    desc: "Found a security issue? We want to know. Report it to charbel@assetfinder.au and our team will follow up promptly.",
  },
];

export default function SecurityPage() {
  return (
    <main>
      <div className="bg-brand-dark">
        <Header />
      </div>
      <PageHero
        eyebrow="PLATFORM"
        title="Built to keep compliance data safe."
        subtitle="AssetFinder is built with security best practices at every layer, from how data is stored and accessed to how we respond when something needs attention."
      />

      <section className="bg-white py-20">
        <div className="flex flex-col gap-20">
          {pillars.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title}>
              <div className="grid items-center md:grid-cols-2">
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#f6f6f4] md:aspect-[3/2]">
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage:
                          "radial-gradient(rgba(11,14,18,0.08) 1px, transparent 1px)",
                        backgroundSize: "18px 18px",
                      }}
                    />
                    <span className="absolute left-5 top-5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold tracking-[0.1em] text-black/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-lime-100">
                      <Icon className="h-11 w-11 text-lime-700" />
                    </span>
                  </div>
                </div>
                <div
                  className={`px-6 py-10 sm:px-12 md:py-0 ${i % 2 === 1 ? "md:order-1" : ""}`}
                >
                  <h3 className="text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl">
                    {title}
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-black/60">{desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <PageCta />
      <Footer />
    </main>
  );
}
