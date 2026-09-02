"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, PageHeader, Badge, Icons } from "../_ui";

type PageSeo = {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  seo: {
    metaTitle: string | null;
    metaDescription: string | null;
    canonicalUrl: string | null;
    noindex: boolean;
    primaryQuestion: string | null;
    directAnswer: string | null;
    faqJson: unknown;
    aiSummary: string | null;
    keyFacts: unknown;
    structuredData: unknown;
  } | null;
};

function classicScore(p: PageSeo) {
  const checks = [!!p.seo?.metaTitle, !!p.seo?.metaDescription, !!p.seo?.canonicalUrl];
  return checks.filter(Boolean).length;
}

function aeoScore(p: PageSeo) {
  const checks = [!!p.seo?.primaryQuestion, !!p.seo?.directAnswer, !!p.seo?.faqJson];
  return checks.filter(Boolean).length;
}

function geoScore(p: PageSeo) {
  const checks = [!!p.seo?.aiSummary, !!p.seo?.keyFacts, !!p.seo?.structuredData];
  return checks.filter(Boolean).length;
}

function ScorePill({ score, max }: { score: number; max: number }) {
  const tone = score === max ? "green" : score === 0 ? "red" : "amber";
  return (
    <Badge tone={tone}>
      {score}/{max}
    </Badge>
  );
}

export default function SeoOverviewPage() {
  const [pages, setPages] = useState<PageSeo[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/seo")
      .then((r) => r.json())
      .then((d) => setPages(d.pages ?? []))
      .catch(() => setPages([]));
  }, []);

  const withData = pages ?? [];
  const missingMeta = withData.filter((p) => classicScore(p) < 3).length;
  const missingAeo = withData.filter((p) => aeoScore(p) === 0).length;
  const missingGeo = withData.filter((p) => geoScore(p) === 0).length;

  return (
    <div>
      <PageHeader
        title="SEO / AEO / GEO"
        subtitle="Site-wide optimization coverage. Edit each page's fields from its editor."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-[12px] font-semibold text-slate-500">Pages missing classic SEO</p>
          <p className="mt-3 text-2xl font-bold text-slate-900">{missingMeta}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[12px] font-semibold text-slate-500">Pages missing AEO</p>
          <p className="mt-3 text-2xl font-bold text-slate-900">{missingAeo}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[12px] font-semibold text-slate-500">Pages missing GEO</p>
          <p className="mt-3 text-2xl font-bold text-slate-900">{missingGeo}</p>
        </Card>
      </div>

      <Card className="mt-4 overflow-hidden">
        {pages === null ? (
          <p className="p-6 text-sm text-slate-400">Loading…</p>
        ) : pages.length === 0 ? (
          <p className="p-6 text-sm text-slate-400">
            No pages yet.{" "}
            <Link href="/admin/pages" className="text-brand-lime-text hover:text-brand-lime-dark">
              Create one
            </Link>{" "}
            to start optimizing.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-semibold">Page</th>
                <th className="px-5 py-3 font-semibold">Classic SEO</th>
                <th className="px-5 py-3 font-semibold">AEO</th>
                <th className="px-5 py-3 font-semibold">GEO</th>
                <th className="px-5 py-3 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-slate-900">{p.title}</p>
                    <p className="text-[11px] text-slate-400">
                      /{p.slug}
                      {p.seo?.noindex && (
                        <span className="ml-2 rounded bg-rose-50 px-1.5 py-0.5 text-rose-600">noindex</span>
                      )}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    <ScorePill score={classicScore(p)} max={3} />
                  </td>
                  <td className="px-5 py-3.5">
                    <ScorePill score={aeoScore(p)} max={3} />
                  </td>
                  <td className="px-5 py-3.5">
                    <ScorePill score={geoScore(p)} max={3} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/pages/${p.id}?tab=seo`}
                      className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand-lime-text hover:text-brand-lime-dark"
                    >
                      <Icons.edit size={13} /> Edit
                    </Link>
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
