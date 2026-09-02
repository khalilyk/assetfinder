"use client";

import { useEffect, useState } from "react";
import { Card, PageHeader, Btn, Badge, Icons } from "../_ui";

type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR";

type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  lastLoginAt: string | null;
  createdAt: string;
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
                  <td className="px-5 py-3.5 font-semibold text-slate-900">
                    {u.name}
                    {u.id === me?.id && <span className="ml-2 text-[11px] font-normal text-slate-400">(you)</span>}
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
                    {isSuperAdmin && u.id !== me?.id && (
                      <button
                        onClick={() => removeUser(u.id, u.email)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                        aria-label="Remove user"
                      >
                        <Icons.trash size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
