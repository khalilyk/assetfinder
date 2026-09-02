import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "af_admin_session";
const SESSION_TTL = 60 * 60 * 8; // 8 hours

export type SessionRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR";

export interface SessionPayload {
  sub: string; // AdminUser id
  email: string;
  name: string;
  role: SessionRole;
}

let cachedSecret: Uint8Array | null = null;

function getSecret(): Uint8Array {
  if (cachedSecret) return cachedSecret;

  const raw = process.env.SESSION_SECRET;
  if (!raw) {
    // Required in every environment (not just production): middleware
    // runs in a separate Edge runtime from the Node server functions, so
    // an in-memory fallback secret generated on one side would never
    // match the other. Set SESSION_SECRET in .env.local for local dev.
    throw new Error(
      "SESSION_SECRET is not set. Add it to .env.local (and to the project's Vercel environment variables before deploying).",
    );
  }

  cachedSecret = new TextEncoder().encode(raw);
  return cachedSecret;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL}s`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      typeof payload.sub === "string" &&
      typeof payload.email === "string" &&
      typeof payload.name === "string" &&
      typeof payload.role === "string"
    ) {
      return {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role as SessionRole,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
