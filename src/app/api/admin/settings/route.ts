import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const DEFAULTS = {
  siteName: "AssetFinder",
  contactEmail: "",
  faviconUrl: "",
  defaultOgImage: "",
  maintenanceMode: false,
  social: {
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
  },
};

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const row = await prisma.setting.findUnique({ where: { key: "general" } });
  const value = (row?.value && typeof row.value === "object" ? row.value : {}) as Partial<typeof DEFAULTS>;

  return NextResponse.json({
    settings: { ...DEFAULTS, ...value, social: { ...DEFAULTS.social, ...value.social } },
  });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "SUPER_ADMIN" && session.role !== "ADMIN") {
    return NextResponse.json({ error: "You don't have permission to change settings." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  const social = body.social && typeof body.social === "object" ? body.social : {};

  const value = {
    siteName: typeof body.siteName === "string" ? body.siteName : DEFAULTS.siteName,
    contactEmail: typeof body.contactEmail === "string" ? body.contactEmail : "",
    faviconUrl: typeof body.faviconUrl === "string" ? body.faviconUrl : "",
    defaultOgImage: typeof body.defaultOgImage === "string" ? body.defaultOgImage : "",
    maintenanceMode: !!body.maintenanceMode,
    social: {
      linkedin: typeof social.linkedin === "string" ? social.linkedin : "",
      twitter: typeof social.twitter === "string" ? social.twitter : "",
      facebook: typeof social.facebook === "string" ? social.facebook : "",
      instagram: typeof social.instagram === "string" ? social.instagram : "",
    },
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
