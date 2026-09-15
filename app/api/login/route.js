// app/api/login/route.js
import { connect } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { user_email, user_password } = await req.json();

    if (!user_email || !user_password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const db = await connect();

    const [rows] = await db.execute(
      "SELECT * FROM user WHERE user_email = ?",
      [user_email]
    );

    if (rows.length === 0) {
      await db.end();

      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const user = rows[0];

    const match = await bcrypt.compare(
      user_password,
      user.user_password
    );

    if (!match) {
      await db.end();

      return Response.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // บันทึกเวลา Login
    const now = new Date();

    await db.execute(
      "INSERT INTO userlog (u_date, user_id) VALUES (?, ?)",
      [now, user.user_id]
    );

    await db.end();

    // สร้าง JWT
    const token = jwt.sign(
      {
        user_id: user.user_id,
        user_type: user.user_type,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // เก็บ Token ใน HttpOnly Cookie
    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });

    return Response.json({
      message: "Login success",
      user_id: user.user_id,
      user_type: user.user_type,
      user_name: user.user_name,
    });
  } catch (err) {
    console.error(err);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}