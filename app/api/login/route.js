// app/api/login/route.js

import { connect } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import {
  checkRateLimit,
  isValidEmail,
} from "@/lib/security";

export async function POST(req) {
  let db;

  try {
    const forwardedFor =
      req.headers.get("x-forwarded-for");

    const ip =
      forwardedFor?.split(",")[0]?.trim() ||
      "unknown";

    const rate = checkRateLimit(
      `login:${ip}`,
      5,
      60 * 1000
    );

    if (!rate.allowed) {
      return Response.json(
        {
          error:
            "Too many login attempts",
        },
        {
          status: 429,
          headers: {
            "Retry-After":
              String(rate.retryAfter),
          },
        }
      );
    }

    const body = await req.json();

    const user_email =
      typeof body.user_email === "string"
        ? body.user_email.trim()
        : "";

    const user_password =
      typeof body.user_password === "string"
        ? body.user_password
        : "";

    if (
      !user_email ||
      !user_password
    ) {
      return Response.json(
        {
          error:
            "Email and password are required",
        },
        {
          status: 400,
        }
      );
    }

    if (!isValidEmail(user_email)) {
      return Response.json(
        {
          error: "Invalid email format",
        },
        {
          status: 400,
        }
      );
    }

    db = await connect();

    const [rows] =
      await db.execute(
        `
        SELECT
          user_id,
          user_name,
          user_email,
          user_password,
          user_type
        FROM user
        WHERE user_email = ?
        `,
        [user_email]
      );

    if (rows.length === 0) {
      return Response.json(
        {
          error:
            "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }

    const user = rows[0];

    const match =
      await bcrypt.compare(
        user_password,
        user.user_password
      );

    if (!match) {
      return Response.json(
        {
          error:
            "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }

    await db.execute(
      `
      INSERT INTO userlog
      (
        u_date,
        user_id
      )
      VALUES (?, ?)
      `,
      [
        new Date(),
        user.user_id,
      ]
    );

    const token = jwt.sign(
      {
        user_id:
          user.user_id,
        user_type:
          user.user_type,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const cookieStore =
      await cookies();

    cookieStore.set(
      "token",
      token,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "lax",
        maxAge: 60 * 60,
        path: "/",
      }
    );

    return Response.json({
      message:
        "Login success",
      user_id:
        user.user_id,
      user_type:
        user.user_type,
      user_name:
        user.user_name,
    });
  } catch (error) {
    console.error(
      "LOGIN ERROR:",
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