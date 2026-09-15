// app/api/myarticle/add/route.js
import { connect } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function POST(req) {
  let db;

  try {
    const auth = await requireAuth();

    if (!auth.authorized) {
      return Response.json(
        { message: "กรุณาเข้าสู่ระบบ" },
        { status: 401 }
      );
    }

    // เฉพาะ Teacher
    if (auth.user.user_type !== 1) {
      return Response.json(
        {
          message:
            "เฉพาะอาจารย์เท่านั้นที่สามารถเพิ่มบทความได้",
        },
        { status: 403 }
      );
    }

    const formData = await req.formData();

    const title = formData.get("title");
    const category = formData.get("category");
    const type = formData.get("type");
    const file = formData.get("file");

    if (!title) {
      return Response.json(
        {
          message:
            "กรุณาใส่ชื่อบทความ",
        },
        { status: 400 }
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
        { status: 400 }
      );
    }

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

    const fileName =
      `${Date.now()}_${file.name}`;

    const uploadsDir =
      path.join(
        process.cwd(),
        "public",
        "uploads"
      );

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(
        uploadsDir,
        { recursive: true }
      );
    }

    const savePath =
      path.join(
        uploadsDir,
        fileName
      );

    const buffer =
      Buffer.from(
        await file.arrayBuffer()
      );

    fs.writeFileSync(
      savePath,
      buffer
    );

    const filePath =
      `/uploads/${fileName}`;

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
            title,
            category,
            type,
            filePath,
          ]
        );

      const articleId =
        result.insertId;

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

      return Response.json(
        {
          message:
            "บันทึกผลงานเรียบร้อย",
        },
        { status: 201 }
      );
    } catch (error) {
      await db.rollback();

      // ถ้า DB fail ลบไฟล์ที่เพิ่งสร้าง
      if (
        fs.existsSync(savePath)
      ) {
        fs.unlinkSync(
          savePath
        );
      }

      throw error;
    }
  } catch (error) {
    console.error(error);

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