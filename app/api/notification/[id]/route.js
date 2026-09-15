import { connect } from "@/lib/db";
import { requireStaff } from "@/lib/auth";

export async function GET(req, { params }) {
  let conn;

  try {
    const auth = await requireStaff();

    if (!auth.authorized) {
      return Response.json(
        {
          error:
            "You do not have permission",
        },
        {
          status: auth.status,
        }
      );
    }

    const { id } =
      await params;

    conn = await connect();

    const [rows] =
      await conn.query(
        `
        SELECT
          a.article_id,
          a.article_title,
          a.article_category,
          a.article_type,
          a.article_date,
          a.article_link,
          a.article__status,
          u.user_name
        FROM article a
        INNER JOIN user_article ua
          ON ua.article = a.article_id
        INNER JOIN user u
          ON u.user_id = ua.user_id
        WHERE a.article_id = ?
        `,
        [id]
      );

    if (rows.length === 0) {
      return Response.json(
        {
          error:
            "Article not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      rows[0]
    );
  } catch (err) {
    console.error(
      "NOTIFICATION DETAIL GET ERROR:",
      err
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
    if (conn) {
      await conn.end();
    }
  }
}

export async function PUT(req, { params }) {
  let conn;

  try {
    const auth = await requireStaff();

    if (!auth.authorized) {
      return Response.json(
        {
          error:
            "You do not have permission",
        },
        {
          status: auth.status,
        }
      );
    }

    const { id } =
      await params;

    const {
      article_status,
      n_comment,
    } = await req.json();

    if (!article_status) {
      return Response.json(
        {
          error:
            "Article status is required",
        },
        {
          status: 400,
        }
      );
    }

    conn = await connect();

    // ตรวจว่าบทความมีอยู่จริง
    const [articleRows] =
      await conn.query(
        `
        SELECT article_id
        FROM article
        WHERE article_id = ?
        `,
        [id]
      );

    if (
      articleRows.length === 0
    ) {
      return Response.json(
        {
          error:
            "Article not found",
        },
        {
          status: 404,
        }
      );
    }

    await conn.beginTransaction();

    try {
      // Update status
      await conn.query(
        `
        UPDATE article
        SET article__status = ?
        WHERE article_id = ?
        `,
        [
          article_status,
          id,
        ]
      );

      // บันทึก Notification
      const now = new Date();

      await conn.query(
        `
        INSERT INTO notification
        (
          n_dare,
          n_comment,
          user_id,
          article_id
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          now,
          n_comment || "",
          auth.user.user_id,
          id,
        ]
      );

      await conn.commit();

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
      await conn.rollback();
      throw error;
    }
  } catch (err) {
    console.error(
      "NOTIFICATION DETAIL PUT ERROR:",
      err
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
    if (conn) {
      await conn.end();
    }
  }
}