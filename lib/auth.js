// lib/auth.js
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    return {
      user_id: Number(decoded.user_id),
      user_type: Number(decoded.user_type),
    };
  } catch (error) {
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();

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
  const auth = await requireAuth();

  if (!auth.authorized) {
    return auth;
  }

  if (auth.user.user_type !== 3) {
    return {
      authorized: false,
      status: 403,
      user: auth.user,
    };
  }

  return auth;
}

export async function requireStaff() {
  const auth = await requireAuth();

  if (!auth.authorized) {
    return auth;
  }

  if (auth.user.user_type !== 2) {
    return {
      authorized: false,
      status: 403,
      user: auth.user,
    };
  }

  return auth;
}