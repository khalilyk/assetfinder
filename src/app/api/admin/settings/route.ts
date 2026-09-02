import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const DEFAULTS = {
  siteName: "AssetFinder",
  contactEmail: "",
  defaultOgImage: "",
  maintenanceMode: false,
};

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const row = await prisma.setting.findUnique({ where: { key: "general" } });
  const value = row?.value && typeof row.value === "object" ? row.value : {};

  return NextResponse.json({ settings: { ...DEFAULTS, ...value } });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "SUPER_ADMIN" && session.role !== "ADMIN") {
    return NextResponse.json({ error: "You don't have permission to change settings." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  const value = {
    siteName: typeof body.siteName === "string" ? body.siteName : DEFAULTS.siteName,
    contactEmail: typeof body.contactEmail === "string" ? body.contactEmail : "",
    defaultOgImage: typeof body.defaultOgImage === "string" ? body.defaultOgImage : "",
    maintenanceMode: !!body.maintenanceMode,
  };

  await prisma.setting.upsert({
    where: { key: "general" },
    create: { key: "general", value },
    update: { value },
  });

  await prisma.activityLog.create({
    data: { userId: session.sub, action: "updated settings", entity: "Setting", entityId: "general" },
  });

  return NextResponse.json({ settings: value });
}
