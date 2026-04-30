import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { getUserId } from "@/lib/get-user-id";

function db() { return neon(process.env.DATABASE_URL!); }

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const uid = await getUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db()`UPDATE tasks SET category_id = NULL
    WHERE user_id = ${uid} AND category_id = ${id}`;
  await db()`DELETE FROM categories WHERE id = ${id} AND user_id = ${uid}`;
  return NextResponse.json({ ok: true });
}
