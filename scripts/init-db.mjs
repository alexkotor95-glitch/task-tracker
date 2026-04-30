import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const DATABASE_URL =
  "postgresql://neondb_owner:npg_0XtYOyz1hlcS@ep-delicate-queen-amonk4vw-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const sql = neon(DATABASE_URL);

async function init() {
  console.log("Creating tables...");

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email       TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name        TEXT,
      role        TEXT NOT NULL DEFAULT 'user',
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id      TEXT NOT NULL,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name    TEXT NOT NULL,
      color   TEXT NOT NULL,
      PRIMARY KEY (id, user_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id          TEXT NOT NULL,
      user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      text        TEXT NOT NULL,
      completed   BOOLEAN NOT NULL DEFAULT FALSE,
      priority    TEXT NOT NULL DEFAULT 'medium',
      due_date    TEXT,
      category_id TEXT,
      created_at  BIGINT NOT NULL,
      PRIMARY KEY (id, user_id)
    )
  `;

  console.log("Tables created.");

  // Seed admin user
  const email = "username@gmail.com";
  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length === 0) {
    const hash = await bcrypt.hash("TmpPassword123", 12);
    await sql`
      INSERT INTO users (email, password_hash, name, role)
      VALUES (${email}, ${hash}, 'Admin', 'admin')
    `;
    console.log("Admin user created:", email);
  } else {
    console.log("Admin user already exists:", email);
  }

  // Seed default categories for admin
  const [admin] = await sql`SELECT id FROM users WHERE email = ${email}`;
  const defaults = [
    { id: "personal", name: "Личные",  color: "#8b5cf6" },
    { id: "work",     name: "Рабочие", color: "#3b82f6" },
    { id: "family",   name: "Семья",   color: "#22c55e" },
  ];
  for (const cat of defaults) {
    await sql`
      INSERT INTO categories (id, user_id, name, color)
      VALUES (${cat.id}, ${admin.id}, ${cat.name}, ${cat.color})
      ON CONFLICT DO NOTHING
    `;
  }
  console.log("Default categories seeded.");
  console.log("Done!");
}

init().catch(console.error);
