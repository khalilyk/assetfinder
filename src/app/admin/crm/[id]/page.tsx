"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, PageHeader, Btn, Icons, Badge } from "../../_ui";

type Status = "LEAD" | "QUALIFIED" | "DEMO_BOOKED" | "CUSTOMER" | "CHURNED" | "ARCHIVED";
type ActivityType = "note" | "call" | "email" | "meeting" | "status_change";

type Activity = { id: string; type: ActivityType; content: string | null; createdAt: string };
type AssetStatus = "COMPLIANT" | "DUE_SOON" | "OVERDUE" | "UNKNOWN";
type Asset = {
  id: string;
  barcode: string;
  name: string;
  type: string;
  location: string | null;
  status: AssetStatus;
  lastInspectedAt: string | null;
};

type ScanLog = {
  id: string;
  barcode: string;
  found: boolean;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  createdAt: string;
  asset: { name: string; barcode: string } | null;
};

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
  portalSlug: string | null;
  createdAt: string;
  activities: Activity[];
  assets: Asset[];
  scanLogs: ScanLog[];
};

const ASSET_STATUS_LABEL: Record<AssetStatus, string> = {
  COMPLIANT: "Compliant",
  DUE_SOON: "Due Soon",
  OVERDUE: "Overdue",
  UNKNOWN: "Unknown",
};

const ASSET_STATUS_TONE: Record<AssetStatus, "green" | "amber" | "red" | "slate"> = {
  COMPLIANT: "green",
  DUE_SOON: "amber",
  OVERDUE: "red",
  UNKNOWN: "slate",
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

  const [generatingSlug, setGeneratingSlug] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [showNewAsset, setShowNewAsset] = useState(false);
  const [newBarcode, setNewBarcode] = useState("");
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetType, setNewAssetType] = useState("");
  const [newAssetLocation, setNewAssetLocation] = useState("");
  const [addingAsset, setAddingAsset] = useState(false);
  const [assetError, setAssetError] = useState<string | null>(null);

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

  async function generatePortalLink() {
    setGeneratingSlug(true);
    const res = await fetch(`/api/admin/crm/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ generatePortalSlug: true }),
    });
    const data = await res.json();
    setGeneratingSlug(false);
    if (data.contact) setContact((c) => (c ? { ...c, portalSlug: data.contact.portalSlug } : c));
  }

  function copyPortalLink() {
    if (!contact?.portalSlug) return;
    const url = `${window.location.origin}/scan/${contact.portalSlug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  }

  async function addAsset(e: React.FormEvent) {
    e.preventDefault();
    setAssetError(null);
    setAddingAsset(true);
    try {
      const res = await fetch(`/api/admin/crm/${id}/assets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode: newBarcode, name: newAssetName, type: newAssetType, location: newAssetLocation }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAssetError(data.error ?? "Something went wrong.");
        return;
      }
      setNewBarcode("");
      setNewAssetName("");
      setNewAssetType("");
      setNewAssetLocation("");
      setShowNewAsset(false);
      load();
    } finally {
      setAddingAsset(false);
    }
  }

  async function markInspected(assetId: string) {
    await fetch(`/api/admin/assets/${assetId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "inspection", label: "Inspection completed" }),
    });
    load();
  }

  async function deleteAsset(assetId: string) {
    if (!confirm("Remove this asset? This cannot be undone.")) return;
    await fetch(`/api/admin/assets/${assetId}`, { method: "DELETE" });
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

          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[13px] font-semibold text-slate-900">Assets</p>
              <Btn variant="outline" onClick={() => setShowNewAsset((v) => !v)}>
                <Icons.plus size={14} /> Add Asset
              </Btn>
            </div>

            {showNewAsset && (
              <form onSubmit={addAsset} className="mb-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    required
                    value={newBarcode}
                    onChange={(e) => setNewBarcode(e.target.value)}
                    placeholder="Barcode (e.g. AF-2048)"
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-lime focus:outline-none"
                  />
                  <input
                    required
                    value={newAssetName}
                    onChange={(e) => setNewAssetName(e.target.value)}
                    placeholder="Name (e.g. Sprinkler Control Valve)"
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-lime focus:outline-none"
                  />
                  <input
                    required
                    value={newAssetType}
                    onChange={(e) => setNewAssetType(e.target.value)}
                    placeholder="Type (e.g. Fire Control Valve)"
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-lime focus:outline-none"
                  />
                  <input
                    value={newAssetLocation}
                    onChange={(e) => setNewAssetLocation(e.target.value)}
                    placeholder="Location (e.g. Level 2, Plant Room 3)"
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-lime focus:outline-none"
                  />
                </div>
                {assetError && <p className="text-sm text-red-600">{assetError}</p>}
                <Btn type="submit" disabled={addingAsset} className="w-fit">
                  {addingAsset ? "Adding…" : "Add Asset"}
                </Btn>
              </form>
            )}

            {contact.assets.length === 0 ? (
              <p className="text-sm text-slate-400">No assets tracked for this client yet.</p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {contact.assets.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-slate-900">{a.name}</p>
                      <p className="truncate text-[11px] text-slate-400">
                        {a.barcode} · {a.type}
                        {a.location ? ` · ${a.location}` : ""}
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <Badge tone={ASSET_STATUS_TONE[a.status]}>{ASSET_STATUS_LABEL[a.status]}</Badge>
                      <button
                        onClick={() => markInspected(a.id)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Mark inspected today"
                        title="Mark inspected today"
                      >
                        <Icons.check size={14} />
                      </button>
                      <button
                        onClick={() => deleteAsset(a.id)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                        aria-label="Remove asset"
                      >
                        <Icons.trash size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-5">
            <p className="mb-4 text-[13px] font-semibold text-slate-900">Scan Log</p>
            {contact.scanLogs.length === 0 ? (
              <p className="text-sm text-slate-400">No portal scans recorded yet.</p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {contact.scanLogs.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-slate-900">
                        {s.asset?.name ?? s.barcode}
                      </p>
                      <p className="truncate text-[11px] text-slate-400">
                        {new Date(s.createdAt).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })}
                        {s.latitude != null && s.longitude != null && (
                          <>
                            {" · "}
                            <a
                              href={`https://www.google.com/maps?q=${s.latitude},${s.longitude}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-brand-lime-text hover:underline"
                            >
                              View location
                            </a>
                          </>
                        )}
                      </p>
                    </div>
                    <Badge tone={s.found ? "green" : "red"}>{s.found ? "Found" : "Not found"}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-5">
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

          <Card className="h-fit p-5">
            <p className="mb-3 text-[13px] font-semibold text-slate-900">Asset Search Portal</p>
            {contact.portalSlug ? (
              <div className="flex flex-col gap-2.5">
                <p className="break-all rounded-lg bg-slate-50 px-3 py-2 text-[12px] text-slate-600">
                  /scan/{contact.portalSlug}
                </p>
                <div className="flex gap-2">
                  <Btn variant="outline" onClick={copyPortalLink} className="flex-1 justify-center">
                    {copiedLink ? "Copied!" : "Copy Link"}
                  </Btn>
                  <a
                    href={`/scan/${contact.portalSlug}`}
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
                <p className="mb-3 text-[13px] text-slate-500">
                  Generate a branded barcode-search page this client can use to look up their own assets.
                </p>
                <Btn onClick={generatePortalLink} disabled={generatingSlug} className="w-full justify-center">
                  {generatingSlug ? "Generating…" : "Generate Portal Link"}
                </Btn>
              </>
            )}
          </Card>
        </div>
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
