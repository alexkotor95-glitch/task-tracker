import { auth } from "./auth";
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "tg_session";

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

// Wrap NextAuth's auth middleware but also accept our phone session cookie
export default auth(async (req) => {
  const { pathname } = req.nextUrl;
  const isLoginPage  = pathname === "/login";

  const emailSession = !!req.auth;
  const phoneSession = !emailSession && (await hasPhoneSession(req));
  const isLoggedIn   = emailSession || phoneSession;

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  // Exclude api/auth (NextAuth + our phone endpoints), static assets
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
