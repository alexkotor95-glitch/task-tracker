/**
 * Returns the userId from either NextAuth (email) or phone JWT session.
 * Use in API route handlers instead of auth() directly.
 */
import { auth } from "@/auth";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "tg_session";

function secret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET!);
}

export async function getUserId(): Promise<string | null> {
  // 1. Try NextAuth session (email/password)
  const session = await auth();
  if (session?.user?.id) return session.user.id;

  // 2. Try phone JWT session
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret());
    return (payload.sub as string) ?? null;
  } catch {
    return null;
  }
}
