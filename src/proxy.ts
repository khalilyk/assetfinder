import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/session";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/reset-password"];
const REDIRECT_IF_AUTHED_PATHS = ["/admin/login"];

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;

  const secretRaw = process.env.SESSION_SECRET;
  if (!secretRaw) return false;

  try {
    await jwtVerify(token, new TextEncoder().encode(secretRaw));
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p));
  const authed = await isAuthenticated(request);

  if (pathname.startsWith("/admin")) {
    if (!isPublicAdminPath && !authed) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    const isRedirectIfAuthedPath = REDIRECT_IF_AUTHED_PATHS.some((p) => pathname.startsWith(p));
    if (isRedirectIfAuthedPath && authed) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
