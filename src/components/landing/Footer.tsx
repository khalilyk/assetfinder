import { IconArrowRight, IconLinkedIn } from "@/components/icons";

const columns = [
  {
    title: "Platform",
    links: ["Features", "Integrations", "Security", "Status"],
  },
  {
    title: "Solutions",
    links: ["Builders", "Fire contractors", "Certifiers", "Use cases"],
  },
  {
    title: "Services",
    links: ["Uptick setup", "Report templates", "Dashboards", "Integrations"],
  },
  {
    title: "Company",
    links: ["About us", "Careers", "News", "Contact"],
  },
];

export function Footer() {
  return (
    <footer className="bg-brand-dark px-6 pt-16 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.4fr_2fr_auto]">
          <div>
            <a href="#" className="flex items-center gap-2">
              <span className="text-lg">🔥</span>
              <span className="text-base font-semibold text-white">AssetFinder</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/40">
              Precision QR-code asset traceability for fire and building
              systems. Built in Australia. Backed by Uptick.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
              <svg viewBox="0 0 16 16" className="h-4 w-4 fill-none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
                <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              Works seamlessly with{" "}
              <span className="font-medium text-white/70">Uptick</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-sm font-semibold text-white">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-white/40 transition hover:text-white/70"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <a
              href="#demo"
              className="flex items-center gap-1.5 rounded-full bg-brand-lime px-4 py-2.5 text-sm font-semibold text-brand-dark transition duration-200 hover:scale-105 hover:bg-brand-lime-dark active:scale-95"
            >
              Book a demo
              <IconArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 py-6 text-xs text-white/30 sm:grid sm:grid-cols-3">
          <div className="flex items-center gap-2 sm:justify-self-start">
            <span>🔥</span>
            <span>© 2026 AssetFinder Pty Ltd. All rights reserved.</span>
          </div>
          <a
            href="https://bybric.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white/60 sm:justify-self-center"
          >
            made by bric
          </a>
          <div className="flex items-center gap-5 sm:justify-self-end">
            <a href="#" className="transition hover:text-white/60">
              Privacy Policy
            </a>
            <a href="#" className="transition hover:text-white/60">
              Terms of Service
            </a>
            <a href="#" className="transition hover:text-white/60">
              Sitemap
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="transition duration-200 hover:scale-110 hover:text-white/60"
            >
              <IconLinkedIn className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
