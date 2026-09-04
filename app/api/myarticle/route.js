import { connect } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

// ==========================================
// POST - ดึงบทความของ User ที่ Login อยู่
// ==========================================
export async function POST(req) {
  let db;

  try {
    const auth = await requireAuth();

    if (!auth.authorized) {
      return NextResponse.json(
        {
          message:
            "กรุณาเข้าสู่ระบบ",
        },
        {
          status: 401,
        }
      );
    }

    let body = {};

    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const {
      startYear = "",
      endYear = "",
      type = "",
    } = body;

    // เอา user_id จาก JWT
    // ไม่รับ userId จาก Client
    const userId =
      auth.user.user_id;

    db = await connect();

    let query = `
      SELECT
        a.*,
        ua.user_id
      FROM article a
      JOIN user_article ua
        ON a.article_id = ua.article
      WHERE ua.user_id = ?
    `;

    const params = [userId];

    if (startYear) {
      query +=
        " AND YEAR(a.article_date) >= ?";
      params.push(Number(startYear));
    }

    if (endYear) {
      query +=
        " AND YEAR(a.article_date) <= ?";
      params.push(Number(endYear));
    }

    if (type) {
      query +=
        " AND a.article_type = ?";
      params.push(type);
    }

    query +=
      " ORDER BY a.article_date DESC";

    const [rows] =
      await db.execute(
        query,
        params
      );

    return NextResponse.json(
      rows,
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "MYARTICLE POST ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Internal Server Error",
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

// ==========================================
// DELETE - ลบบทความของตัวเอง
// ==========================================
export async function DELETE(req) {
  let db;

  try {
    const auth = await requireAuth();

    if (!auth.authorized) {
      return NextResponse.json(
        {
          message:
            "กรุณาเข้าสู่ระบบ",
        },
        {
          status: 401,
        }
      );
    }

    const { searchParams } =
      new URL(req.url);

    const id =
      searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          message:
            "ID required",
        },
        {
          status: 400,
        }
      );
    }

    db = await connect();

    // ======================================
    // ตรวจว่า Article เป็นของ User นี้จริง
    // ======================================
    const [ownerRows] =
      await db.execute(
        `
        SELECT user_id
        FROM user_article
        WHERE article = ?
        AND user_id = ?
        `,
        [
          id,
          auth.user.user_id,
        ]
      );

    if (ownerRows.length === 0) {
      return NextResponse.json(
        {
          message:
            "คุณไม่มีสิทธิ์ลบบทความนี้",
        },
        {
          status: 403,
        }
      );
    }

    // ======================================
    // Transaction
    // ======================================
    await db.beginTransaction();

    try {
      // ลบ History
      await db.execute(
        `
        DELETE FROM articlehistory
        WHERE article_id = ?
        `,
        [id]
      );

      // ลบ Notification
      await db.execute(
        `
        DELETE FROM notification
        WHERE article_id = ?
        `,
        [id]
      );

      // ลบความสัมพันธ์ User - Article
      await db.execute(
        `
        DELETE FROM user_article
        WHERE article = ?
        `,
        [id]
      );

      // ลบบทความ
      const [result] =
        await db.execute(
          `
          DELETE FROM article
          WHERE article_id = ?
          `,
          [id]
        );

      if (
        result.affectedRows === 0
      ) {
        await db.rollback();

        return NextResponse.json(
          {
            message:
              "ไม่พบบทความ",
          },
          {
            status: 404,
          }
        );
      }

      await db.commit();

      return NextResponse.json(
        {
          message:
            "ลบบทความและข้อมูลที่เกี่ยวข้องเรียบร้อย",
        },
        {
          status: 200,
        }
      );
    } catch (error) {
      await db.rollback();
      throw error;
    }
  } catch (error) {
    console.error(
      "MYARTICLE DELETE ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "เกิดข้อผิดพลาด",
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