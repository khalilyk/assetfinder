"use client";

import { useEffect, useState } from "react";
import { Card, PageHeader, Icons } from "../_ui";

type Data = {
  days: number;
  totalViews: number;
  uniqueSessions: number;
  topPages: { path: string; count: number }[];
  topReferrers: { referrer: string | null; count: number }[];
  deviceBreakdown: { device: string; count: number }[];
  dailySeries: { day: string; count: number }[];
};

const RANGES = [7, 30, 90];

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    fetch(`/api/admin/analytics?days=${days}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, [days]);

  const maxDaily = data ? Math.max(1, ...data.dailySeries.map((d) => d.count)) : 1;
  const maxDevice = data ? Math.max(1, ...data.deviceBreakdown.map((d) => d.count)) : 1;

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Site traffic from first-party page-view tracking."
        action={
          <div className="flex gap-1">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setDays(r)}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
                  days === r ? "bg-brand-lime text-brand-dark" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {r}d
              </button>
            ))}
          </div>
        }
      />

      {!data ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card className="p-5">
              <p className="text-[12px] font-semibold text-slate-500">Total Views</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">{data.totalViews.toLocaleString()}</p>
            </Card>
            <Card className="p-5">
              <p className="text-[12px] font-semibold text-slate-500">Unique Sessions</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">{data.uniqueSessions.toLocaleString()}</p>
            </Card>
            <Card className="p-5">
              <p className="text-[12px] font-semibold text-slate-500">Top Page</p>
              <p className="mt-3 truncate text-lg font-bold text-slate-900">{data.topPages[0]?.path ?? "—"}</p>
            </Card>
            <Card className="p-5">
              <p className="text-[12px] font-semibold text-slate-500">Avg. Views / Day</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">{Math.round(data.totalViews / data.days).toLocaleString()}</p>
            </Card>
          </div>

          <Card className="mt-4 p-5">
            <p className="mb-4 text-[13px] font-semibold text-slate-900">Views over time</p>
            {data.dailySeries.length === 0 ? (
              <p className="text-sm text-slate-400">No data yet.</p>
            ) : (
              <div className="flex h-40 items-end gap-1">
                {data.dailySeries.map((d) => (
                  <div key={d.day} className="group relative flex h-full flex-1 flex-col justify-end">
                    <div
                      className="w-full rounded-t bg-brand-lime/70 transition group-hover:bg-brand-lime"
                      style={{ height: `${Math.max(4, (d.count / maxDaily) * 100)}%` }}
                    />
                    <div className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                      {new Date(d.day).toLocaleDateString("en-AU", { month: "short", day: "numeric" })}: {d.count}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="p-5 lg:col-span-2">
              <p className="mb-4 text-[13px] font-semibold text-slate-900">Top Pages</p>
              {data.topPages.length === 0 ? (
                <p className="text-sm text-slate-400">No data yet.</p>
              ) : (
                <ul className="flex flex-col gap-2.5">
                  {data.topPages.map((p) => (
                    <li key={p.path} className="flex items-center justify-between gap-3 text-[13px]">
                      <span className="truncate text-slate-700">{p.path}</span>
                      <span className="flex-shrink-0 font-semibold text-slate-500">{p.count.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card className="p-5">
              <p className="mb-4 text-[13px] font-semibold text-slate-900">Devices</p>
              {data.deviceBreakdown.length === 0 ? (
                <p className="text-sm text-slate-400">No data yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {data.deviceBreakdown.map((d) => (
                    <div key={d.device}>
                      <div className="mb-1 flex items-center justify-between text-[12px]">
                        <span className="capitalize text-slate-600">{d.device}</span>
                        <span className="text-slate-400">{d.count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100">
                        <div
                          className="h-1.5 rounded-full bg-brand-lime"
                          style={{ width: `${(d.count / maxDevice) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <Card className="mt-4 p-5">
            <p className="mb-4 text-[13px] font-semibold text-slate-900">Top Referrers</p>
            {data.topReferrers.length === 0 ? (
              <p className="flex items-center gap-2 text-sm text-slate-400">
                <Icons.globe size={14} className="text-slate-300" /> No referrer data yet — mostly direct traffic.
              </p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {data.topReferrers.map((r, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 text-[13px]">
                    <span className="truncate text-slate-700">{r.referrer}</span>
                    <span className="flex-shrink-0 font-semibold text-slate-500">{r.count.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
