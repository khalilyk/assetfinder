import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const MEDIA_TYPES = ["IMAGE", "VIDEO", "DOCUMENT", "OTHER"] as const;

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({ assets });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url : "";
  const pathname = typeof body?.pathname === "string" ? body.pathname : "";
  const filename = typeof body?.filename === "string" ? body.filename : "";
  const type = MEDIA_TYPES.includes(body?.type) ? body.type : "OTHER";

  if (!url || !pathname || !filename) {
    return NextResponse.json({ error: "url, pathname, and filename are required." }, { status: 400 });
  }

  const asset = await prisma.mediaAsset.create({
    data: {
      url,
      pathname,
      filename,
      type,
      contentType: typeof body?.contentType === "string" ? body.contentType : null,
      size: typeof body?.size === "number" ? body.size : null,
      width: typeof body?.width === "number" ? body.width : null,
      height: typeof body?.height === "number" ? body.height : null,
      folder: typeof body?.folder === "string" ? body.folder : null,
      uploadedById: session.sub,
    },
  });

  await prisma.activityLog.create({
    data: { userId: session.sub, action: "uploaded media", entity: "MediaAsset", entityId: asset.id, detail: asset.filename },
  });

  return NextResponse.json({ asset }, { status: 201 });
}
