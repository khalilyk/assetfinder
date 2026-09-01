"use client";

import { useState } from "react";
import { IconArrowRight } from "@/components/icons";

const navItems = [
  { label: "Platform" },
  { label: "Solutions", caret: true, items: ["Builders", "Fire contractors", "Certifiers"] },
  { label: "Services", caret: true, items: ["Uptick setup", "Report templates", "Dashboards"] },
  { label: "About" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);

  return (
    <header className="reveal is-visible relative z-30 flex items-center justify-between px-6 py-5 md:px-10">
      <a href="#" className="flex items-center gap-2 transition hover:opacity-80">
        <span className="text-lg" aria-hidden>
          🔥
        </span>
        <span className="text-base font-semibold tracking-tight text-white">
          AssetFinder
        </span>
      </a>

      <nav className="hidden items-center gap-8 md:flex">
        {navItems.map((item) => (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => item.items && setDropdown(item.label)}
            onMouseLeave={() => item.items && setDropdown(null)}
          >
            <a
              href="#"
              className="group flex items-center gap-1 text-sm text-white/70 transition hover:text-white"
            >
              {item.label}
              {item.caret && (
                <svg
                  viewBox="0 0 12 12"
                  className={`h-3 w-3 fill-none transition-transform duration-200 ${
                    dropdown === item.label ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="M3 4.5 6 7.5 9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-brand-lime transition-all duration-200 group-hover:w-full" />
            </a>

            {item.items && (
              <div
                className={`absolute left-1/2 top-full mt-3 w-48 -translate-x-1/2 rounded-xl border border-white/10 bg-brand-dark-2 p-2 shadow-2xl shadow-black/40 transition-all duration-200 ${
                  dropdown === item.label
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-1 opacity-0"
                }`}
              >
                {item.items.map((sub) => (
                  <a
                    key={sub}
                    href="#"
                    className="block rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                  >
                    {sub}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <a
          href="#demo"
          className="hidden items-center gap-1.5 rounded-full bg-brand-lime px-4 py-2 text-sm font-semibold text-brand-dark transition duration-200 hover:scale-105 hover:bg-brand-lime-dark active:scale-95 sm:flex"
        >
          Book a demo
          <IconArrowRight className="h-4 w-4" />
        </a>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-full border border-white/15 transition hover:border-white/30 md:hidden"
        >
          <span
            className={`h-px w-4 bg-white transition-all duration-300 ${
              open ? "translate-y-[3px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-4 bg-white transition-all duration-300 ${
              open ? "-translate-y-[3px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`absolute left-0 right-0 top-full overflow-hidden border-b border-white/10 bg-brand-dark/98 backdrop-blur transition-all duration-300 md:hidden ${
          open ? "max-h-96 opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-6 py-4">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className="rounded-lg px-2 py-2.5 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#demo"
            className="mt-2 flex items-center justify-center gap-1.5 rounded-full bg-brand-lime px-4 py-2.5 text-sm font-semibold text-brand-dark transition hover:bg-brand-lime-dark"
          >
            Book a demo
            <IconArrowRight className="h-4 w-4" />
          </a>
        </nav>
      </div>
    </header>
  );
}
