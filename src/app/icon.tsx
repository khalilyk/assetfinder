import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const contentType = "image/png";

async function readFallback(): Promise<ArrayBuffer> {
  const { readFile } = await import("node:fs/promises");
  const path = await import("node:path");
  const buffer = await readFile(path.join(process.cwd(), "public/favicon-fallback.png"));
  return new Uint8Array(buffer).buffer as ArrayBuffer;
}

export default async function Icon() {
  const row = await prisma.setting.findUnique({ where: { key: "general" } }).catch(() => null);
  const value = row?.value as { faviconUrl?: string } | null;
  const faviconUrl = value?.faviconUrl;

  if (faviconUrl) {
    try {
      const res = await fetch(faviconUrl);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        return new Response(buffer, {
          headers: { "Content-Type": res.headers.get("content-type") || contentType },
        });
      }
    } catch {
      // fall through to bundled fallback
    }
  }

  const fallback = await readFallback();
  return new Response(fallback, { headers: { "Content-Type": contentType } });
}
