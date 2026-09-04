// lib/auth.js

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connect } from "@/lib/db";

export async function getCurrentUser() {
  let db;

  try {
    const cookieStore = await cookies();

    const token =
      cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decoded.user_id) {
      return null;
    }

    db = await connect();

    const [rows] =
      await db.execute(
        `
        SELECT
          user_id,
          user_name,
          user_email,
          user_type
        FROM user
        WHERE user_id = ?
        `,
        [decoded.user_id]
      );

    if (rows.length === 0) {
      return null;
    }

    const user = rows[0];

    return {
      user_id: Number(user.user_id),
      user_name: user.user_name,
      user_email: user.user_email,
      user_type: Number(user.user_type),
    };
  } catch (error) {
    console.error(
      "AUTH ERROR:",
      error
    );

    return null;
  } finally {
    if (db) {
      await db.end();
    }
  }
}

export async function requireAuth() {
  const user =
    await getCurrentUser();

  if (!user) {
    return {
      authorized: false,
      status: 401,
      user: null,
    };
  }

  return {
    authorized: true,
    status: 200,
    user,
  };
}

export async function requireAdmin() {
  const auth =
    await requireAuth();

  if (!auth.authorized) {
    return auth;
  }

  if (
    auth.user.user_type !== 3
  ) {
    return {
      authorized: false,
      status: 403,
      user: auth.user,
    };
  }

  return auth;
}

export async function requireStaff() {
  const auth =
    await requireAuth();

  if (!auth.authorized) {
    return auth;
  }

  if (
    auth.user.user_type !== 2
  ) {
    return {
      authorized: false,
      status: 403,
      user: auth.user,
    };
  }

  return auth;
}