import { connect } from "@/lib/db";
import bcrypt from "bcrypt";
import { requireAuth } from "@/lib/auth";

export async function PATCH(req) {
  let db;

  try {
    // ตรวจว่ามี Login และ Token ถูกต้อง
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

    const {
      user_name,
      user_password,
    } = await req.json();

    // ตรวจชื่อ
    if (!user_name || !user_name.trim()) {
      return Response.json(
        {
          error: "Name is required",
        },
        {
          status: 400,
        }
      );
    }

    db = await connect();

    let query = `
      UPDATE user
      SET user_name = ?
    `;

    const params = [
      user_name.trim(),
    ];

    // ถ้ามีการเปลี่ยน Password
    if (
      user_password &&
      user_password.trim() !== ""
    ) {
      const hashedPassword =
        await bcrypt.hash(
          user_password,
          10
        );

      query += `,
        user_password = ?
      `;

      params.push(hashedPassword);
    }

    // ใช้ user_id จาก JWT
    // ไม่รับ user_id จาก Client
    query += `
      WHERE user_id = ?
    `;

    params.push(
      auth.user.user_id
    );

    const [result] =
      await db.execute(
        query,
        params
      );

    if (
      result.affectedRows === 0
    ) {
      return Response.json(
        {
          error:
            "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        message:
          "Updated successfully",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error(
      "RESET PASSWORD ERROR:",
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