import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const TYPES = ["note", "call", "email", "meeting"] as const;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const type = TYPES.includes(body?.type) ? body.type : "note";
  const content = typeof body?.content === "string" ? body.content.trim() : "";

  if (!content) {
    return NextResponse.json({ error: "Content is required." }, { status: 400 });
  }

  const contact = await prisma.crmContact.findUnique({ where: { id } });
  if (!contact) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const activity = await prisma.crmActivity.create({
    data: { contactId: id, type, content },
  });

  await prisma.crmContact.update({ where: { id }, data: {} });

  return NextResponse.json({ activity }, { status: 201 });
}
