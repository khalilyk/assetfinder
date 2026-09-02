import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pages = await prisma.page.findMany({
    orderBy: { title: "asc" },
    select: {
      id: true,
      slug: true,
      title: true,
      published: true,
      seo: {
        select: {
          metaTitle: true,
          metaDescription: true,
          canonicalUrl: true,
          noindex: true,
          primaryQuestion: true,
          directAnswer: true,
          faqJson: true,
          aiSummary: true,
          keyFacts: true,
          structuredData: true,
        },
      },
    },
  });

  return NextResponse.json({ pages });
}
