"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, PageHeader, Btn, Icons } from "../../_ui";

type Status = "LEAD" | "QUALIFIED" | "DEMO_BOOKED" | "CUSTOMER" | "CHURNED" | "ARCHIVED";
type ActivityType = "note" | "call" | "email" | "meeting" | "status_change";

type Activity = { id: string; type: ActivityType; content: string | null; createdAt: string };

type Contact = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  status: Status;
  source: string | null;
  notes: string | null;
  tags: string[];
  createdAt: string;
  activities: Activity[];
};

const STATUSES: Status[] = ["LEAD", "QUALIFIED", "DEMO_BOOKED", "CUSTOMER", "CHURNED", "ARCHIVED"];
const STATUS_LABEL: Record<Status, string> = {
  LEAD: "Lead",
  QUALIFIED: "Qualified",
  DEMO_BOOKED: "Demo Booked",
  CUSTOMER: "Customer",
  CHURNED: "Churned",
  ARCHIVED: "Archived",
};

const ACTIVITY_LABEL: Record<ActivityType, string> = {
  note: "Note",
  call: "Call",
  email: "Email",
  meeting: "Meeting",
  status_change: "Status change",
};

export default function ContactDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [activityType, setActivityType] = useState<Exclude<ActivityType, "status_change">>("note");
  const [activityContent, setActivityContent] = useState("");
  const [addingActivity, setAddingActivity] = useState(false);

  const load = () => {
    fetch(`/api/admin/crm/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.contact) setContact(d.contact);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  function set<K extends keyof Contact>(key: K, value: Contact[K]) {
    setContact((c) => (c ? { ...c, [key]: value } : c));
  }

  async function save(partial?: Partial<Contact>) {
    if (!contact) return;
    setSaving(true);
    setSaved(false);
    const body = partial ?? {
      name: contact.name,
      company: contact.company,
      email: contact.email,
      phone: contact.phone,
      role: contact.role,
      source: contact.source,
      notes: contact.notes,
      tags: contact.tags,
    };
    const res = await fetch(`/api/admin/crm/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setSaving(false);
    if (data.contact) {
      setContact((c) => (c ? { ...c, ...data.contact } : c));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      load();
    }
  }

  async function changeStatus(status: Status) {
    await save({ status } as Partial<Contact>);
  }

  function addTag() {
    const tag = tagInput.trim();
    if (!tag || !contact) return;
    setContact({ ...contact, tags: [...contact.tags, tag] });
    setTagInput("");
  }

  function removeTag(tag: string) {
    if (!contact) return;
    setContact({ ...contact, tags: contact.tags.filter((t) => t !== tag) });
  }

  async function deleteContact() {
    if (!confirm("Delete this contact? This cannot be undone.")) return;
    await fetch(`/api/admin/crm/${id}`, { method: "DELETE" });
    router.push("/admin/crm");
  }

  async function addActivity(e: React.FormEvent) {
    e.preventDefault();
    if (!activityContent.trim()) return;
    setAddingActivity(true);
    await fetch(`/api/admin/crm/${id}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: activityType, content: activityContent }),
    });
    setActivityContent("");
    setAddingActivity(false);
    load();
  }

  if (loading || !contact) {
    return <p className="p-6 text-sm text-slate-400">Loading…</p>;
  }

  return (
    <div>
      <PageHeader
        title={contact.name}
        subtitle={contact.company ?? undefined}
        action={
          <div className="flex items-center gap-2">
            {saved && <span className="text-[13px] font-medium text-brand-lime-text">Saved</span>}
            <Btn variant="outline" onClick={deleteContact}>
              <Icons.trash size={15} /> Delete
            </Btn>
            <Btn onClick={() => save()} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Btn>
          </div>
        }
      />

      <Link href="/admin/crm" className="mb-5 inline-block text-[13px] text-slate-400 hover:text-slate-600">
        ← Back to CRM
      </Link>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <Card className="p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Name" value={contact.name} onChange={(v) => set("name", v)} />
              <Field label="Company" value={contact.company ?? ""} onChange={(v) => set("company", v)} />
              <Field label="Email" value={contact.email ?? ""} onChange={(v) => set("email", v)} />
              <Field label="Phone" value={contact.phone ?? ""} onChange={(v) => set("phone", v)} />
              <Field label="Role" value={contact.role ?? ""} onChange={(v) => set("role", v)} />
              <Field label="Source" value={contact.source ?? ""} onChange={(v) => set("source", v)} />
            </div>

            <div className="mt-4">
              <label className="text-[11px] font-semibold tracking-wide text-slate-500">TAGS</label>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                {contact.tags.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                  >
                    {t}
                    <button onClick={() => removeTag(t)} className="text-slate-400 hover:text-rose-500">
                      ✕
                    </button>
                  </span>
                ))}
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add tag…"
                  className="w-24 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-900 placeholder:text-slate-400 focus:border-brand-lime focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-[11px] font-semibold tracking-wide text-slate-500">NOTES</label>
              <textarea
                value={contact.notes ?? ""}
                onChange={(e) => set("notes", e.target.value)}
                rows={4}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none"
              />
            </div>
          </Card>

          <Card className="p-5">
            <p className="mb-4 text-[13px] font-semibold text-slate-900">Activity</p>
            <form onSubmit={addActivity} className="mb-5 flex flex-col gap-2">
              <div className="flex gap-2">
                {(["note", "call", "email", "meeting"] as const).map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setActivityType(t)}
                    className={`rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition ${
                      activityType === t ? "bg-brand-lime text-brand-dark" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {ACTIVITY_LABEL[t]}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={activityContent}
                  onChange={(e) => setActivityContent(e.target.value)}
                  placeholder="Log a note, call, email, or meeting…"
                  className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-lime focus:bg-white focus:outline-none"
                />
                <Btn type="submit" disabled={addingActivity}>
                  Add
                </Btn>
              </div>
            </form>

            {contact.activities.length === 0 ? (
              <p className="text-sm text-slate-400">No activity logged yet.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {contact.activities.map((a) => (
                  <li key={a.id} className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-lime" />
                    <div className="min-w-0">
                      <p className="text-[13px] text-slate-700">
                        <span className="font-semibold">{ACTIVITY_LABEL[a.type]}</span>
                        {a.content ? ` — ${a.content}` : ""}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(a.createdAt).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <Card className="h-fit p-5">
          <p className="mb-3 text-[13px] font-semibold text-slate-900">Pipeline Status</p>
          <div className="flex flex-col gap-1.5">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => changeStatus(s)}
                className={`rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition ${
                  contact.status === s ? "bg-brand-lime text-brand-dark" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {STATUS_LABEL[s]}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[11px] font-semibold tracking-wide text-slate-500">{label.toUpperCase()}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none"
      />
    </div>
  );
}
