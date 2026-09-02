"use client";

import { useEffect, useState } from "react";
import { Card, PageHeader, Btn } from "../_ui";

type Settings = {
  siteName: string;
  contactEmail: string;
  defaultOgImage: string;
  maintenanceMode: boolean;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d?.settings) setSettings(d.settings);
      })
      .catch(() => {});
  }, []);

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!settings) {
    return <p className="p-6 text-sm text-slate-400">Loading…</p>;
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Site-wide configuration." />

      <Card className="max-w-xl p-5">
        <form onSubmit={save} className="flex flex-col gap-4">
          <div>
            <label className="text-[11px] font-semibold tracking-wide text-slate-500">SITE NAME</label>
            <input
              value={settings.siteName}
              onChange={(e) => set("siteName", e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold tracking-wide text-slate-500">CONTACT EMAIL</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => set("contactEmail", e.target.value)}
              placeholder="hello@assetfinder.au"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-lime focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold tracking-wide text-slate-500">DEFAULT OG IMAGE URL</label>
            <input
              value={settings.defaultOgImage}
              onChange={(e) => set("defaultOgImage", e.target.value)}
              placeholder="https://…"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-lime focus:bg-white focus:outline-none"
            />
          </div>
          <label className="flex w-fit items-center gap-2 text-[13px] font-medium text-slate-600">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => set("maintenanceMode", e.target.checked)}
              className="h-4 w-4 accent-brand-lime"
            />
            Maintenance mode
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center gap-3">
            <Btn type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Btn>
            {saved && <span className="text-[13px] font-medium text-brand-lime-text">Saved</span>}
          </div>
        </form>
      </Card>
    </div>
  );
}
