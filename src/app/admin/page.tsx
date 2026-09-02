import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, PageHeader, Icons, Badge } from "./_ui";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Request-time cutoff for a server component — not part of the render
  // memoization the purity rule guards against.
  // eslint-disable-next-line react-hooks/purity
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [pageCount, mediaCount, crmCount, pageViews7d, unreadForms, recentActivity] =
    await Promise.all([
      prisma.page.count(),
      prisma.mediaAsset.count(),
      prisma.crmContact.count(),
      prisma.pageView.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.formSubmission.count({ where: { read: false, spam: false } }),
      prisma.activityLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { user: { select: { name: true } } },
      }),
    ]);

  const stats: { label: string; value: number; icon: keyof typeof Icons; href: string }[] = [
    { label: "Pages", value: pageCount, icon: "pages", href: "/admin/pages" },
    { label: "Media Assets", value: mediaCount, icon: "media", href: "/admin/media" },
    { label: "CRM Contacts", value: crmCount, icon: "crm", href: "/admin/crm" },
    { label: "Views (7d)", value: pageViews7d, icon: "analytics", href: "/admin/analytics" },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your site's content, contacts, and traffic."
        action={
          unreadForms > 0 ? (
            <Badge tone="amber">{unreadForms} unread submission{unreadForms === 1 ? "" : "s"}</Badge>
          ) : undefined
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = Icons[s.icon];
          return (
            <Link key={s.href} href={s.href}>
              <Card className="p-5 transition hover:border-white/20">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-semibold text-white/50">{s.label}</p>
                  <Icon size={16} className="text-white/30" />
                </div>
                <p className="mt-3 text-2xl font-bold text-white">{s.value.toLocaleString()}</p>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <p className="text-[13px] font-semibold text-white">Recent Activity</p>
          {recentActivity.length === 0 ? (
            <p className="mt-4 text-[13px] text-white/40">No activity yet.</p>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {recentActivity.map((a) => (
                <li key={a.id} className="flex items-start gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-lime" />
                  <div className="min-w-0">
                    <p className="text-[13px] text-white/80">
                      <span className="font-semibold">{a.user?.name ?? "System"}</span>{" "}
                      {a.action}
                      {a.entity ? ` — ${a.entity}` : ""}
                    </p>
                    <p className="text-[11px] text-white/35">
                      {a.createdAt.toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <p className="text-[13px] font-semibold text-white">Quick Links</p>
          <div className="mt-4 flex flex-col gap-1">
            {[
              { label: "New Page", href: "/admin/pages", icon: "pages" as const },
              { label: "Upload Media", href: "/admin/media", icon: "media" as const },
              { label: "Add Contact", href: "/admin/crm", icon: "crm" as const },
              { label: "Site Settings", href: "/admin/settings", icon: "settings" as const },
            ].map((l) => {
              const Icon = Icons[l.icon];
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-[13px] font-medium text-white/70 transition hover:bg-white/8 hover:text-white"
                >
                  <Icon size={16} /> {l.label}
                </Link>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
