import { connect } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import {
  requireSameOrigin,
} from "@/lib/security";

import fs from "fs";
import path from "path";

export async function POST(req) {
  let db;
  let savePath = null;

  try {
    // =========================
    // Origin Check
    // =========================
    if (!requireSameOrigin(req)) {
      return Response.json(
        {
          message:
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
          message:
            "กรุณาเข้าสู่ระบบ",
        },
        {
          status: 401,
        }
      );
    }

    // =========================
    // Role Check
    // Teacher = 1
    // =========================
    if (
      auth.user.user_type !== 1
    ) {
      return Response.json(
        {
          message:
            "เฉพาะอาจารย์เท่านั้นที่สามารถเพิ่มบทความได้",
        },
        {
          status: 403,
        }
      );
    }

    const formData =
      await req.formData();

    const title =
      formData.get("title");

    const category =
      formData.get("category");

    const type =
      formData.get("type");

    const file =
      formData.get("file");

    // =========================
    // Input Validation
    // =========================
    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return Response.json(
        {
          message:
            "กรุณาใส่ชื่อบทความ",
        },
        {
          status: 400,
        }
      );
    }

    if (
      title.length > 255
    ) {
      return Response.json(
        {
          message:
            "ชื่อบทความยาวเกินไป",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof category !==
      "string" ||
      !category
    ) {
      return Response.json(
        {
          message:
            "กรุณาระบุหมวดหมู่",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof type !==
      "string" ||
      !type
    ) {
      return Response.json(
        {
          message:
            "กรุณาระบุประเภทบทความ",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !(file instanceof File) ||
      file.size === 0
    ) {
      return Response.json(
        {
          message:
            "กรุณาเลือกไฟล์ PDF",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // File Size
    // =========================
    if (
      file.size >
      5 * 1024 * 1024
    ) {
      return Response.json(
        {
          message:
            "ไฟล์ต้องมีขนาดไม่เกิน 5 MB",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // Read File
    // =========================
    const buffer =
      Buffer.from(
        await file.arrayBuffer()
      );

    // PDF magic bytes
    const pdfHeader =
      buffer
        .subarray(0, 5)
        .toString();

    if (
      file.type !==
        "application/pdf" ||
      pdfHeader !== "%PDF-"
    ) {
      return Response.json(
        {
          message:
            "รองรับเฉพาะไฟล์ PDF ที่ถูกต้อง",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // Random File Name
    // =========================
    const fileName =
      `${crypto.randomUUID()}.pdf`;

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
        {
          recursive: true,
        }
      );
    }

    savePath =
      path.join(
        uploadsDir,
        fileName
      );

    fs.writeFileSync(
      savePath,
      buffer
    );

    const filePath =
      `/uploads/${fileName}`;

    // =========================
    // Database
    // =========================
    db = await connect();

    await db.beginTransaction();

    try {
      const [result] =
        await db.execute(
          `
          INSERT INTO article
          (
            article_title,
            article_category,
            article_type,
            article_link,
            article_date,
            article__status
          )
          VALUES (?, ?, ?, ?, NOW(), 'Pending')
          `,
          [
            title.trim(),
            category,
            type,
            filePath,
          ]
        );

      const articleId =
        result.insertId;

      // สำคัญ:
      // user_id มาจาก JWT + DB
      // ไม่ได้มาจาก Client
      await db.execute(
        `
        INSERT INTO user_article
        (
          user_id,
          article
        )
        VALUES (?, ?)
        `,
        [
          auth.user.user_id,
          articleId,
        ]
      );

      await db.commit();
    } catch (error) {
      await db.rollback();

      // DB fail -> ลบไฟล์
      if (
        savePath &&
        fs.existsSync(
          savePath
        )
      ) {
        fs.unlinkSync(
          savePath
        );
      }

      throw error;
    }

    return Response.json(
      {
        message:
          "บันทึกผลงานเรียบร้อย",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "ADD ARTICLE ERROR:",
      error
    );

    return Response.json(
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