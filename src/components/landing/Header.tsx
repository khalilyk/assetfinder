"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { IconArrowRight } from "@/components/icons";

const navItems = [
  {
    label: "Platform",
    href: "/features",
    caret: true,
    items: [
      { label: "Features", href: "/features" },
      { label: "Integrations", href: "/integrations" },
      { label: "Security", href: "/security" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    label: "Solutions",
    href: "/solutions/builders",
    caret: true,
    items: [
      { label: "Builders", href: "/solutions/builders" },
      { label: "Fire contractors", href: "/solutions/fire-contractors" },
      { label: "Certifiers", href: "/solutions/certifiers" },
      { label: "Case Studies", href: "/use-cases" },
    ],
  },
  {
    label: "Services",
    href: "/uptick-setup",
    caret: true,
    items: [
      { label: "Uptick setup", href: "/uptick-setup" },
      { label: "Report templates", href: "/report-templates" },
      { label: "Dashboards", href: "/dashboards" },
      { label: "Integrations", href: "/integrations" },
    ],
  },
  {
    label: "Company",
    href: "/about",
    caret: true,
    items: [
      { label: "About us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "News", href: "/news" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const GLOW_PAD = 90;

function handlePointerGlow(e: React.MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left + GLOW_PAD}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top + GLOW_PAD}px`);
}

const glowClass =
  "before:pointer-events-none before:absolute before:-inset-[90px] before:-z-10 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 before:[background:radial-gradient(55px_circle_at_var(--x,50%)_var(--y,50%),rgba(200,230,0,0.35),transparent_70%)]";

export function Header() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard SSR-safe portal mount guard: document.body doesn't exist during server render, so createPortal can only run after the client has mounted.
    setMounted(true);
  }, []);

  const openDropdown = (label: string) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setDropdown(label);
  };

  const scheduleClose = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => setDropdown(null), 300);
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="reveal is-visible relative z-30 flex items-center justify-between px-6 py-5 md:px-10">
      <Link href="/" className="flex items-center transition hover:opacity-80">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assetfinder-logo.png" alt="AssetFinder" className="h-auto w-[200px]" />
      </Link>

      <nav className="hidden items-center gap-8 md:flex">
        {navItems.map((item) => (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => item.items && openDropdown(item.label)}
            onMouseLeave={() => item.items && scheduleClose()}
          >
            <a
              href={item.href}
              onMouseMove={handlePointerGlow}
              className={`group relative flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-white/70 transition hover:text-white ${glowClass}`}
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
                    key={sub.label}
                    href={sub.href}
                    onMouseMove={handlePointerGlow}
                    className={`relative block rounded-lg px-3 py-2 text-sm text-white/70 transition hover:text-white ${glowClass}`}
                  >
                    {sub.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <a
          href="/contact"
          className="btn-glow group hidden items-center gap-1.5 rounded-full bg-brand-lime px-4 py-2 text-sm font-semibold text-brand-dark transition duration-200 hover:scale-105 hover:bg-brand-lime-dark active:scale-95 sm:flex"
        >
          Book a demo
          <IconArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:rotate-45" />
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

      {mounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-50 flex flex-col bg-brand-lime transition-opacity duration-300 md:hidden ${
              open ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <div className="flex justify-end px-6 py-5">
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-dark/15 text-brand-dark transition hover:bg-brand-dark/10"
              >
                <svg viewBox="0 0 20 20" className="h-5 w-5 fill-none">
                  <path
                    d="M5 5l10 10M15 5L5 15"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center gap-1 px-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg py-3 text-3xl font-bold tracking-tight text-brand-dark transition hover:opacity-70"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="px-8 pb-12">
              <a
                href="/contact"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-full bg-brand-dark px-6 py-4 text-base font-semibold text-white transition hover:opacity-90 active:scale-95"
              >
                Book a demo
                <IconArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}
