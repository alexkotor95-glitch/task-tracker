/**
 * Short-lived httpOnly cookie that stores { phone, requestId }.
 * Signed with AUTH_SECRET via HS256 JWT — never exposed to client JS.
 */
import { SignJWT, jwtVerify, errors as JoseErrors } from "jose";

const COOKIE_NAME = "tg_phone_verify";
const TTL_SECONDS = 600; // 10 min

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(s);
}

export { COOKIE_NAME };

export interface PhoneVerifyPayload {
  phone: string;
  requestId: string;
}

export async function signVerifyToken(payload: PhoneVerifyPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TTL_SECONDS}s`)
    .sign(secret());
}

export async function parseVerifyToken(
  token: string,
): Promise<PhoneVerifyPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    const phone = payload.phone as string | undefined;
    const requestId = payload.requestId as string | undefined;
    if (!phone || !requestId) return null;
    return { phone, requestId };
  } catch (err) {
    if (err instanceof JoseErrors.JWTExpired) return null;
    if (err instanceof JoseErrors.JWSSignatureVerificationFailed) return null;
    return null;
  }
}

/** Extract cookie value from a raw Cookie header string */
export function extractCookieValue(
  cookieHeader: string,
  name: string,
): string | null {
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${name}=([^;]+)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}
