import { auth } from "./auth";
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "tg_session";

// Public paths — no auth required
const PUBLIC_PATHS = ["/", "/login"];

function secret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET!);
}

async function hasPhoneSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}

export default auth(async (req) => {
  const { pathname } = req.nextUrl;

  const emailSession = !!req.auth;
  const phoneSession = !emailSession && (await hasPhoneSession(req));
  const isLoggedIn   = emailSession || phoneSession;

  const isPublic = PUBLIC_PATHS.includes(pathname);

  // Unauthenticated on a protected route → login
  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Authenticated on landing or login → send to app
  if (isLoggedIn && (pathname === "/" || pathname === "/login")) {
    return NextResponse.redirect(new URL("/app", req.url));
  }
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
