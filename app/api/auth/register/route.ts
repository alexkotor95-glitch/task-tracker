import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email и пароль обязательны" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Пароль должен быть не менее 6 символов" }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Check if user exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase()}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: "Пользователь с таким email уже существует" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);
    const [user] = await sql`
      INSERT INTO users (email, password_hash, name, role)
      VALUES (${email.toLowerCase()}, ${hash}, ${name || null}, 'user')
      RETURNING id
    `;

    // Seed default categories for new user
    const defaults = [
      { id: "personal", name: "Личные",  color: "#8b5cf6" },
      { id: "work",     name: "Рабочие", color: "#3b82f6" },
      { id: "family",   name: "Семья",   color: "#22c55e" },
    ];
    for (const cat of defaults) {
      await sql`
        INSERT INTO categories (id, user_id, name, color)
        VALUES (${cat.id}, ${user.id}, ${cat.name}, ${cat.color})
        ON CONFLICT DO NOTHING
      `;
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
