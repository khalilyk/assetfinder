"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, PageHeader, Btn, Badge, Icons } from "../_ui";

type PageRow = {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  updatedAt: string;
};

export default function PagesListPage() {
  const router = useRouter();
  const [pages, setPages] = useState<PageRow[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [showNew, setShowNew] = useState(false);

  const load = () => {
    fetch("/api/admin/pages")
      .then((r) => r.json())
      .then((d) => setPages(d.pages ?? []))
      .catch(() => setPages([]));
  };

  useEffect(load, []);

  async function createPage(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCreating(true);
    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, slug: newSlug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setCreating(false);
        return;
      }
      router.push(`/admin/pages/${data.page.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setCreating(false);
    }
  }

  async function deletePage(id: string) {
    if (!confirm("Delete this page? This cannot be undone.")) return;
    await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <PageHeader
        title="Pages"
        subtitle="Manage the pages and section content published to the site."
        action={
          <Btn onClick={() => setShowNew((v) => !v)}>
            <Icons.plus size={16} /> New Page
          </Btn>
        }
      />

      {showNew && (
        <Card className="mb-6 p-5">
          <form onSubmit={createPage} className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="text-[11px] font-semibold tracking-wide text-slate-500">TITLE</label>
              <input
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="About Us"
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-lime focus:bg-white focus:outline-none"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-[11px] font-semibold tracking-wide text-slate-500">SLUG</label>
              <input
                required
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="about"
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-lime focus:bg-white focus:outline-none"
              />
            </div>
            <Btn type="submit" disabled={creating}>
              {creating ? "Creating…" : "Create"}
            </Btn>
          </form>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </Card>
      )}

      <Card className="overflow-hidden">
        {pages === null ? (
          <p className="p-6 text-sm text-slate-400">Loading…</p>
        ) : pages.length === 0 ? (
          <p className="p-6 text-sm text-slate-400">No pages yet. Create one to get started.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="px-5 py-3 font-semibold">Slug</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Updated</th>
                <th className="px-5 py-3 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/pages/${p.id}`} className="font-semibold text-slate-900 hover:text-brand-lime-text">
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">/{p.slug}</td>
                  <td className="px-5 py-3.5">
                    <Badge tone={p.published ? "green" : "slate"}>{p.published ? "Published" : "Draft"}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">
                    {new Date(p.updatedAt).toLocaleDateString("en-AU", { dateStyle: "medium" })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => deletePage(p.id)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      aria-label="Delete page"
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
    </div>
  );
}
