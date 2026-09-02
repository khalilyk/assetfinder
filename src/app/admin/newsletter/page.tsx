"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, PageHeader, Btn, Badge, Icons } from "../_ui";
import { EMAIL_TEMPLATES } from "@/lib/email-templates";

type View = "campaigns" | "subscribers";
type CampaignStatus = "DRAFT" | "SCHEDULED" | "SENDING" | "SENT";

type Campaign = {
  id: string;
  name: string;
  subject: string;
  status: CampaignStatus;
  scheduledAt: string | null;
  sentAt: string | null;
  recipientCount: number | null;
  openCount: number;
  clickCount: number;
  updatedAt: string;
};

type Subscriber = {
  id: string;
  email: string;
  name: string | null;
  status: "SUBSCRIBED" | "UNSUBSCRIBED";
  source: string | null;
  createdAt: string;
};

const STATUS_TONE: Record<CampaignStatus, "slate" | "blue" | "amber" | "green"> = {
  DRAFT: "slate",
  SCHEDULED: "blue",
  SENDING: "amber",
  SENT: "green",
};

export default function NewsletterPage() {
  const router = useRouter();
  const [view, setView] = useState<View>("campaigns");
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[] | null>(null);

  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTemplate, setNewTemplate] = useState(EMAIL_TEMPLATES[1].key);
  const [creating, setCreating] = useState(false);

  const [showNewSub, setShowNewSub] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [addingSub, setAddingSub] = useState(false);
  const [subError, setSubError] = useState<string | null>(null);

  const loadCampaigns = () => {
    fetch("/api/admin/newsletter/campaigns")
      .then((r) => r.json())
      .then((d) => setCampaigns(d.campaigns ?? []))
      .catch(() => setCampaigns([]));
  };

  const loadSubscribers = () => {
    fetch("/api/admin/newsletter/subscribers")
      .then((r) => r.json())
      .then((d) => setSubscribers(d.subscribers ?? []))
      .catch(() => setSubscribers([]));
  };

  useEffect(() => {
    loadCampaigns();
    loadSubscribers();
  }, []);

  async function createCampaign(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/admin/newsletter/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, template: newTemplate }),
      });
      const data = await res.json();
      if (res.ok) router.push(`/admin/newsletter/${data.campaign.id}`);
    } finally {
      setCreating(false);
    }
  }

  async function deleteCampaign(id: string) {
    if (!confirm("Delete this campaign? This cannot be undone.")) return;
    await fetch(`/api/admin/newsletter/campaigns/${id}`, { method: "DELETE" });
    loadCampaigns();
  }

  async function addSubscriber(e: React.FormEvent) {
    e.preventDefault();
    setSubError(null);
    setAddingSub(true);
    try {
      const res = await fetch("/api/admin/newsletter/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubError(data.error ?? "Something went wrong.");
        return;
      }
      setNewEmail("");
      setShowNewSub(false);
      loadSubscribers();
    } finally {
      setAddingSub(false);
    }
  }

  async function removeSubscriber(id: string) {
    if (!confirm("Remove this subscriber?")) return;
    await fetch(`/api/admin/newsletter/subscribers/${id}`, { method: "DELETE" });
    loadSubscribers();
  }

  const subscribedCount = (subscribers ?? []).filter((s) => s.status === "SUBSCRIBED").length;

  return (
    <div>
      <PageHeader
        title="Newsletter"
        subtitle="Compose, send, and track email campaigns."
        action={
          view === "campaigns" ? (
            <Btn onClick={() => setShowNewCampaign((v) => !v)}>
              <Icons.plus size={16} /> New Campaign
            </Btn>
          ) : (
            <Btn onClick={() => setShowNewSub((v) => !v)}>
              <Icons.plus size={16} /> Add Subscriber
            </Btn>
          )
        }
      />

      <div className="mb-5 flex gap-1 border-b border-slate-200">
        {(["campaigns", "subscribers"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2.5 text-[13px] font-semibold transition ${
              view === v ? "border-b-2 border-brand-lime text-slate-900" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {v === "campaigns" ? "Campaigns" : `Subscribers (${subscribedCount})`}
          </button>
        ))}
      </div>

      {view === "campaigns" && (
        <>
          {showNewCampaign && (
            <Card className="mb-6 p-5">
              <form onSubmit={createCampaign} className="flex flex-wrap items-end gap-3">
                <div className="min-w-[200px] flex-1">
                  <label className="text-[11px] font-semibold tracking-wide text-slate-500">CAMPAIGN NAME</label>
                  <input
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="September product update"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-lime focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="min-w-[220px]">
                  <label className="text-[11px] font-semibold tracking-wide text-slate-500">TEMPLATE</label>
                  <select
                    value={newTemplate}
                    onChange={(e) => setNewTemplate(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none"
                  >
                    {EMAIL_TEMPLATES.map((t) => (
                      <option key={t.key} value={t.key}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Btn type="submit" disabled={creating}>
                  {creating ? "Creating…" : "Create"}
                </Btn>
              </form>
              <p className="mt-2 text-[12px] text-slate-400">
                {EMAIL_TEMPLATES.find((t) => t.key === newTemplate)?.description}
              </p>
            </Card>
          )}

          <Card className="overflow-hidden">
            {campaigns === null ? (
              <p className="p-6 text-sm text-slate-400">Loading…</p>
            ) : campaigns.length === 0 ? (
              <p className="p-6 text-sm text-slate-400">No campaigns yet. Create one to get started.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="px-5 py-3 font-semibold">Name</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Recipients</th>
                    <th className="px-5 py-3 font-semibold">Updated</th>
                    <th className="px-5 py-3 font-semibold" />
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => (
                    <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="px-5 py-3.5">
                        <Link href={`/admin/newsletter/${c.id}`} className="font-semibold text-slate-900 hover:text-brand-lime-text">
                          {c.name}
                        </Link>
                        <p className="truncate text-[11px] text-slate-400">{c.subject}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge tone={STATUS_TONE[c.status]}>{c.status}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">{c.recipientCount ?? "—"}</td>
                      <td className="px-5 py-3.5 text-slate-400">
                        {new Date(c.updatedAt).toLocaleDateString("en-AU", { dateStyle: "medium" })}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {c.status !== "SENT" && (
                          <button
                            onClick={() => deleteCampaign(c.id)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                            aria-label="Delete campaign"
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
        </>
      )}

      {view === "subscribers" && (
        <>
          {showNewSub && (
            <Card className="mb-6 p-5">
              <form onSubmit={addSubscriber} className="flex flex-wrap items-end gap-3">
                <div className="min-w-[240px] flex-1">
                  <label className="text-[11px] font-semibold tracking-wide text-slate-500">EMAIL</label>
                  <input
                    required
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none"
                  />
                </div>
                <Btn type="submit" disabled={addingSub}>
                  {addingSub ? "Adding…" : "Add"}
                </Btn>
              </form>
              {subError && <p className="mt-3 text-sm text-red-600">{subError}</p>}
            </Card>
          )}

          <Card className="overflow-hidden">
            {subscribers === null ? (
              <p className="p-6 text-sm text-slate-400">Loading…</p>
            ) : subscribers.length === 0 ? (
              <p className="p-6 text-sm text-slate-400">No subscribers yet.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="px-5 py-3 font-semibold">Email</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Source</th>
                    <th className="px-5 py-3 font-semibold">Joined</th>
                    <th className="px-5 py-3 font-semibold" />
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((s) => (
                    <tr key={s.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="px-5 py-3.5 font-semibold text-slate-900">{s.email}</td>
                      <td className="px-5 py-3.5">
                        <Badge tone={s.status === "SUBSCRIBED" ? "green" : "slate"}>
                          {s.status === "SUBSCRIBED" ? "Subscribed" : "Unsubscribed"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">{s.source ?? "—"}</td>
                      <td className="px-5 py-3.5 text-slate-400">
                        {new Date(s.createdAt).toLocaleDateString("en-AU", { dateStyle: "medium" })}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => removeSubscriber(s.id)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                          aria-label="Remove subscriber"
                        >
                          <Icons.trash size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
