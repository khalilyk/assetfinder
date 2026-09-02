"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icons, ACCENT } from "./_ui";

const NAV: { section: string; items: { label: string; href: string; icon: keyof typeof Icons }[] }[] = [
  {
    section: "Website",
    items: [
      { label: "Pages", href: "/admin/pages", icon: "pages" },
      { label: "Media Library", href: "/admin/media", icon: "media" },
      { label: "Clients", href: "/admin/crm", icon: "crm" },
      { label: "Analytics", href: "/admin/analytics", icon: "analytics" },
      { label: "SEO / AEO / GEO", href: "/admin/seo", icon: "seo" },
    ],
  },
  {
    section: "Admin",
    items: [
      { label: "Users & Roles", href: "/admin/users", icon: "users" },
      { label: "Settings", href: "/admin/settings", icon: "settings" },
    ],
  },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

type Me = { name: string; email: string; role: string };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [hello, setHello] = useState("Good morning");
  const [today, setToday] = useState("");
  const [me, setMe] = useState<Me>({ name: "Administrator", email: "", role: "EDITOR" });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Reads the client clock, which can't run during server render
    // without risking a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHello(greeting());
    setToday(
      new Date().toLocaleDateString("en-AU", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    );
    fetch("/api/admin/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.user) setMe(d.user);
      })
      .catch(() => {});
  }, []);

  if (pathname.startsWith("/admin/login")) return <>{children}</>;

  const firstName = me.name.split(" ")[0];
  const initials = me.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const isAdmin = me.role === "SUPER_ADMIN" || me.role === "ADMIN";
  const roleLabel =
    me.role === "SUPER_ADMIN" ? "Super Admin" : me.role === "ADMIN" ? "Admin" : "Editor";

  const logout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <div className="flex min-h-screen bg-admin-surface text-slate-800">
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed left-4 top-4 bottom-4 z-40 flex w-[220px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-brand-dark-2 shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-[130%]"
        }`}
      >
        <div className="flex items-center justify-center border-b border-white/10 px-6 py-5">
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/assetfinder-logo.png" alt="AssetFinder" width={140} height={32} className="h-6 w-auto" priority unoptimized />
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3.5 py-5" onClick={() => setMobileOpen(false)}>
          <Link
            href="/admin"
            className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition ${
              isActive("/admin") && pathname === "/admin"
                ? "text-brand-dark"
                : "text-white/60 hover:bg-white/8 hover:text-white"
            }`}
            style={isActive("/admin") && pathname === "/admin" ? { background: ACCENT } : undefined}
          >
            <Icons.dashboard size={18} /> Dashboard
          </Link>

          {NAV.filter((grp) => grp.section !== "Admin" || isAdmin).map((grp) => (
            <div key={grp.section} className="mt-6">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
                {grp.section}
              </p>
              {grp.items.map((it) => {
                const Icon = Icons[it.icon];
                const active = isActive(it.href);
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition ${
                      active ? "text-brand-dark" : "text-white/60 hover:bg-white/8 hover:text-white"
                    }`}
                    style={active ? { background: ACCENT } : undefined}
                  >
                    <Icon size={18} /> <span>{it.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="grid grid-cols-2 gap-1.5 border-t border-white/10 p-3.5" onClick={() => setMobileOpen(false)}>
          <Link
            href="/admin/account"
            className={`flex flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 text-[11.5px] font-semibold transition ${
              isActive("/admin/account") ? "text-brand-dark" : "text-white/60 hover:bg-white/8 hover:text-white"
            }`}
            style={isActive("/admin/account") ? { background: ACCENT } : undefined}
          >
            <Icons.users size={17} /> My Account
          </Link>
          <Link
            href="/"
            className="flex flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 text-[11.5px] font-semibold text-white/60 transition hover:bg-white/8 hover:text-white"
          >
            <Icons.globe size={17} /> View Website
          </Link>
          <button
            onClick={logout}
            className="col-span-2 flex flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 text-[11.5px] font-semibold text-rose-300 transition hover:bg-rose-500/15 hover:text-rose-200"
          >
            <Icons.logout size={17} /> Sign Out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 lg:ml-[236px]">
        <header className="sticky top-4 z-20 mx-4 mt-4 flex h-16 items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:mx-6 sm:px-7">
          <div className="flex min-w-0 items-center gap-2">
            <button
              onClick={() => setMobileOpen(true)}
              className="-ml-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold leading-tight text-slate-900">
                {hello}, {firstName}
              </p>
              <p className="truncate text-[11.5px] text-slate-400">{today}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-400 sm:flex">
              <Icons.search size={16} />
              <span className="text-[12.5px]">Search…</span>
            </div>
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100" aria-label="Notifications">
              <Icons.bell size={18} />
            </button>
            <div className="flex items-center gap-2.5 pl-1">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold text-brand-dark"
                style={{ background: ACCENT }}
              >
                {initials || "?"}
              </span>
              <div className="hidden leading-tight md:block">
                <p className="text-[12.5px] font-semibold text-slate-800">{me.name}</p>
                <p className="text-[10.5px] text-slate-400">{roleLabel}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-[1500px] px-4 pb-8 pt-5 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
