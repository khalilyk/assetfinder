import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function parseCoord(value: string | null): number | null {
  if (!value) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const barcode = searchParams.get("barcode")?.trim();
  const latitude = parseCoord(searchParams.get("lat"));
  const longitude = parseCoord(searchParams.get("lng"));
  const accuracy = parseCoord(searchParams.get("acc"));

  if (!barcode) return NextResponse.json({ error: "Enter a barcode to search." }, { status: 400 });

  const client = await prisma.crmContact.findUnique({
    where: { portalSlug: slug },
    select: { id: true, name: true, company: true },
  });
  if (!client) return NextResponse.json({ error: "Portal not found." }, { status: 404 });

  const asset = await prisma.asset.findFirst({
    where: { barcode, clientId: client.id },
    include: { events: { orderBy: { occurredAt: "desc" }, take: 10 } },
  });

  await prisma.scanLog
    .create({
      data: {
        clientId: client.id,
        assetId: asset?.id ?? null,
        barcode,
        found: !!asset,
        latitude,
        longitude,
        accuracy,
      },
    })
    .catch(() => {});

  if (!asset) {
    return NextResponse.json(
      { error: `No asset found for barcode "${barcode}" in this portal.` },
      { status: 404 },
    );
  }

  return NextResponse.json({ asset });
}
