import { auth } from "@/auth";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

function sql() {
  return neon(process.env.DATABASE_URL!);
}

function toTask(row: Record<string, unknown>) {
  return {
    id:         row.id,
    text:       row.text,
    completed:  row.completed,
    priority:   row.priority,
    dueDate:    row.due_date ?? undefined,
    categoryId: row.category_id ?? undefined,
    createdAt:  Number(row.created_at),
  };
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = sql();
  const rows = await db`
    SELECT id, text, completed, priority, due_date, category_id, created_at
    FROM tasks
    WHERE user_id = ${session.user.id}
    ORDER BY created_at ASC
  `;
  return NextResponse.json(rows.map(toTask));
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = sql();
  const [row] = await db`
    INSERT INTO tasks (id, user_id, text, completed, priority, due_date, category_id, created_at)
    VALUES (
      ${body.id},
      ${session.user.id},
      ${body.text},
      ${body.completed ?? false},
      ${body.priority ?? "medium"},
      ${body.dueDate ?? null},
      ${body.categoryId ?? null},
      ${body.createdAt ?? Date.now()}
    )
    RETURNING *
  `;
  return NextResponse.json(toTask(row));
}

export async function DELETE() {
  // Delete all completed tasks for current user
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = sql();
  await db`DELETE FROM tasks WHERE user_id = ${session.user.id} AND completed = true`;
  return NextResponse.json({ ok: true });
}
