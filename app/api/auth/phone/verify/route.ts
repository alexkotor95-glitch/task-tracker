import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { checkVerificationStatus, TelegramGatewayError } from "@/lib/telegram-gateway";
import { checkVerifyLimit, incrementVerifyCount } from "@/lib/phone-rate-limit";
import {
  parseVerifyToken,
  extractCookieValue,
  COOKIE_NAME,
} from "@/lib/phone-verify-cookie";
import { SignJWT } from "jose";

const SESSION_COOKIE = "tg_session";
const SESSION_TTL    = 60 * 60 * 24 * 30; // 30 days

const DEFAULT_CATEGORIES = [
  { id: "personal", name: "Личные",  color: "#8b5cf6" },
  { id: "work",     name: "Рабочие", color: "#3b82f6" },
  { id: "family",   name: "Семья",   color: "#22c55e" },
];

function dbSecret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET!);
}

export async function POST(req: Request) {
  // ── Read code from body ───────────────────────────────────────────────────
  let code: string;
  try {
    ({ code } = await req.json());
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
  if (!code || !/^\d{5,6}$/.test(code.trim())) {
    return NextResponse.json({ error: "Неверный формат кода" }, { status: 400 });
  }

  // ── Read verification cookie ──────────────────────────────────────────────
  const cookieHeader = req.headers.get("cookie") ?? "";
  const rawToken = extractCookieValue(cookieHeader, COOKIE_NAME);
  if (!rawToken) {
    return NextResponse.json(
      { error: "Сессия истекла. Запросите код повторно." },
      { status: 401 },
    );
  }

  const verifyPayload = await parseVerifyToken(rawToken);
  if (!verifyPayload) {
    return NextResponse.json(
      { error: "Сессия истекла или недействительна. Запросите код повторно." },
      { status: 401 },
    );
  }

  const { phone, requestId } = verifyPayload;

  // ── Rate limit verify attempts ────────────────────────────────────────────
  const limit = await checkVerifyLimit(phone);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: `Слишком много попыток. Повторите через ${limit.retryAfter} сек.`,
        retryAfter: limit.retryAfter,
      },
      { status: 429 },
    );
  }

  // ── Check code with Telegram Gateway ─────────────────────────────────────
  let isValid: boolean;
  let tgStatus: string;
  try {
    const result = await checkVerificationStatus(requestId, code.trim());
    isValid  = result.ok;
    tgStatus = result.status;
  } catch (err) {
    if (err instanceof TelegramGatewayError) {
      return NextResponse.json({ error: err.message }, { status: 502 });
    }
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }

  await incrementVerifyCount(phone);

  if (!isValid) {
    const msg =
      tgStatus === "code_max_attempts_exceeded"
        ? "Превышено число попыток. Запросите новый код."
        : tgStatus === "expired"
          ? "Код истёк. Запросите новый."
          : "Неверный код. Попробуйте ещё раз.";
    return NextResponse.json({ error: msg, status: tgStatus }, { status: 422 });
  }

  // ── Upsert user in Neon ───────────────────────────────────────────────────
  const sql = neon(process.env.DATABASE_URL!);

  let userId: string;
  const existing = await sql`
    SELECT id FROM users WHERE phone_number = ${phone}
  `;

  if (existing.length > 0) {
    userId = existing[0].id as string;
    await sql`
      UPDATE users
      SET last_login_at = NOW(), updated_at = NOW()
      WHERE id = ${userId}
    `;
  } else {
    const [newUser] = await sql`
      INSERT INTO users (phone_number, updated_at, last_login_at)
      VALUES (${phone}, NOW(), NOW())
      RETURNING id
    `;
    userId = newUser.id as string;

    // Seed default categories for new user
    for (const cat of DEFAULT_CATEGORIES) {
      await sql`
        INSERT INTO categories (id, user_id, name, color)
        VALUES (${cat.id}, ${userId}, ${cat.name}, ${cat.color})
        ON CONFLICT DO NOTHING
      `;
    }
  }

  // ── Create session JWT ────────────────────────────────────────────────────
  const sessionToken = await new SignJWT({ sub: userId, phone })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL}s`)
    .sign(dbSecret());

  // ── Set cookies: session + clear verify ──────────────────────────────────
  const res = NextResponse.json({ ok: true });

  res.cookies.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL,
    path: "/",
  });

  // Clear the one-time verify cookie
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return res;
}
