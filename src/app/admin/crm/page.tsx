"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, PageHeader, Btn, Badge, Icons } from "../_ui";

type Status = "LEAD" | "QUALIFIED" | "DEMO_BOOKED" | "CUSTOMER" | "CHURNED" | "ARCHIVED";

type Contact = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  status: Status;
  updatedAt: string;
};

const STATUS_TONE: Record<Status, "green" | "amber" | "slate" | "blue" | "red" | "purple"> = {
  LEAD: "slate",
  QUALIFIED: "blue",
  DEMO_BOOKED: "purple",
  CUSTOMER: "green",
  CHURNED: "red",
  ARCHIVED: "slate",
};

const STATUS_LABEL: Record<Status, string> = {
  LEAD: "Lead",
  QUALIFIED: "Qualified",
  DEMO_BOOKED: "Demo Booked",
  CUSTOMER: "Customer",
  CHURNED: "Churned",
  ARCHIVED: "Archived",
};

const FILTERS: (Status | "ALL")[] = ["ALL", "LEAD", "QUALIFIED", "DEMO_BOOKED", "CUSTOMER", "CHURNED", "ARCHIVED"];

export default function CrmListPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [filter, setFilter] = useState<Status | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    fetch("/api/admin/crm")
      .then((r) => r.json())
      .then((d) => setContacts(d.contacts ?? []))
      .catch(() => setContacts([]));
  };

  useEffect(load, []);

  async function createContact(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCreating(true);
    try {
      const res = await fetch("/api/admin/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, company: newCompany, email: newEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setCreating(false);
        return;
      }
      router.push(`/admin/crm/${data.contact.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setCreating(false);
    }
  }

  const filtered = (contacts ?? [])
    .filter((c) => filter === "ALL" || c.status === filter)
    .filter((c) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.company ?? "").toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q)
      );
    });

  return (
    <div>
      <PageHeader
        title="CRM"
        subtitle="Track leads, demos, and customers through the pipeline."
        action={
          <Btn onClick={() => setShowNew((v) => !v)}>
            <Icons.plus size={16} /> New Contact
          </Btn>
        }
      />

      {showNew && (
        <Card className="mb-6 p-5">
          <form onSubmit={createContact} className="flex flex-wrap items-end gap-3">
            <div className="min-w-[180px] flex-1">
              <label className="text-[11px] font-semibold tracking-wide text-white/50">NAME</label>
              <input
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-white/10 bg-brand-dark px-3 py-2.5 text-sm text-white focus:border-brand-lime focus:outline-none"
              />
            </div>
            <div className="min-w-[180px] flex-1">
              <label className="text-[11px] font-semibold tracking-wide text-white/50">COMPANY</label>
              <input
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-white/10 bg-brand-dark px-3 py-2.5 text-sm text-white focus:border-brand-lime focus:outline-none"
              />
            </div>
            <div className="min-w-[180px] flex-1">
              <label className="text-[11px] font-semibold tracking-wide text-white/50">EMAIL</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-white/10 bg-brand-dark px-3 py-2.5 text-sm text-white focus:border-brand-lime focus:outline-none"
              />
            </div>
            <Btn type="submit" disabled={creating}>
              {creating ? "Creating…" : "Create"}
            </Btn>
          </form>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </Card>
      )}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
                filter === f ? "bg-brand-lime text-brand-dark" : "text-white/50 hover:bg-white/8 hover:text-white"
              }`}
            >
              {f === "ALL" ? "All" : STATUS_LABEL[f]}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contacts…"
          className="w-56 rounded-lg border border-white/10 bg-brand-dark-2 px-3 py-2 text-[13px] text-white placeholder:text-white/30 focus:border-brand-lime focus:outline-none"
        />
      </div>

      <Card className="overflow-hidden">
        {contacts === null ? (
          <p className="p-6 text-sm text-white/40">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-white/40">
            {contacts.length === 0 ? "No contacts yet. Add one to get started." : "No contacts match this filter."}
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-wide text-white/40">
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Company</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/crm/${c.id}`} className="font-semibold text-white hover:text-brand-lime">
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-white/60">{c.company ?? "—"}</td>
                  <td className="px-5 py-3.5 text-white/60">{c.email ?? "—"}</td>
                  <td className="px-5 py-3.5">
                    <Badge tone={STATUS_TONE[c.status]}>{STATUS_LABEL[c.status]}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-white/40">
                    {new Date(c.updatedAt).toLocaleDateString("en-AU", { dateStyle: "medium" })}
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
