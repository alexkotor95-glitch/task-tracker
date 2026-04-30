import { neon } from "@neondatabase/serverless";

const SEND_LIMIT   = 3;   // max OTP sends
const SEND_WINDOW  = 600; // seconds (10 min)
const VERIFY_LIMIT = 5;   // max verify attempts
const VERIFY_WINDOW = 600;

function db() {
  return neon(process.env.DATABASE_URL!);
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number; // seconds until reset
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function elapsed(windowStart: string): number {
  return (Date.now() - new Date(windowStart).getTime()) / 1000;
}

// ── Send (OTP request) ───────────────────────────────────────────────────────

export async function checkSendLimit(phone: string): Promise<RateLimitResult> {
  const sql = db();
  const [row] = await sql`
    SELECT send_count, send_window_start
    FROM phone_rate_limits
    WHERE phone_number = ${phone}
  `;
  if (!row) return { allowed: true };

  const secs = elapsed(row.send_window_start as string);
  if (secs > SEND_WINDOW) return { allowed: true };
  if ((row.send_count as number) >= SEND_LIMIT) {
    return { allowed: false, retryAfter: Math.ceil(SEND_WINDOW - secs) };
  }
  return { allowed: true };
}

export async function incrementSendCount(phone: string): Promise<void> {
  const sql = db();
  await sql`
    INSERT INTO phone_rate_limits (phone_number, send_count, send_window_start)
    VALUES (${phone}, 1, NOW())
    ON CONFLICT (phone_number) DO UPDATE SET
      send_count = CASE
        WHEN EXTRACT(EPOCH FROM (NOW() - phone_rate_limits.send_window_start)) > ${SEND_WINDOW}
          THEN 1
          ELSE phone_rate_limits.send_count + 1
      END,
      send_window_start = CASE
        WHEN EXTRACT(EPOCH FROM (NOW() - phone_rate_limits.send_window_start)) > ${SEND_WINDOW}
          THEN NOW()
          ELSE phone_rate_limits.send_window_start
      END
  `;
}

// ── Verify (code check) ──────────────────────────────────────────────────────

export async function checkVerifyLimit(phone: string): Promise<RateLimitResult> {
  const sql = db();
  const [row] = await sql`
    SELECT verify_count, verify_window_start
    FROM phone_rate_limits
    WHERE phone_number = ${phone}
  `;
  if (!row) return { allowed: true };

  const secs = elapsed(row.verify_window_start as string);
  if (secs > VERIFY_WINDOW) return { allowed: true };
  if ((row.verify_count as number) >= VERIFY_LIMIT) {
    return { allowed: false, retryAfter: Math.ceil(VERIFY_WINDOW - secs) };
  }
  return { allowed: true };
}

export async function incrementVerifyCount(phone: string): Promise<void> {
  const sql = db();
  await sql`
    INSERT INTO phone_rate_limits (phone_number, verify_count, verify_window_start)
    VALUES (${phone}, 1, NOW())
    ON CONFLICT (phone_number) DO UPDATE SET
      verify_count = CASE
        WHEN EXTRACT(EPOCH FROM (NOW() - phone_rate_limits.verify_window_start)) > ${VERIFY_WINDOW}
          THEN 1
          ELSE phone_rate_limits.verify_count + 1
      END,
      verify_window_start = CASE
        WHEN EXTRACT(EPOCH FROM (NOW() - phone_rate_limits.verify_window_start)) > ${VERIFY_WINDOW}
          THEN NOW()
          ELSE phone_rate_limits.verify_window_start
      END
  `;
}

// ── Phone validation ─────────────────────────────────────────────────────────

/** E.164: + followed by 7–15 digits, no spaces */
export function validateE164(phone: string): boolean {
  return /^\+[1-9]\d{6,14}$/.test(phone);
}
