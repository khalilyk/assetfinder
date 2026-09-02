"use client";

import { useEffect, useState } from "react";
import { Card, PageHeader, Btn, Badge } from "../_ui";

type Me = { id: string; name: string; email: string; role: string };

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
};

export default function AccountPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaved, setPasswordSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d) => {
        if (d?.user) {
          setMe(d.user);
          setName(d.user.name);
        }
      })
      .catch(() => {});
  }, []);

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    setSavingName(true);
    setNameSaved(false);
    await fetch("/api/admin/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setSavingName(false);
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setChangingPassword(true);
    try {
      const res = await fetch("/api/admin/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error ?? "Something went wrong.");
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 2000);
    } catch {
      setPasswordError("Something went wrong. Please try again.");
    } finally {
      setChangingPassword(false);
    }
  }

  if (!me) {
    return <p className="p-6 text-sm text-slate-400">Loading…</p>;
  }

  return (
    <div>
      <PageHeader title="My Account" subtitle="Manage your profile and password." />

      <div className="flex max-w-xl flex-col gap-5">
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <p className="text-[13px] font-semibold text-slate-900">Profile</p>
            <Badge tone="purple">{ROLE_LABEL[me.role] ?? me.role}</Badge>
          </div>
          <form onSubmit={saveName} className="flex flex-col gap-4">
            <div>
              <label className="text-[11px] font-semibold tracking-wide text-slate-500">NAME</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold tracking-wide text-slate-500">EMAIL</label>
              <input
                disabled
                value={me.email}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-400"
              />
            </div>
            <div className="flex items-center gap-3">
              <Btn type="submit" disabled={savingName}>
                {savingName ? "Saving…" : "Save"}
              </Btn>
              {nameSaved && <span className="text-[13px] font-medium text-brand-lime-text">Saved</span>}
            </div>
          </form>
        </Card>

        <Card className="p-5">
          <p className="mb-4 text-[13px] font-semibold text-slate-900">Change Password</p>
          <form onSubmit={changePassword} className="flex flex-col gap-4">
            <div>
              <label className="text-[11px] font-semibold tracking-wide text-slate-500">CURRENT PASSWORD</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold tracking-wide text-slate-500">NEW PASSWORD</label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none"
              />
            </div>
            {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
            <div className="flex items-center gap-3">
              <Btn type="submit" disabled={changingPassword}>
                {changingPassword ? "Updating…" : "Update Password"}
              </Btn>
              {passwordSaved && <span className="text-[13px] font-medium text-brand-lime-text">Password updated</span>}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
