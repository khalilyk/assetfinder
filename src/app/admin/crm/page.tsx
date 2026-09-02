"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, PageHeader, Btn, Badge, Icons } from "../_ui";

type Status = "LEAD" | "QUALIFIED" | "DEMO_BOOKED" | "CUSTOMER" | "CHURNED" | "ARCHIVED";
type View = "clients" | "pipeline";

type Contact = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  status: Status;
  createdAt: string;
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
  const [view, setView] = useState<View>("clients");
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
        body: JSON.stringify({
          name: newName,
          company: newCompany,
          email: newEmail,
          status: view === "clients" ? "CUSTOMER" : "LEAD",
        }),
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

  const baseList = view === "clients" ? (contacts ?? []).filter((c) => c.status === "CUSTOMER") : (contacts ?? []);

  const filtered = baseList
    .filter((c) => view === "clients" || filter === "ALL" || c.status === filter)
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
        title={view === "clients" ? "Clients" : "CRM Pipeline"}
        subtitle={
          view === "clients"
            ? "Current customers using AssetFinder."
            : "Track leads, demos, and customers through the pipeline."
        }
        action={
          <Btn onClick={() => setShowNew((v) => !v)}>
            <Icons.plus size={16} /> {view === "clients" ? "New Client" : "New Contact"}
          </Btn>
        }
      />

      <div className="mb-5 flex gap-1 border-b border-slate-200">
        {(["clients", "pipeline"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2.5 text-[13px] font-semibold transition ${
              view === v ? "border-b-2 border-brand-lime text-slate-900" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {v === "clients" ? "Clients" : "Pipeline"}
          </button>
        ))}
      </div>

      {showNew && (
        <Card className="mb-6 p-5">
          <form onSubmit={createContact} className="flex flex-wrap items-end gap-3">
            <div className="min-w-[180px] flex-1">
              <label className="text-[11px] font-semibold tracking-wide text-slate-500">NAME</label>
              <input
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none"
              />
            </div>
            <div className="min-w-[180px] flex-1">
              <label className="text-[11px] font-semibold tracking-wide text-slate-500">COMPANY</label>
              <input
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none"
              />
            </div>
            <div className="min-w-[180px] flex-1">
              <label className="text-[11px] font-semibold tracking-wide text-slate-500">EMAIL</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none"
              />
            </div>
            <Btn type="submit" disabled={creating}>
              {creating ? "Creating…" : "Create"}
            </Btn>
          </form>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </Card>
      )}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        {view === "pipeline" ? (
          <div className="flex flex-wrap gap-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
                  filter === f ? "bg-brand-lime text-brand-dark" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {f === "ALL" ? "All" : STATUS_LABEL[f]}
              </button>
            ))}
          </div>
        ) : (
          <div />
        )}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={view === "clients" ? "Search clients…" : "Search contacts…"}
          className="w-56 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-brand-lime focus:outline-none"
        />
      </div>

      <Card className="overflow-hidden">
        {contacts === null ? (
          <p className="p-6 text-sm text-slate-400">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-slate-400">
            {baseList.length === 0
              ? view === "clients"
                ? "No clients yet. Contacts move here once marked Customer."
                : "No contacts yet. Add one to get started."
              : "No results match this filter."}
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Company</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                {view === "pipeline" && <th className="px-5 py-3 font-semibold">Status</th>}
                <th className="px-5 py-3 font-semibold">{view === "clients" ? "Client Since" : "Updated"}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/crm/${c.id}`} className="font-semibold text-slate-900 hover:text-brand-lime-text">
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{c.company ?? "—"}</td>
                  <td className="px-5 py-3.5 text-slate-500">{c.email ?? "—"}</td>
                  {view === "pipeline" && (
                    <td className="px-5 py-3.5">
                      <Badge tone={STATUS_TONE[c.status]}>{STATUS_LABEL[c.status]}</Badge>
                    </td>
                  )}
                  <td className="px-5 py-3.5 text-slate-400">
                    {new Date(view === "clients" ? c.createdAt : c.updatedAt).toLocaleDateString("en-AU", {
                      dateStyle: "medium",
                    })}
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
