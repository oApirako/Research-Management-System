import { connect } from "@/lib/db";
import bcrypt from "bcrypt";
import { requireAdmin } from "@/lib/auth";
import {
  requireSameOrigin,
  isValidEmail,
  isValidPassword,
  isValidUserType,
} from "@/lib/security";


// =========================
// GET - Get users
// =========================
export async function GET(req) {
  let db;

  try {
    if (!requireSameOrigin(req)) {
      return Response.json(
        {
          error: "Invalid origin",
        },
        {
          status: 403,
        }
      );
    }

    const auth = await requireAdmin();

    if (!auth.authorized) {
      return Response.json(
        { error: "Unauthorized" },
        { status: auth.status }
      );
    }

    const url = new URL(req.url);
    const searchQuery = url.searchParams.get("q") || "";

    db = await connect();

    const [rows] = await db.execute(
      `
      SELECT
        user_id,
        user_name,
        user_email,
        user_type
      FROM user
      WHERE user_name LIKE ?
      ORDER BY user_id ASC
      `,
      [`%${searchQuery}%`]
    );

    return Response.json(rows, { status: 200 });
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

// =========================
// POST - Admin create user
// =========================
export async function POST(req) {
  let db;

  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return Response.json(
        { error: "Unauthorized" },
        { status: auth.status }
      );
    }

    const {
      user_name,
      user_email,
      user_password,
      user_type,
    } = await req.json();

    if (
      !user_name ||
      !user_email ||
      !user_password ||
      user_type === undefined
    ) {
      return Response.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const role = Number(user_type);

    // อนุญาตเฉพาะ Teacher, Staff, Admin
    if (![1, 2, 3].includes(role)) {
      return Response.json(
        { error: "Invalid user type" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(
      user_password,
      10
    );

    db = await connect();

    // ตรวจ email ซ้ำ
    const [existingRows] = await db.execute(
      `
      SELECT user_id
      FROM user
      WHERE user_email = ?
      `,
      [user_email]
    );

    if (existingRows.length > 0) {
      return Response.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    await db.execute(
      `
      INSERT INTO user
      (
        user_name,
        user_email,
        user_password,
        user_type
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        user_name,
        user_email,
        hashedPassword,
        role,
      ]
    );

    return Response.json(
      { message: "User created" },
      { status: 201 }
    );
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

// =========================
// PUT - Admin update user
// =========================
export async function PUT(req) {
  let db;

  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return Response.json(
        { error: "Unauthorized" },
        { status: auth.status }
      );
    }

    const {
      user_id,
      user_name,
      user_email,
      user_password,
      user_type,
    } = await req.json();

    if (
      !user_id ||
      !user_name ||
      !user_email ||
      user_type === undefined
    ) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const role = Number(user_type);

    if (![1, 2, 3].includes(role)) {
      return Response.json(
        { error: "Invalid user type" },
        { status: 400 }
      );
    }

    db = await connect();

    const [targetRows] = await db.execute(
      `
      SELECT user_id, user_type
      FROM user
      WHERE user_id = ?
      `,
      [user_id]
    );

    if (targetRows.length === 0) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const targetUser = targetRows[0];

    // ห้าม Admin ลดสิทธิ์ตัวเอง
    if (
      Number(targetUser.user_id) ===
      Number(auth.user.user_id)
    ) {
      if (role !== 3) {
        return Response.json(
          {
            error: "You cannot remove your own admin role",
          },
          { status: 403 }
        );
      }
    }

    // ป้องกันการลด Admin คนสุดท้าย
    if (
      Number(targetUser.user_type) === 3 &&
      role !== 3
    ) {
      const [adminRows] = await db.execute(
        `
        SELECT COUNT(*) AS total
        FROM user
        WHERE user_type = 3
        `
      );

      const adminCount = Number(
        adminRows[0].total
      );

      if (adminCount <= 1) {
        return Response.json(
          {
            error: "Cannot remove the last admin",
          },
          { status: 403 }
        );
      }
    }

    // ตรวจ email ซ้ำกับคนอื่น
    const [emailRows] = await db.execute(
      `
      SELECT user_id
      FROM user
      WHERE user_email = ?
      AND user_id != ?
      `,
      [user_email, user_id]
    );

    if (emailRows.length > 0) {
      return Response.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    let query = `
      UPDATE user
      SET
        user_name = ?,
        user_email = ?,
        user_type = ?
    `;

    const params = [
      user_name,
      user_email,
      role,
    ];

    if (
      user_password &&
      user_password.trim() !== ""
    ) {
      const hashedPassword = await bcrypt.hash(
        user_password,
        10
      );

      query += `,
        user_password = ?
      `;

      params.push(hashedPassword);
    }

    query += `
      WHERE user_id = ?
    `;

    params.push(user_id);

    await db.execute(query, params);

    return Response.json(
      { message: "User updated" },
      { status: 200 }
    );
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

// =========================
// DELETE - Admin delete user
// =========================
export async function DELETE(req) {
  let db;

  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return Response.json(
        { error: "Unauthorized" },
        { status: auth.status }
      );
    }

    const { user_id } = await req.json();

    if (!user_id) {
      return Response.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    // ห้ามลบตัวเอง
    if (
      Number(user_id) ===
      Number(auth.user.user_id)
    ) {
      return Response.json(
        {
          error: "You cannot delete yourself",
        },
        { status: 403 }
      );
    }

    db = await connect();

    const [targetRows] = await db.execute(
      `
      SELECT user_id, user_type
      FROM user
      WHERE user_id = ?
      `,
      [user_id]
    );

    if (targetRows.length === 0) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const targetUser = targetRows[0];

    // ป้องกันลบ Admin คนสุดท้าย
    if (Number(targetUser.user_type) === 3) {
      const [adminRows] = await db.execute(
        `
        SELECT COUNT(*) AS total
        FROM user
        WHERE user_type = 3
        `
      );

      const adminCount = Number(
        adminRows[0].total
      );

      if (adminCount <= 1) {
        return Response.json(
          {
            error: "Cannot delete the last admin",
          },
          { status: 403 }
        );
      }
    }

    await db.execute(
      `
      DELETE FROM user
      WHERE user_id = ?
      `,
      [user_id]
    );

    return Response.json(
      { message: "User deleted" },
      { status: 200 }
    );
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