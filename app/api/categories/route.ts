import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { getUserId } from "@/lib/get-user-id";

function db() { return neon(process.env.DATABASE_URL!); }

export async function GET() {
  const uid = await getUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db()`
    SELECT id, name, color FROM categories WHERE user_id = ${uid} ORDER BY name
  `;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const uid = await getUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  await db()`
    INSERT INTO categories (id, user_id, name, color)
    VALUES (${body.id}, ${uid}, ${body.name}, ${body.color})
    ON CONFLICT DO NOTHING
  `;
  return NextResponse.json({ id: body.id, name: body.name, color: body.color });
}
