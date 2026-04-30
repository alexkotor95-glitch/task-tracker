import { auth } from "@/auth";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

function sql() {
  return neon(process.env.DATABASE_URL!);
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = sql();
  const rows = await db`
    SELECT id, name, color FROM categories WHERE user_id = ${session.user.id} ORDER BY name
  `;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = sql();
  await db`
    INSERT INTO categories (id, user_id, name, color)
    VALUES (${body.id}, ${session.user.id}, ${body.name}, ${body.color})
    ON CONFLICT DO NOTHING
  `;
  return NextResponse.json({ id: body.id, name: body.name, color: body.color });
}
