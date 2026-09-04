import { connect } from "@/lib/db";
import bcrypt from "bcrypt";

import { requireAuth } from "@/lib/auth";
import {
  requireSameOrigin,
  isValidPassword,
} from "@/lib/security";

export async function PATCH(req) {
  let db;

  try {
    // =========================
    // Origin Check
    // =========================
    if (!requireSameOrigin(req)) {
      return Response.json(
        {
          error:
            "Invalid origin",
        },
        {
          status: 403,
        }
      );
    }

    // =========================
    // Authentication
    // =========================
    const auth =
      await requireAuth();

    if (!auth.authorized) {
      return Response.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await req.json();

    const user_name =
      typeof body.user_name ===
      "string"
        ? body.user_name.trim()
        : "";

    const user_password =
      typeof body.user_password ===
      "string"
        ? body.user_password
        : "";

    // =========================
    // Validate Name
    // =========================
    if (!user_name) {
      return Response.json(
        {
          error:
            "Name is required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      user_name.length > 100
    ) {
      return Response.json(
        {
          error:
            "Name is too long",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // Validate Password
    // =========================
    if (
      user_password &&
      !isValidPassword(
        user_password
      )
    ) {
      return Response.json(
        {
          error:
            "Password must be at least 8 characters and contain letters and special characters",
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
      user_name,
    ];

    // =========================
    // Change Password
    // =========================
    if (user_password) {
      const hashedPassword =
        await bcrypt.hash(
          user_password,
          10
        );

      query += `
        , user_password = ?
      `;

      params.push(
        hashedPassword
      );
    }

    // =========================
    // ใช้ User ID จาก JWT
    // ไม่รับจาก Client
    // =========================
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
  } catch (error) {
    console.error(
      "RESET PASSWORD ERROR:",
      error
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