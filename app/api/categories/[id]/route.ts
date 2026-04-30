import { auth } from "@/auth";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

function sql() {
  return neon(process.env.DATABASE_URL!);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = sql();

  // Clear category from tasks first
  await db`
    UPDATE tasks SET category_id = NULL
    WHERE user_id = ${session.user.id} AND category_id = ${id}
  `;
  await db`
    DELETE FROM categories WHERE id = ${id} AND user_id = ${session.user.id}
  `;
  return NextResponse.json({ ok: true });
}
