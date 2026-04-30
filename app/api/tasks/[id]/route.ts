import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { getUserId } from "@/lib/get-user-id";

function db() { return neon(process.env.DATABASE_URL!); }

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const uid = await getUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  await db()`
    UPDATE tasks SET
      completed   = COALESCE(${body.completed   ?? null}, completed),
      priority    = COALESCE(${body.priority    ?? null}, priority),
      due_date    = CASE WHEN ${Object.hasOwn(body, "dueDate")}
                        THEN ${body.dueDate ?? null}
                        ELSE due_date END,
      category_id = CASE WHEN ${Object.hasOwn(body, "categoryId")}
                        THEN ${body.categoryId ?? null}
                        ELSE category_id END
    WHERE id = ${id} AND user_id = ${uid}
  `;
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const uid = await getUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db()`DELETE FROM tasks WHERE id = ${id} AND user_id = ${uid}`;
  return NextResponse.json({ ok: true });
}
