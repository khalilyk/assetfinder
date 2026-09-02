import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function escapeVcf(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);

  const user = await prisma.adminUser.findUnique({
    where: { cardSlug: slug },
    select: {
      name: true,
      email: true,
      title: true,
      phone: true,
      linkedinUrl: true,
      bio: true,
      avatarUrl: true,
    },
  });

  if (!user) return NextResponse.json({ error: "Card not found." }, { status: 404 });

  if (searchParams.get("format") === "vcf") {
    const origin = new URL(request.url).origin;
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${escapeVcf(user.name)}`,
      `N:${escapeVcf(user.name)};;;;`,
      "ORG:AssetFinder",
      ...(user.title ? [`TITLE:${escapeVcf(user.title)}`] : []),
      ...(user.phone ? [`TEL;TYPE=CELL:${escapeVcf(user.phone)}`] : []),
      ...(user.email ? [`EMAIL:${escapeVcf(user.email)}`] : []),
      ...(user.linkedinUrl ? [`URL:${escapeVcf(user.linkedinUrl)}`] : []),
      `URL:${origin}/card/${slug}`,
      ...(user.bio ? [`NOTE:${escapeVcf(user.bio)}`] : []),
      "END:VCARD",
    ];

    return new NextResponse(lines.join("\r\n"), {
      headers: {
        "Content-Type": "text/vcard; charset=utf-8",
        "Content-Disposition": `attachment; filename="${slugify(user.name)}.vcf"`,
      },
    });
  }

  return NextResponse.json({ user });
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "contact";
}
