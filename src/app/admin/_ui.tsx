import React from "react";

export const ACCENT = "#c8e600";

type IconProps = { className?: string; size?: number };
const wrap =
  (path: React.ReactNode) =>
  // eslint-disable-next-line react/display-name -- shared factory, each icon is named by its Icons.<key> export
  ({ className, size = 20 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {path}
    </svg>
  );

export const Icons = {
  dashboard: wrap(
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </>,
  ),
  pages: wrap(
    <>
      <path d="M14 3v5h5" />
      <path d="M19 8v11a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1h8l5 5z" />
      <path d="M9 13h6M9 17h6" />
    </>,
  ),
  media: wrap(
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </>,
  ),
  analytics: wrap(
    <>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 16l3-4 3 2 4-6" />
    </>,
  ),
  seo: wrap(
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M16 16l5 5" />
      <path d="M11 8v6M8 11h6" />
    </>,
  ),
  users: wrap(
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 3.5a3 3 0 010 5.8M21 20a5 5 0 00-4-4.9" />
    </>,
  ),
  settings: wrap(
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1A1.7 1.7 0 004.6 9a1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
    </>,
  ),
  bell: wrap(
    <>
      <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 01-3.4 0" />
    </>,
  ),
  search: wrap(
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M16 16l5 5" />
    </>,
  ),
  external: wrap(
    <>
      <path d="M14 4h6v6M20 4l-9 9" />
      <path d="M18 13v6a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h6" />
    </>,
  ),
  plus: wrap(<path d="M12 5v14M5 12h14" />),
  edit: wrap(
    <>
      <path d="M11 4H5a1 1 0 00-1 1v14a1 1 0 001 1h14a1 1 0 001-1v-6" />
      <path d="M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </>,
  ),
  trash: wrap(
    <>
      <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-1 14a1 1 0 01-1 1H7a1 1 0 01-1-1L5 6" />
    </>,
  ),
  check: wrap(<path d="M5 12l4 4L19 6" />),
  up: wrap(<path d="M7 14l5-5 5 5" />),
  down: wrap(<path d="M7 10l5 5 5-5" />),
  eye: wrap(
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="2.6" />
    </>,
  ),
  upload: wrap(
    <>
      <path d="M12 16V4M8 8l4-4 4 4" />
      <path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
    </>,
  ),
  globe: wrap(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
    </>,
  ),
  logout: wrap(
    <>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </>,
  ),
  crm: wrap(
    <>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </>,
  ),
};

export function Card({ children, className = "", ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-brand-dark-2 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "green" | "amber" | "slate" | "blue" | "red" | "purple";
}) {
  const tones: Record<string, string> = {
    green: "bg-brand-lime/10 text-brand-lime",
    amber: "bg-brand-orange/10 text-brand-orange",
    slate: "bg-white/8 text-white/60",
    blue: "bg-sky-500/10 text-sky-400",
    red: "bg-rose-500/10 text-rose-400",
    purple: "bg-violet-500/10 text-violet-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Btn({
  children,
  variant = "primary",
  className = "",
  ...rest
}: { variant?: "primary" | "ghost" | "outline" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles: Record<string, string> = {
    primary: "bg-brand-lime text-brand-dark hover:bg-brand-lime-dark",
    ghost: "text-white/70 hover:bg-white/8 hover:text-white",
    outline: "text-white/80 border border-white/15 hover:bg-white/8",
  };
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-[13px] text-white/50">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
