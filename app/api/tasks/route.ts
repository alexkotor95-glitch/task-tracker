import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { getUserId } from "@/lib/get-user-id";

function db() { return neon(process.env.DATABASE_URL!); }

function toTask(row: Record<string, unknown>) {
  return {
    id:         row.id,
    text:       row.text,
    completed:  row.completed,
    priority:   row.priority,
    dueDate:    row.due_date   ?? undefined,
    categoryId: row.category_id ?? undefined,
    createdAt:  Number(row.created_at),
  };
}

export async function GET() {
  const uid = await getUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db()`
    SELECT id, text, completed, priority, due_date, category_id, created_at
    FROM tasks WHERE user_id = ${uid} ORDER BY created_at ASC
  `;
  return NextResponse.json(rows.map(toTask));
}

export async function POST(req: Request) {
  const uid = await getUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const [row] = await db()`
    INSERT INTO tasks (id, user_id, text, completed, priority, due_date, category_id, created_at)
    VALUES (
      ${body.id}, ${uid}, ${body.text},
      ${body.completed ?? false}, ${body.priority ?? "medium"},
      ${body.dueDate ?? null}, ${body.categoryId ?? null},
      ${body.createdAt ?? Date.now()}
    ) RETURNING *
  `;
  return NextResponse.json(toTask(row));
}

export async function DELETE() {
  const uid = await getUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db()`DELETE FROM tasks WHERE user_id = ${uid} AND completed = true`;
  return NextResponse.json({ ok: true });
}
