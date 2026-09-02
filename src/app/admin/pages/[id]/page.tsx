"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, PageHeader, Btn, Icons } from "../../_ui";
import { generateSeoFromPage } from "@/lib/seo-autofill";

type Section = { id: string; type: string; fields: Record<string, string> };

type Seo = {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
  ogImageUrl: string;
  noindex: boolean;
  primaryQuestion: string;
  directAnswer: string;
  faqJson: string;
  aiSummary: string;
  keyFacts: string;
  structuredData: string;
};

const EMPTY_SEO: Seo = {
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  canonicalUrl: "",
  ogImageUrl: "",
  noindex: false,
  primaryQuestion: "",
  directAnswer: "",
  faqJson: "",
  aiSummary: "",
  keyFacts: "",
  structuredData: "",
};

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function PageEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"content" | "seo">(searchParams.get("tab") === "seo" ? "seo" : "content");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [published, setPublished] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [seo, setSeo] = useState<Seo>(EMPTY_SEO);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/pages/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.page) return;
        setTitle(d.page.title);
        setSlug(d.page.slug);
        setPublished(d.page.published);
        setSections(Array.isArray(d.page.sections) ? d.page.sections : []);
        if (d.page.seo) {
          setSeo({
            metaTitle: d.page.seo.metaTitle ?? "",
            metaDescription: d.page.seo.metaDescription ?? "",
            keywords: d.page.seo.keywords ?? "",
            canonicalUrl: d.page.seo.canonicalUrl ?? "",
            ogImageUrl: d.page.seo.ogImageUrl ?? "",
            noindex: !!d.page.seo.noindex,
            primaryQuestion: d.page.seo.primaryQuestion ?? "",
            directAnswer: d.page.seo.directAnswer ?? "",
            faqJson: d.page.seo.faqJson ? JSON.stringify(d.page.seo.faqJson, null, 2) : "",
            aiSummary: d.page.seo.aiSummary ?? "",
            keyFacts: d.page.seo.keyFacts ? JSON.stringify(d.page.seo.keyFacts, null, 2) : "",
            structuredData: d.page.seo.structuredData ? JSON.stringify(d.page.seo.structuredData, null, 2) : "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  function addSection() {
    setSections((s) => [...s, { id: newId(), type: "custom", fields: { heading: "", body: "" } }]);
  }

  function removeSection(sid: string) {
    setSections((s) => s.filter((x) => x.id !== sid));
  }

  function moveSection(index: number, dir: -1 | 1) {
    setSections((s) => {
      const next = [...s];
      const target = index + dir;
      if (target < 0 || target >= next.length) return s;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function updateSectionType(sid: string, type: string) {
    setSections((s) => s.map((x) => (x.id === sid ? { ...x, type } : x)));
  }

  function updateField(sid: string, key: string, value: string) {
    setSections((s) => s.map((x) => (x.id === sid ? { ...x, fields: { ...x.fields, [key]: value } } : x)));
  }

  function addField(sid: string) {
    const key = prompt("Field name (e.g. heading, body, imageUrl)");
    if (!key) return;
    setSections((s) => s.map((x) => (x.id === sid ? { ...x, fields: { ...x.fields, [key]: "" } } : x)));
  }

  function removeField(sid: string, key: string) {
    setSections((s) =>
      s.map((x) => {
        if (x.id !== sid) return x;
        const fields = { ...x.fields };
        delete fields[key];
        return { ...x, fields };
      }),
    );
  }

  function autoFillSeo() {
    const hasExisting = Object.values(seo).some((v) => typeof v === "string" && v.trim());
    if (hasExisting && !confirm("This will overwrite the current SEO/AEO/GEO fields with content generated from this page. Continue?")) {
      return;
    }
    const generated = generateSeoFromPage(title, sections);
    setSeo((s) => ({ ...s, ...generated }));
  }

  async function save() {
    setError(null);
    setSaved(false);

    let faqJson: unknown = undefined;
    let keyFacts: unknown = undefined;
    let structuredData: unknown = undefined;
    try {
      faqJson = seo.faqJson.trim() ? JSON.parse(seo.faqJson) : null;
      keyFacts = seo.keyFacts.trim() ? JSON.parse(seo.keyFacts) : null;
      structuredData = seo.structuredData.trim() ? JSON.parse(seo.structuredData) : null;
    } catch {
      setError("One of the SEO JSON fields (FAQ, Key Facts, or Structured Data) isn't valid JSON.");
      setTab("seo");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          published,
          sections,
          seo: {
            metaTitle: seo.metaTitle || null,
            metaDescription: seo.metaDescription || null,
            keywords: seo.keywords || null,
            canonicalUrl: seo.canonicalUrl || null,
            ogImageUrl: seo.ogImageUrl || null,
            noindex: seo.noindex,
            primaryQuestion: seo.primaryQuestion || null,
            directAnswer: seo.directAnswer || null,
            faqJson,
            aiSummary: seo.aiSummary || null,
            keyFacts,
            structuredData,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setSaving(false);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function deletePage() {
    if (!confirm("Delete this page? This cannot be undone.")) return;
    await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
    router.push("/admin/pages");
  }

  if (loading) {
    return <p className="p-6 text-sm text-slate-400">Loading…</p>;
  }

  return (
    <div>
      <PageHeader
        title={title || "Untitled page"}
        subtitle={`/${slug}`}
        action={
          <div className="flex items-center gap-2">
            {saved && <span className="text-[13px] font-medium text-brand-lime-text">Saved</span>}
            <Btn variant="outline" onClick={deletePage}>
              <Icons.trash size={15} /> Delete
            </Btn>
            <Btn onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Btn>
          </div>
        }
      />

      <Link href="/admin/pages" className="mb-5 inline-block text-[13px] text-slate-400 hover:text-slate-600">
        ← Back to Pages
      </Link>

      {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <div className="mb-5 flex gap-1 border-b border-slate-200">
        {(["content", "seo"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-[13px] font-semibold transition ${
              tab === t ? "border-b-2 border-brand-lime text-slate-900" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {t === "content" ? "Content" : "SEO / AEO / GEO"}
          </button>
        ))}
      </div>

      {tab === "content" && (
        <div className="flex flex-col gap-5">
          <Card className="p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[11px] font-semibold tracking-wide text-slate-500">TITLE</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold tracking-wide text-slate-500">SLUG</label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none"
                />
              </div>
            </div>
            <label className="mt-4 flex w-fit items-center gap-2 text-[13px] font-medium text-slate-600">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 accent-brand-lime"
              />
              Published
            </label>
          </Card>

          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-slate-900">Sections</p>
            <Btn variant="outline" onClick={addSection}>
              <Icons.plus size={15} /> Add Section
            </Btn>
          </div>

          {sections.length === 0 ? (
            <Card className="p-6 text-center text-sm text-slate-400">No sections yet.</Card>
          ) : (
            sections.map((s, i) => (
              <Card key={s.id} className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <input
                    value={s.type}
                    onChange={(e) => updateSectionType(s.id, e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] font-semibold text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none"
                  />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveSection(i, -1)}
                      disabled={i === 0}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                      aria-label="Move up"
                    >
                      <Icons.up size={15} />
                    </button>
                    <button
                      onClick={() => moveSection(i, 1)}
                      disabled={i === sections.length - 1}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                      aria-label="Move down"
                    >
                      <Icons.down size={15} />
                    </button>
                    <button
                      onClick={() => removeSection(s.id)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      aria-label="Remove section"
                    >
                      <Icons.trash size={15} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  {Object.entries(s.fields).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-2">
                      <div className="w-32 flex-shrink-0 pt-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        {key}
                      </div>
                      <textarea
                        value={value}
                        onChange={(e) => updateField(s.id, key, e.target.value)}
                        rows={value.length > 80 ? 3 : 1}
                        className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none"
                      />
                      <button
                        onClick={() => removeField(s.id, key)}
                        className="mt-1 rounded-lg p-2 text-slate-300 transition hover:bg-rose-50 hover:text-rose-600"
                        aria-label="Remove field"
                      >
                        <Icons.trash size={13} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addField(s.id)}
                    className="w-fit text-[12px] font-semibold text-brand-lime-text hover:text-brand-lime-dark"
                  >
                    + Add field
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {tab === "seo" && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between rounded-2xl border border-brand-lime/30 bg-lime-50 px-5 py-4">
            <div>
              <p className="text-[13px] font-semibold text-slate-900">Auto-fill from page content</p>
              <p className="mt-0.5 text-[12px] text-slate-500">
                Generates the fields below from this page&apos;s title and sections, tailored for Australia.
              </p>
            </div>
            <Btn variant="outline" onClick={autoFillSeo}>
              <Icons.refresh size={15} /> Auto-fill
            </Btn>
          </div>

          <Card className="p-5">
            <p className="mb-4 text-[12px] font-bold uppercase tracking-wide text-slate-400">Classic SEO</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField label="Meta Title" value={seo.metaTitle} onChange={(v) => setSeo({ ...seo, metaTitle: v })} />
              <TextField label="Canonical URL" value={seo.canonicalUrl} onChange={(v) => setSeo({ ...seo, canonicalUrl: v })} />
              <div className="sm:col-span-2">
                <TextAreaField
                  label="Meta Description"
                  value={seo.metaDescription}
                  onChange={(v) => setSeo({ ...seo, metaDescription: v })}
                />
              </div>
              <TextField label="Keywords" value={seo.keywords} onChange={(v) => setSeo({ ...seo, keywords: v })} />
              <TextField label="OG Image URL" value={seo.ogImageUrl} onChange={(v) => setSeo({ ...seo, ogImageUrl: v })} />
            </div>
            <label className="mt-4 flex w-fit items-center gap-2 text-[13px] font-medium text-slate-600">
              <input
                type="checkbox"
                checked={seo.noindex}
                onChange={(e) => setSeo({ ...seo, noindex: e.target.checked })}
                className="h-4 w-4 accent-brand-lime"
              />
              No-index this page
            </label>
          </Card>

          <Card className="p-5">
            <p className="mb-4 text-[12px] font-bold uppercase tracking-wide text-slate-400">
              AEO — Answer Engine Optimization
            </p>
            <div className="flex flex-col gap-4">
              <TextField
                label="Primary Question"
                value={seo.primaryQuestion}
                onChange={(v) => setSeo({ ...seo, primaryQuestion: v })}
              />
              <TextAreaField
                label="Direct Answer"
                value={seo.directAnswer}
                onChange={(v) => setSeo({ ...seo, directAnswer: v })}
              />
              <TextAreaField
                label="FAQ (JSON array of { question, answer })"
                value={seo.faqJson}
                onChange={(v) => setSeo({ ...seo, faqJson: v })}
                mono
              />
            </div>
          </Card>

          <Card className="p-5">
            <p className="mb-4 text-[12px] font-bold uppercase tracking-wide text-slate-400">
              GEO — Generative Engine Optimization
            </p>
            <div className="flex flex-col gap-4">
              <TextAreaField
                label="AI Summary"
                value={seo.aiSummary}
                onChange={(v) => setSeo({ ...seo, aiSummary: v })}
              />
              <TextAreaField
                label="Key Facts (JSON array of { label, value })"
                value={seo.keyFacts}
                onChange={(v) => setSeo({ ...seo, keyFacts: v })}
                mono
              />
              <TextAreaField
                label="Structured Data (raw JSON-LD)"
                value={seo.structuredData}
                onChange={(v) => setSeo({ ...seo, structuredData: v })}
                mono
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
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

function TextAreaField({
  label,
  value,
  onChange,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold tracking-wide text-slate-500">{label.toUpperCase()}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={mono ? 6 : 3}
        className={`mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-brand-lime focus:bg-white focus:outline-none ${
          mono ? "font-mono text-[12px]" : ""
        }`}
      />
    </div>
  );
}
