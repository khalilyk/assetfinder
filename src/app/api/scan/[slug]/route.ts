import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const client = await prisma.crmContact.findUnique({
    where: { portalSlug: slug },
    select: { id: true, name: true, company: true },
  });

  if (!client) return NextResponse.json({ error: "Portal not found." }, { status: 404 });

  const assetCount = await prisma.asset.count({ where: { clientId: client.id } });

  return NextResponse.json({
    client: { name: client.company || client.name },
    assetCount,
  });
}
