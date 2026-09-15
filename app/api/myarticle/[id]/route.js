// app/api/myarticle/[id]/route.js
import { connect } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function GET(req, { params }) {
  let db;

  try {
    const auth = await requireAuth();

    if (!auth.authorized) {
      return Response.json(
        { message: "กรุณาเข้าสู่ระบบ" },
        { status: 401 }
      );
    }

    const { id } = await params;

    db = await connect();

    const [rows] =
      await db.execute(
        `
        SELECT
          a.*
        FROM article a
        JOIN user_article ua
          ON a.article_id = ua.article
        WHERE a.article_id = ?
        AND ua.user_id = ?
        `,
        [
          id,
          auth.user.user_id,
        ]
      );

    if (rows.length === 0) {
      return Response.json(
        {
          message:
            "ไม่พบข้อมูลหรือไม่มีสิทธิ์เข้าถึง",
        },
        { status: 404 }
      );
    }

    return Response.json(
      rows[0]
    );
  } catch (err) {
    console.error(err);

    return Response.json(
      { message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  } finally {
    if (db) {
      await db.end();
    }
  }
}

export async function PUT(req, { params }) {
  let db;

  try {
    const auth = await requireAuth();

    if (!auth.authorized) {
      return Response.json(
        { message: "กรุณาเข้าสู่ระบบ" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const formData =
      await req.formData();

    const title =
      formData.get("title") || "";

    const category =
      formData.get("category") || "";

    const type =
      formData.get("type") || "";

    const comment =
      formData.get("comment") || "";

    const file =
      formData.get("file");

    db = await connect();

    // ตรวจ ownership
    const [rows] =
      await db.execute(
        `
        SELECT
          a.article_link,
          a.article__status
        FROM article a
        JOIN user_article ua
          ON a.article_id = ua.article
        WHERE a.article_id = ?
        AND ua.user_id = ?
        `,
        [
          id,
          auth.user.user_id,
        ]
      );

    if (rows.length === 0) {
      return Response.json(
        {
          message:
            "ไม่พบข้อมูลหรือไม่มีสิทธิ์แก้ไข",
        },
        { status: 403 }
      );
    }

    let link =
      rows[0].article_link;

    let status =
      rows[0].article__status;

    if (
      file instanceof File &&
      file.size > 0
    ) {
      if (
        file.type !==
        "application/pdf"
      ) {
        return Response.json(
          {
            message:
              "รองรับเฉพาะไฟล์ PDF",
          },
          { status: 400 }
        );
      }

      if (
        file.size >
        5 * 1024 * 1024
      ) {
        return Response.json(
          {
            message:
              "ไฟล์ต้องมีขนาดไม่เกิน 5 MB",
          },
          { status: 400 }
        );
      }

      const uploadsDir =
        path.join(
          process.cwd(),
          "public",
          "uploads"
        );

      if (
        !fs.existsSync(
          uploadsDir
        )
      ) {
        fs.mkdirSync(
          uploadsDir,
          { recursive: true }
        );
      }

      const filename =
        `${Date.now()}_${file.name}`;

      const filepath =
        path.join(
          uploadsDir,
          filename
        );

      const buffer =
        Buffer.from(
          await file.arrayBuffer()
        );

      fs.writeFileSync(
        filepath,
        buffer
      );

      link =
        `/uploads/${filename}`;
    }

    if (
      status === "Approved" ||
      status === "Rejected"
    ) {
      status = "Revision";
    }

    await db.beginTransaction();

    try {
      await db.execute(
        `
        UPDATE article
        SET
          article_title = ?,
          article_category = ?,
          article_type = ?,
          article_link = ?,
          article__status = ?,
          article_date = NOW()
        WHERE article_id = ?
        `,
        [
          title,
          category,
          type,
          link,
          status,
          id,
        ]
      );

      if (
        comment.trim() !== ""
      ) {
        await db.execute(
          `
          INSERT INTO articlehistory
          (
            A_date,
            A_comment,
            article_id
          )
          VALUES (NOW(), ?, ?)
          `,
          [
            comment,
            id,
          ]
        );
      }

      await db.commit();

      return Response.json({
        message:
          "อัปเดตบทความเรียบร้อย",
      });
    } catch (error) {
      await db.rollback();
      throw error;
    }
  } catch (err) {
    console.error(err);

    return Response.json(
      { message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  } finally {
    if (db) {
      await db.end();
    }
  }
}