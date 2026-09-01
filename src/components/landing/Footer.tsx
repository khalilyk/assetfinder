"use client";

import { useState } from "react";
import Link from "next/link";
import { IconArrowRight, IconLinkedIn, IconQr } from "@/components/icons";
import { Modal } from "@/components/Modal";
import {
  PrivacyPolicyContent,
  SitemapContent,
  TermsOfServiceContent,
} from "@/components/landing/LegalContent";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Features", href: "/features" },
      { label: "Integrations", href: "/integrations" },
      { label: "Security", href: "/security" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Builders", href: "/solutions/builders" },
      { label: "Fire contractors", href: "/solutions/fire-contractors" },
      { label: "Certifiers", href: "/solutions/certifiers" },
      { label: "Case Studies", href: "/use-cases" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Uptick setup", href: "/uptick-setup" },
      { label: "Report templates", href: "/report-templates" },
      { label: "Dashboards", href: "/dashboards" },
      { label: "Integrations", href: "/integrations" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "News", href: "/news" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

type LegalModal = "privacy" | "terms" | "sitemap" | null;

export function Footer() {
  const [openModal, setOpenModal] = useState<LegalModal>(null);

  return (
    <footer className="bg-brand-dark px-6 pt-16 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.4fr_2fr_auto]">
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <Link href="/" className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assetfinder-logo.png"
                alt="AssetFinder"
                className="h-9 w-auto sm:h-[28px]"
              />
            </Link>
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
            <a
              href="/contact"
              className="btn-glow group mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-lime px-4 py-2.5 text-sm font-semibold text-brand-dark transition duration-200 hover:scale-105 hover:bg-brand-lime-dark active:scale-95"
            >
              Book a demo
              <IconArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:rotate-45" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-sm font-semibold text-white">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-white/40 transition hover:text-white/70"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center">
            <IconQr className="hover-scramble h-[141px] w-[141px] text-brand-lime" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 py-6 text-xs text-white/30 sm:grid sm:grid-cols-3">
          <div className="flex items-center gap-2 sm:justify-self-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/af-icon.png" alt="" className="h-4 w-auto" />
            <span>© 2026 AssetFinder Pty Ltd. All rights reserved.</span>
          </div>
          <a
            href="https://bybric.com"
            target="_blank"
            rel="noopener noreferrer"
            className="order-last transition hover:text-white/60 sm:order-none sm:justify-self-center"
          >
            made by bric
          </a>
          <div className="flex items-center gap-5 sm:justify-self-end">
            <button
              type="button"
              onClick={() => setOpenModal("privacy")}
              className="transition hover:text-white/60"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setOpenModal("terms")}
              className="transition hover:text-white/60"
            >
              Terms of Service
            </button>
            <button
              type="button"
              onClick={() => setOpenModal("sitemap")}
              className="transition hover:text-white/60"
            >
              Sitemap
            </button>
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

      <Modal
        open={openModal === "privacy"}
        onClose={() => setOpenModal(null)}
        title="Privacy Policy"
      >
        <PrivacyPolicyContent />
      </Modal>
      <Modal
        open={openModal === "terms"}
        onClose={() => setOpenModal(null)}
        title="Terms of Service"
      >
        <TermsOfServiceContent />
      </Modal>
      <Modal open={openModal === "sitemap"} onClose={() => setOpenModal(null)} title="Sitemap">
        <SitemapContent />
      </Modal>
    </footer>
  );
}
