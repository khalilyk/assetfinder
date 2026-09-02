import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const subscriber = await prisma.subscriber.findUnique({ where: { unsubscribeToken: token } });
  if (!subscriber) {
    return NextResponse.redirect(new URL("/unsubscribe?status=notfound", request.url));
  }

  await prisma.subscriber.update({ where: { id: subscriber.id }, data: { status: "UNSUBSCRIBED" } });

  return NextResponse.redirect(new URL("/unsubscribe?status=ok", request.url));
}
