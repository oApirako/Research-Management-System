import { getCurrentUser } from "@/lib/auth";
import { connect } from "@/lib/db";

export async function GET() {
  let db;

  try {
    const authUser = await getCurrentUser();

    if (!authUser) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    db = await connect();

    const [rows] = await db.execute(
      `
      SELECT user_id, user_name, user_email, user_type
      FROM user
      WHERE user_id = ?
      `,
      [authUser.user_id]
    );

    if (rows.length === 0) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(rows[0], { status: 200 });
  } catch (err) {
    console.error(err);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    if (db) {
      await db.end();
    }
  }
}