import { auth } from "@/auth";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

function sql() {
  return neon(process.env.DATABASE_URL!);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const db = sql();

  // Build update dynamically based on what was sent
  await db`
    UPDATE tasks SET
      completed   = COALESCE(${body.completed   ?? null}, completed),
      priority    = COALESCE(${body.priority    ?? null}, priority),
      due_date    = CASE WHEN ${Object.hasOwn(body, "dueDate")} THEN ${body.dueDate ?? null} ELSE due_date END,
      category_id = CASE WHEN ${Object.hasOwn(body, "categoryId")} THEN ${body.categoryId ?? null} ELSE category_id END
    WHERE id = ${id} AND user_id = ${session.user.id}
  `;
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = sql();
  await db`DELETE FROM tasks WHERE id = ${id} AND user_id = ${session.user.id}`;
  return NextResponse.json({ ok: true });
}
