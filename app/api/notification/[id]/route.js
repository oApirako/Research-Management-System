import { connect } from "@/lib/db";

import {
  requireStaff,
} from "@/lib/auth";

import {
  requireSameOrigin,
  isValidArticleStatus,
} from "@/lib/security";

// ==========================================
// GET
// ==========================================
export async function GET(
  req,
  { params }
) {
  let conn;

  try {
    const auth =
      await requireStaff();

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

    if (!id) {
      return Response.json(
        {
          error:
            "Article ID is required",
        },
        {
          status: 400,
        }
      );
    }

    conn = await connect();

    const [rows] =
      await conn.execute(
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
      rows[0],
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "NOTIFICATION GET ERROR:",
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
    if (conn) {
      await conn.end();
    }
  }
}

// ==========================================
// PUT
// ==========================================
export async function PUT(
  req,
  { params }
) {
  let conn;

  try {
    // =========================
    // Origin Check
    // =========================
    if (!requireSameOrigin(req)) {
      return Response.json(
        {
          error:
            "Invalid origin",
        },
        {
          status: 403,
        }
      );
    }

    // =========================
    // Staff Authentication
    // =========================
    const auth =
      await requireStaff();

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

    if (!id) {
      return Response.json(
        {
          error:
            "Article ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const body =
      await req.json();

    const article_status =
      typeof body.article_status ===
      "string"
        ? body.article_status
        : "";

    const n_comment =
      typeof body.n_comment ===
      "string"
        ? body.n_comment.trim()
        : "";

    // =========================
    // Validate Status
    // =========================
    if (
      !isValidArticleStatus(
        article_status
      )
    ) {
      return Response.json(
        {
          error:
            "Invalid article status",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // Validate Comment Length
    // =========================
    if (
      n_comment.length > 5000
    ) {
      return Response.json(
        {
          error:
            "Comment is too long",
        },
        {
          status: 400,
        }
      );
    }

    conn = await connect();

    // =========================
    // Check Article
    // =========================
    const [articleRows] =
      await conn.execute(
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
      // =========================
      // Update Article Status
      // =========================
      await conn.execute(
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

      // =========================
      // Insert Notification
      // user_id จาก JWT
      // =========================
      await conn.execute(
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
          new Date(),
          n_comment,
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
  } catch (error) {
    console.error(
      "NOTIFICATION PUT ERROR:",
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
    if (conn) {
      await conn.end();
    }
  }
}