import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Falls back to the site's own photography until real assets are
// uploaded through the Media Library.
const FALLBACK_IMAGES = [
  "/af-header.png",
  "/af-demo.png",
  "/af-accountable.png",
];

export async function GET() {
  try {
    const assets = await prisma.mediaAsset.findMany({
      where: { type: "IMAGE" },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: { url: true },
    });

    const images = assets.length > 0 ? assets.map((a) => a.url) : FALLBACK_IMAGES;
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: FALLBACK_IMAGES });
  }
}
