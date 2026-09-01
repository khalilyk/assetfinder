import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageHero } from "@/components/PageHero";
import { PageCta } from "@/components/PageCta";
import { Reveal } from "@/components/Reveal";
import { IconCheck, IconDoc, IconPuzzle } from "@/components/icons";

export const metadata: Metadata = {
  title: "About - AssetFinder",
  description:
    "AssetFinder was built by a small Sydney team to replace spreadsheets and paper trails with provable, real-time fire and building compliance records.",
};

const values = [
  {
    icon: IconCheck,
    title: "Compliance should be provable, not just claimed",
    desc: "A record only counts if it can stand up to an audit. We build for evidence, not paperwork for its own sake.",
  },
  {
    icon: IconDoc,
    title: "Field teams shouldn't need a manual",
    desc: "If a technician needs training to log an inspection, the tool has failed. Scan, log, done.",
  },
  {
    icon: IconPuzzle,
    title: "Every asset has a story: we make it easy to tell",
    desc: "From installation to decommission, an asset's history should be one scan away for anyone who needs it.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <div className="bg-brand-dark">
        <Header />
      </div>
      <PageHero
        eyebrow="COMPANY"
        title="Built by people who've dealt with the paperwork."
        subtitle="AssetFinder started with a simple frustration: compliance records that live in spreadsheets, folders and filing cabinets don't hold up when it matters."
      />

      <section className="bg-white px-6 py-20 md:px-10">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-base leading-relaxed text-black/60">
              AssetFinder was built by a small team in Sydney who saw compliance teams
              drowning in spreadsheets and paper trails: chasing down service history,
              re-keying the same data across systems, and scrambling to pull together evidence
              before an audit. We set out to build the tool we wished existed: one place to tag,
              track and prove the compliance status of every fire and building safety asset a
              team is responsible for.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#f6f6f4] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="text-center text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
              What we believe.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 80} className="h-full">
                <div className="group flex h-full flex-col gap-4 rounded-xl border border-black/10 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-lg">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-50 text-brand-dark transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-brand-dark">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-black/50">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-base leading-relaxed text-black/60">
              We&rsquo;re based in Sydney, NSW, Australia, and work closely with Uptick to keep
              compliance data flowing between the tools fire and building safety teams already
              use.
            </p>
          </Reveal>
        </div>
      </section>

      <PageCta
        title="Want to talk to the team?"
        subtitle="We're always happy to hear how compliance teams are managing their assets today, and where AssetFinder could help."
      />
      <Footer />
    </main>
  );
}
