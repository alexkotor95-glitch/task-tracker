import { NextResponse } from "next/server";
import { sendVerificationMessage, TelegramGatewayError } from "@/lib/telegram-gateway";
import { checkSendLimit, incrementSendCount, validateE164 } from "@/lib/phone-rate-limit";
import { signVerifyToken, COOKIE_NAME } from "@/lib/phone-verify-cookie";

export async function POST(req: Request) {
  let phone: string;
  try {
    ({ phone } = await req.json());
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  // ── Validate format ──────────────────────────────────────────────────────
  if (!phone || !validateE164(phone)) {
    return NextResponse.json(
      { error: "Неверный номер. Используйте формат E.164, например +79001234567" },
      { status: 400 },
    );
  }

  // ── Rate limit ────────────────────────────────────────────────────────────
  const limit = await checkSendLimit(phone);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: `Слишком много запросов. Повторите через ${limit.retryAfter} сек.`,
        retryAfter: limit.retryAfter,
      },
      { status: 429 },
    );
  }

  // ── Call Telegram Gateway ─────────────────────────────────────────────────
  let requestId: string;
  try {
    const result = await sendVerificationMessage(phone);
    requestId = result.request_id;
  } catch (err) {
    if (err instanceof TelegramGatewayError) {
      const status = err.code === "CONFIG" ? 500 : 502;
      return NextResponse.json({ error: err.message }, { status });
    }
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }

  await incrementSendCount(phone);

  // ── Store requestId in signed httpOnly cookie ─────────────────────────────
  const token = await signVerifyToken({ phone, requestId });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 min
    path: "/",
  });
  return res;
}
