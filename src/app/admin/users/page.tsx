"use client";

import { useEffect, useState } from "react";
import { Card, PageHeader, Btn, Badge, Icons } from "../_ui";
import { MediaPicker } from "../_media-picker";

type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR";

type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl: string | null;
  title: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  bio: string | null;
  cardSlug: string | null;
  lastLoginAt: string | null;
};

const ROLE_LABEL: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
};

const ROLE_TONE: Record<Role, "green" | "amber" | "slate" | "blue" | "red" | "purple"> = {
  SUPER_ADMIN: "purple",
  ADMIN: "blue",
  EDITOR: "slate",
};

export default function UsersPage() {
  const [me, setMe] = useState<{ id: string; role: Role } | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<Role>("EDITOR");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdCreds, setCreatedCreds] = useState<{ email: string; password: string } | null>(null);
  const [editing, setEditing] = useState<User | null>(null);

  const load = () => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.users ?? []))
      .catch(() => setUsers([]));
  };

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d) => {
        if (d?.user) setMe(d.user);
      })
      .catch(() => {});
    load();
  }, []);

  const isSuperAdmin = me?.role === "SUPER_ADMIN";

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCreating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, email: newEmail, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setCreating(false);
        return;
      }
      setCreatedCreds({ email: data.user.email, password: data.password });
      setNewName("");
      setNewEmail("");
      setNewRole("EDITOR");
      setShowNew(false);
      load();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  async function changeRole(id: string, role: Role) {
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    load();
  }

  async function removeUser(id: string, email: string) {
    if (!confirm(`Remove ${email}? They will lose admin access immediately.`)) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    load();
  }

  async function openEditor(id: string) {
    const res = await fetch(`/api/admin/users/${id}`);
    const data = await res.json();
    if (data.user) setEditing(data.user);
  }

  return (
    <div>
      <PageHeader
        title="Users & Roles"
        subtitle="Manage who has access to the admin and what they can do."
        action={
          isSuperAdmin ? (
            <Btn onClick={() => setShowNew((v) => !v)}>
              <Icons.plus size={16} /> New User
            </Btn>
          ) : undefined
        }
      />

      {createdCreds && (
        <Card className="mb-6 border-brand-lime/30 bg-lime-50 p-5">
          <p className="text-[13px] font-semibold text-brand-lime-text">User created</p>
          <p className="mt-2 text-[13px] text-slate-600">
            Share these credentials securely — the password won&apos;t be shown again.
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-[13px]">
            <div>
              <span className="text-slate-400">Email: </span>
              <span className="font-mono text-slate-900">{createdCreds.email}</span>
            </div>
            <div>
              <span className="text-slate-400">Password: </span>
              <span className="font-mono text-slate-900">{createdCreds.password}</span>
            </div>
          </div>
          <button
            onClick={() => setCreatedCreds(null)}
            className="mt-3 text-[12px] font-semibold text-slate-400 hover:text-slate-600"
          >
            Dismiss
          </button>
        </Card>
      )}

      {showNew && isSuperAdmin && (
        <Card className="mb-6 p-5">
          <form onSubmit={createUser} className="flex flex-wrap items-end gap-3">
            <div className="min-w-[160px] flex-1">
              <label className="text-[11px] font-semibold tracking-wide text-slate-500">NAME</label>
              <input
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none"
              />
            </div>
            <div className="min-w-[200px] flex-1">
              <label className="text-[11px] font-semibold tracking-wide text-slate-500">EMAIL</label>
              <input
                required
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none"
              />
            </div>
            <div className="min-w-[140px]">
              <label className="text-[11px] font-semibold tracking-wide text-slate-500">ROLE</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as Role)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none"
              >
                <option value="EDITOR">Editor</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
            <Btn type="submit" disabled={creating}>
              {creating ? "Creating…" : "Create"}
            </Btn>
          </form>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </Card>
      )}

      <Card className="overflow-hidden">
        {users === null ? (
          <p className="p-6 text-sm text-slate-400">Loading…</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Last Login</th>
                <th className="px-5 py-3 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {u.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={u.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
                      ) : (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                          {u.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                      )}
                      <span className="font-semibold text-slate-900">
                        {u.name}
                        {u.id === me?.id && <span className="ml-2 text-[11px] font-normal text-slate-400">(you)</span>}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{u.email}</td>
                  <td className="px-5 py-3.5">
                    {isSuperAdmin ? (
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value as Role)}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[12.5px] text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none"
                      >
                        <option value="EDITOR">Editor</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                      </select>
                    ) : (
                      <Badge tone={ROLE_TONE[u.role]}>{ROLE_LABEL[u.role]}</Badge>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString("en-AU", { dateStyle: "medium" }) : "Never"}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {(isSuperAdmin || u.id === me?.id) && (
                        <button
                          onClick={() => openEditor(u.id)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                          aria-label="Edit user"
                        >
                          <Icons.edit size={15} />
                        </button>
                      )}
                      {isSuperAdmin && u.id !== me?.id && (
                        <button
                          onClick={() => removeUser(u.id, u.email)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                          aria-label="Remove user"
                        >
                          <Icons.trash size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {editing && (
        <UserEditor
          user={editing}
          canResetPassword={isSuperAdmin && editing.id !== me?.id}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function UserEditor({
  user,
  canResetPassword,
  onClose,
  onSaved,
}: {
  user: User;
  canResetPassword: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(user);
  const [saving, setSaving] = useState(false);
  const [generatingCard, setGeneratingCard] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetPassword, setResetPassword] = useState<string | null>(null);

  function set<K extends keyof User>(key: K, value: User[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    setSaving(true);
    await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        avatarUrl: form.avatarUrl ?? "",
        title: form.title ?? "",
        phone: form.phone ?? "",
        linkedinUrl: form.linkedinUrl ?? "",
        bio: form.bio ?? "",
      }),
    });
    setSaving(false);
    onSaved();
  }

  async function generateCard() {
    setGeneratingCard(true);
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ generateCardSlug: true }),
    });
    const data = await res.json();
    setGeneratingCard(false);
    if (data.user) set("cardSlug", data.user.cardSlug);
  }

  function copyCardLink() {
    if (!form.cardSlug) return;
    navigator.clipboard.writeText(`${window.location.origin}/card/${form.cardSlug}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function resetUserPassword() {
    if (!confirm(`Reset ${user.name}'s password? Their current password will stop working immediately.`)) return;
    setResetting(true);
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetPassword: true }),
    });
    const data = await res.json();
    setResetting(false);
    if (data.password) setResetPassword(data.password);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <p className="text-sm font-semibold text-slate-900">Edit {user.name}</p>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex flex-col gap-4">
            <MediaPicker label="Photo" value={form.avatarUrl ?? ""} onChange={(v) => set("avatarUrl", v)} />

            <div>
              <label className="text-[11px] font-semibold tracking-wide text-slate-500">NAME</label>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[11px] font-semibold tracking-wide text-slate-500">TITLE</label>
                <input
                  value={form.title ?? ""}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="Field Compliance Manager"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-lime focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold tracking-wide text-slate-500">PHONE</label>
                <input
                  value={form.phone ?? ""}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+61 4XX XXX XXX"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-lime focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold tracking-wide text-slate-500">LINKEDIN URL</label>
              <input
                value={form.linkedinUrl ?? ""}
                onChange={(e) => set("linkedinUrl", e.target.value)}
                placeholder="https://linkedin.com/in/…"
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-lime focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold tracking-wide text-slate-500">BIO</label>
              <textarea
                value={form.bio ?? ""}
                onChange={(e) => set("bio", e.target.value)}
                rows={3}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[13px] font-semibold text-slate-900">Digital Business Card</p>
              {form.cardSlug ? (
                <div className="mt-2.5 flex flex-col gap-2">
                  <p className="break-all rounded-lg bg-white px-3 py-2 text-[12px] text-slate-600">
                    /card/{form.cardSlug}
                  </p>
                  <div className="flex gap-2">
                    <Btn variant="outline" onClick={copyCardLink} className="flex-1 justify-center">
                      {copied ? "Copied!" : "Copy Link"}
                    </Btn>
                    <a
                      href={`/card/${form.cardSlug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Open
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mt-1 mb-3 text-[12px] text-slate-500">
                    Generate a shareable digital business card for {user.name.split(" ")[0]}.
                  </p>
                  <Btn onClick={generateCard} disabled={generatingCard} className="w-full justify-center">
                    {generatingCard ? "Generating…" : "Generate Card Link"}
                  </Btn>
                </>
              )}
            </div>

            {canResetPassword && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[13px] font-semibold text-slate-900">Password</p>
                {resetPassword ? (
                  <div className="mt-2.5">
                    <p className="text-[12px] text-slate-500">
                      Share this new password securely — it won&apos;t be shown again.
                    </p>
                    <p className="mt-2 break-all rounded-lg bg-white px-3 py-2 font-mono text-[12px] text-slate-900">
                      {resetPassword}
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="mt-1 mb-3 text-[12px] text-slate-500">
                      Set a new random password for {user.name.split(" ")[0]}. Their current password stops working
                      immediately.
                    </p>
                    <Btn variant="outline" onClick={resetUserPassword} disabled={resetting} className="w-full justify-center">
                      {resetting ? "Resetting…" : "Reset Password"}
                    </Btn>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
          <Btn variant="outline" onClick={onClose}>
            Cancel
          </Btn>
          <Btn onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
