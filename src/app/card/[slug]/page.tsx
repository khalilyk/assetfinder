"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

type CardUser = {
  name: string;
  email: string;
  title: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  bio: string | null;
  avatarUrl: string | null;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function VCardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [user, setUser] = useState<CardUser | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/card/${slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setUser(d.user))
      .catch(() => setNotFound(true));
  }, [slug]);

  function shareCard() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: user?.name, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  if (notFound) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-dark px-6 text-center">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-brand-lime">ASSETFINDER</p>
          <h1 className="mt-4 text-2xl font-bold text-white">Card not found</h1>
          <Link href="/" className="mt-6 inline-block text-sm font-semibold text-brand-lime hover:text-brand-lime-dark">
            ← Back to AssetFinder
          </Link>
        </div>
      </main>
    );
  }

  if (!user) {
    return <main className="min-h-screen bg-brand-dark" />;
  }

  return (
    <main className="min-h-screen bg-brand-dark pb-16">
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-brand-dark-2 to-brand-dark">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        <Link href="/" className="absolute left-6 top-6 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assetfinder-logo.png" alt="AssetFinder" className="h-6 w-auto" />
        </Link>
      </div>

      <div className="mx-auto -mt-14 max-w-sm px-6">
        <div className="flex flex-col items-center">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-28 w-28 rounded-full border-4 border-brand-dark object-cover shadow-xl"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-brand-dark bg-gradient-to-br from-brand-lime to-brand-orange text-2xl font-bold text-brand-dark shadow-xl">
              {initials(user.name)}
            </div>
          )}
          <h1 className="mt-4 text-xl font-bold text-white">{user.name}</h1>
          {user.title && <p className="text-sm text-white/50">{user.title}</p>}
          <p className="mt-1 text-xs font-semibold tracking-[0.15em] text-brand-lime">ASSETFINDER</p>
        </div>

        {user.bio && <p className="mt-6 text-center text-sm leading-relaxed text-white/60">{user.bio}</p>}

        <div className="mt-8 flex flex-col gap-2">
          {user.phone && (
            <ContactRow
              href={`tel:${user.phone}`}
              label="Mobile"
              value={user.phone}
              icon={
                <path d="M6 3h3l1.5 4-2 1.5a11 11 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2 2A15 15 0 014 5a2 2 0 012-2z" />
              }
            />
          )}
          <ContactRow
            href={`mailto:${user.email}`}
            label="Email"
            value={user.email}
            icon={<path d="M3 6h18v12H3zM3 6l9 7 9-7" />}
          />
          {user.linkedinUrl && (
            <ContactRow
              href={user.linkedinUrl}
              label="LinkedIn"
              value="View profile"
              external
              icon={
                <>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M7 10v7M7 7v.01M12 17v-4a2 2 0 014 0v4M12 13v4" />
                </>
              }
            />
          )}
        </div>

        <div className="mt-8 flex flex-col gap-2.5">
          <a
            href={`/api/card/${slug}?format=vcf`}
            className="btn-glow flex items-center justify-center gap-1.5 rounded-full bg-brand-lime px-5 py-3.5 text-sm font-semibold text-brand-dark transition duration-200 hover:scale-[1.02] hover:bg-brand-lime-dark active:scale-95"
          >
            Save {user.name.split(" ")[0]} to Contacts
          </a>
          <button
            onClick={shareCard}
            className="flex items-center justify-center gap-1.5 rounded-full border border-white/15 px-5 py-3.5 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
          >
            {copied ? "Link copied!" : "Share this card"}
          </button>
        </div>
      </div>
    </main>
  );
}

function ContactRow({
  href,
  label,
  value,
  icon,
  external,
}: {
  href: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="flex items-center gap-3 rounded-xl border border-white/10 bg-brand-dark-2/80 px-4 py-3 transition hover:border-white/20"
    >
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] flex-shrink-0 fill-none text-brand-lime">
        <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </g>
      </svg>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-white/35">{label}</p>
        <p className="truncate text-sm font-medium text-white/90">{value}</p>
      </div>
    </a>
  );
}
