/**
 * TEMPORARY debug endpoint — returns the full Prisma error message.
 *
 * Usage:
 *   curl -b cookies.txt https://numeriainstitute.vercel.app/api/admin/debug-users
 *
 * DELETE this file after debugging.
 */
export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  if (session.user.role !== "ADMIN" && session.user.role !== "STAFF") {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "content-type": "application/json" },
    });
  }

  const debug: Record<string, unknown> = {
    session: {
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role,
    },
  };

  // Step 1: check raw connection
  try {
    await db.$queryRaw`SELECT 1`;
    debug.connection = { ok: true };
  } catch (err) {
    debug.connection = {
      ok: false,
      error: err instanceof Error ? `${err.name}: ${err.message}` : String(err),
    };
  }

  // Step 2: list tables
  try {
    const tables = await db.$queryRaw<{ table_name: string }[]>`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    debug.tables = tables.map((t) => t.table_name);
  } catch (err) {
    debug.tablesError = err instanceof Error
      ? `${err.name}: ${err.message}`
      : String(err);
  }

  // Step 3: User table columns
  try {
    const cols = await db.$queryRaw<
      { column_name: string; data_type: string; is_nullable: string }[]
    >`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'User'
      ORDER BY ordinal_position
    `;
    debug.userColumns = cols;
  } catch (err) {
    debug.userColumnsError = err instanceof Error
      ? `${err.name}: ${err.message}`
      : String(err);
  }

  // Step 4: the exact query /admin/utilisateurs runs
  try {
    const users = await db.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { enrollments: true, lessonProgress: true, badges: true },
        },
      },
      take: 100,
    });
    debug.usersQuery = {
      count: users.length,
      first: users[0]
        ? {
            id: users[0].id,
            email: users[0].email,
            firstName: users[0].firstName,
            lastName: users[0].lastName,
            role: users[0].role,
            deletedAt: users[0].deletedAt,
            _count: users[0]._count,
          }
        : null,
    };
  } catch (err) {
    debug.usersQueryError = err instanceof Error
      ? `${err.name}: ${err.message}\n${err.stack ?? ""}`
      : String(err);
  }

  return new Response(JSON.stringify(debug, null, 2), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
