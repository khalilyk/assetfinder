"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, PageHeader, Btn, Icons, Badge } from "../../_ui";
import { BLOCK_LABELS, BLOCK_FIELDS, blockSummary, renderEmailHtml, type BlockType, type EmailBlock } from "@/lib/email-blocks";

type CampaignStatus = "DRAFT" | "SCHEDULED" | "SENDING" | "SENT";

type Campaign = {
  id: string;
  name: string;
  subject: string;
  previewText: string | null;
  fromName: string;
  fromEmail: string;
  blocks: EmailBlock[];
  status: CampaignStatus;
  scheduledAt: string | null;
  sentAt: string | null;
  recipientCount: number | null;
  openCount: number;
  clickCount: number;
};

const BLOCK_TYPES: BlockType[] = ["heading", "text", "image", "hero", "button", "buttons", "cta", "band", "columns", "divider", "spacer", "social"];

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

function defaultFields(type: BlockType): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const f of BLOCK_FIELDS[type]) fields[f.key] = "";
  if (type === "heading" || type === "button") fields.align = "left";
  if (type === "spacer") fields.height = "24";
  if (type === "band") fields.bgColor = "#c8e600";
  return fields;
}

export default function CampaignEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [testEmail, setTestEmail] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [testMessage, setTestMessage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState("");

  const load = () => {
    fetch(`/api/admin/newsletter/campaigns/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.campaign) {
          setCampaign(d.campaign);
          setScheduleDate(d.campaign.scheduledAt ? d.campaign.scheduledAt.slice(0, 16) : "");
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const readOnly = campaign?.status === "SENT";

  function set<K extends keyof Campaign>(key: K, value: Campaign[K]) {
    setCampaign((c) => (c ? { ...c, [key]: value } : c));
  }

  function addBlock(type: BlockType) {
    if (!campaign) return;
    const block: EmailBlock = { id: newId(), type, fields: defaultFields(type) };
    set("blocks", [...campaign.blocks, block]);
    setExpanded(block.id);
  }

  function updateBlockField(blockId: string, key: string, value: string) {
    if (!campaign) return;
    set(
      "blocks",
      campaign.blocks.map((b) => (b.id === blockId ? { ...b, fields: { ...b.fields, [key]: value } } : b)),
    );
  }

  function removeBlock(blockId: string) {
    if (!campaign) return;
    set("blocks", campaign.blocks.filter((b) => b.id !== blockId));
  }

  function moveBlock(index: number, dir: -1 | 1) {
    if (!campaign) return;
    const next = [...campaign.blocks];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    set("blocks", next);
  }

  async function save() {
    if (!campaign) return;
    setSaving(true);
    await fetch(`/api/admin/newsletter/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: campaign.name,
        subject: campaign.subject,
        previewText: campaign.previewText,
        fromName: campaign.fromName,
        fromEmail: campaign.fromEmail,
        blocks: campaign.blocks,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function deleteCampaign() {
    if (!confirm("Delete this campaign? This cannot be undone.")) return;
    await fetch(`/api/admin/newsletter/campaigns/${id}`, { method: "DELETE" });
    router.push("/admin/newsletter");
  }

  async function sendTest() {
    if (!testEmail.trim()) return;
    await save();
    setSendingTest(true);
    setTestMessage(null);
    try {
      const res = await fetch(`/api/admin/newsletter/campaigns/${id}/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail }),
      });
      const data = await res.json();
      setTestMessage(res.ok ? `Test sent to ${testEmail}.` : data.error);
    } finally {
      setSendingTest(false);
    }
  }

  async function sendNow() {
    if (!confirm(`Send "${campaign?.name}" to all subscribed recipients now? This can't be undone.`)) return;
    await save();
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch(`/api/admin/newsletter/campaigns/${id}/send`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setSendError(data.error ?? "Something went wrong.");
        return;
      }
      load();
    } finally {
      setSending(false);
    }
  }

  async function saveSchedule() {
    await fetch(`/api/admin/newsletter/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduledAt: scheduleDate ? new Date(scheduleDate).toISOString() : null }),
    });
    load();
  }

  const previewHtml = useMemo(() => {
    if (!campaign) return "";
    return renderEmailHtml({
      blocks: campaign.blocks,
      previewText: campaign.previewText ?? undefined,
      origin: typeof window !== "undefined" ? window.location.origin : "",
    });
  }, [campaign]);

  if (loading || !campaign) {
    return <p className="p-6 text-sm text-slate-400">Loading…</p>;
  }

  return (
    <div>
      <PageHeader
        title={campaign.name}
        subtitle={
          <span className="flex items-center gap-2">
            <Badge
              tone={
                campaign.status === "SENT" ? "green" : campaign.status === "SCHEDULED" ? "blue" : campaign.status === "SENDING" ? "amber" : "slate"
              }
            >
              {campaign.status}
            </Badge>
            {campaign.status === "SENT" && campaign.recipientCount != null && <span>{campaign.recipientCount} recipients</span>}
          </span>
        }
        action={
          <div className="flex items-center gap-2">
            {saved && <span className="text-[13px] font-medium text-brand-lime-text">Saved</span>}
            {!readOnly && (
              <Btn variant="outline" onClick={deleteCampaign}>
                <Icons.trash size={15} /> Delete
              </Btn>
            )}
            {!readOnly && (
              <Btn onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Btn>
            )}
          </div>
        }
      />

      <Link href="/admin/newsletter" className="mb-5 inline-block text-[13px] text-slate-400 hover:text-slate-600">
        ← Back to Newsletter
      </Link>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <Card className="p-5">
            <div className="grid grid-cols-1 gap-4">
              <Field label="Campaign Name" value={campaign.name} onChange={(v) => set("name", v)} disabled={readOnly} />
              <Field label="Subject Line" value={campaign.subject} onChange={(v) => set("subject", v)} disabled={readOnly} />
              <Field
                label="Preview Text"
                value={campaign.previewText ?? ""}
                onChange={(v) => set("previewText", v)}
                disabled={readOnly}
              />
              <div className="grid grid-cols-2 gap-4">
                <Field label="From Name" value={campaign.fromName} onChange={(v) => set("fromName", v)} disabled={readOnly} />
                <Field label="From Email" value={campaign.fromEmail} onChange={(v) => set("fromEmail", v)} disabled={readOnly} />
              </div>
            </div>
          </Card>

          {!readOnly && (
            <Card className="p-5">
              <p className="mb-3 text-[13px] font-semibold text-slate-900">Add a block</p>
              <div className="flex flex-wrap gap-1.5">
                {BLOCK_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => addBlock(type)}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-[12px] font-semibold text-slate-600 transition hover:border-brand-lime hover:text-slate-900"
                  >
                    + {BLOCK_LABELS[type]}
                  </button>
                ))}
              </div>
            </Card>
          )}

          <div className="flex flex-col gap-3">
            {campaign.blocks.length === 0 ? (
              <Card className="p-8 text-center text-sm text-slate-400">No blocks yet. Add one above to start building.</Card>
            ) : (
              campaign.blocks.map((block, i) => (
                <Card key={block.id} className="overflow-hidden">
                  <button
                    onClick={() => setExpanded(expanded === block.id ? null : block.id)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  >
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-slate-900">{BLOCK_LABELS[block.type]}</p>
                      <p className="truncate text-[11px] text-slate-400">{blockSummary(block)}</p>
                    </div>
                    <Icons.down
                      size={14}
                      className={`flex-shrink-0 text-slate-400 transition-transform ${expanded === block.id ? "rotate-180" : ""}`}
                    />
                  </button>

                  {expanded === block.id && (
                    <div className="border-t border-slate-100 p-4">
                      {!readOnly && (
                        <div className="mb-3 flex items-center justify-end gap-1">
                          <button
                            onClick={() => moveBlock(i, -1)}
                            disabled={i === 0}
                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                            aria-label="Move up"
                          >
                            <Icons.up size={14} />
                          </button>
                          <button
                            onClick={() => moveBlock(i, 1)}
                            disabled={i === campaign.blocks.length - 1}
                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                            aria-label="Move down"
                          >
                            <Icons.down size={14} />
                          </button>
                          <button
                            onClick={() => removeBlock(block.id)}
                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                            aria-label="Remove block"
                          >
                            <Icons.trash size={14} />
                          </button>
                        </div>
                      )}
                      <div className="flex flex-col gap-3">
                        {BLOCK_FIELDS[block.type].map((f) => (
                          <div key={f.key}>
                            <label className="text-[11px] font-semibold tracking-wide text-slate-500">{f.label.toUpperCase()}</label>
                            {f.type === "textarea" ? (
                              <textarea
                                disabled={readOnly}
                                value={block.fields[f.key] ?? ""}
                                onChange={(e) => updateBlockField(block.id, f.key, e.target.value)}
                                rows={3}
                                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none"
                              />
                            ) : (
                              <input
                                disabled={readOnly}
                                value={block.fields[f.key] ?? ""}
                                onChange={(e) => updateBlockField(block.id, f.key, e.target.value)}
                                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none"
                              />
                            )}
                          </div>
                        ))}
                        {BLOCK_FIELDS[block.type].length === 0 && <p className="text-[12px] text-slate-400">No settings for this block.</p>}
                      </div>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>

          {!readOnly && (
            <Card className="p-5">
              <p className="mb-3 text-[13px] font-semibold text-slate-900">Send a test</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-lime focus:bg-white focus:outline-none"
                />
                <Btn variant="outline" onClick={sendTest} disabled={sendingTest || !testEmail.trim()}>
                  {sendingTest ? "Sending…" : "Send Test"}
                </Btn>
              </div>
              {testMessage && <p className="mt-2 text-[12px] text-slate-500">{testMessage}</p>}
            </Card>
          )}

          {!readOnly && (
            <Card className="p-5">
              <p className="mb-3 text-[13px] font-semibold text-slate-900">Schedule or send</p>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none"
                  />
                  <Btn variant="outline" onClick={saveSchedule}>
                    {campaign.scheduledAt ? "Update" : "Schedule"}
                  </Btn>
                </div>
                <p className="text-[11px] text-slate-400">
                  Scheduling saves the date on the campaign. Actual automatic sending at that time needs a scheduled task
                  wired up separately — for now, use &quot;Send Now&quot; when you&apos;re ready.
                </p>
                {sendError && <p className="text-[13px] text-red-600">{sendError}</p>}
                <Btn onClick={sendNow} disabled={sending} className="w-full justify-center">
                  {sending ? "Sending…" : "Send Now"}
                </Btn>
              </div>
            </Card>
          )}
        </div>

        <div className="lg:sticky lg:top-[92px] lg:h-fit">
          <Card className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <p className="text-[12px] font-semibold text-slate-900">Preview</p>
              <div className="flex gap-1">
                {(["desktop", "mobile"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDevice(d)}
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                      device === d ? "bg-brand-lime text-brand-dark" : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {d === "desktop" ? "Desktop" : "Mobile"}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-center bg-slate-100 p-4">
              <iframe
                title="Email preview"
                srcDoc={previewHtml}
                className="rounded-lg border border-slate-200 bg-white transition-all"
                style={{ width: device === "desktop" ? "100%" : "375px", height: "640px" }}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold tracking-wide text-slate-500">{label.toUpperCase()}</label>
      <input
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none disabled:opacity-60"
      />
    </div>
  );
}
