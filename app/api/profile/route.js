import { connect } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  let db;

  try {
    const auth = await requireAuth();

    if (!auth.authorized) {
      return Response.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const userId = auth.user.user_id;

    db = await connect();

    const [rows] = await db.execute(
      `
      SELECT
        user_id,
        user_name,
        user_email,
        user_type
      FROM user
      WHERE user_id = ?
      `,
      [userId]
    );

    if (rows.length === 0) {
      return Response.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      rows[0],
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error(
      "PROFILE API ERROR:",
      err
    );

    return Response.json(
      {
        error:
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  } finally {
    if (db) {
      await db.end();
    }
  }
}