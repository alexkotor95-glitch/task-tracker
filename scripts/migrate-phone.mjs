/**
 * Migration: add phone auth support
 * Run once: node scripts/migrate-phone.mjs
 */
import { neon } from "@neondatabase/serverless";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_0XtYOyz1hlcS@ep-delicate-queen-amonk4vw-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const sql = neon(DATABASE_URL);

async function run() {
  console.log("Running phone auth migration...");

  // 1. Make email/password optional (phone-only users have no email)
  await sql`ALTER TABLE users ALTER COLUMN email        DROP NOT NULL`;
  await sql`ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL`;

  // 2. Add phone and timestamp columns
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number   TEXT UNIQUE`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at     TIMESTAMPTZ DEFAULT NOW()`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at  TIMESTAMPTZ`;

  // 3. Ensure at least one of email/phone is always present
  await sql`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'users_email_or_phone'
      ) THEN
        ALTER TABLE users ADD CONSTRAINT users_email_or_phone
          CHECK (email IS NOT NULL OR phone_number IS NOT NULL);
      END IF;
    END $$
  `;

  // 4. Rate-limit table for OTP sends & verify attempts
  await sql`
    CREATE TABLE IF NOT EXISTS phone_rate_limits (
      phone_number        TEXT PRIMARY KEY,
      send_count          INTEGER NOT NULL DEFAULT 0,
      send_window_start   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      verify_count        INTEGER NOT NULL DEFAULT 0,
      verify_window_start TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  console.log("Migration complete.");
}

run().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
