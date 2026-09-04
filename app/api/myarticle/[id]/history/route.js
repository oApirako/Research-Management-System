// app/api/myarticle/[id]/history/route.js
import { connect } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

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

    // ตรวจ ownership
    const [article] =
      await db.execute(
        `
        SELECT a.article_id
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

    if (article.length === 0) {
      return Response.json(
        {
          message:
            "ไม่พบข้อมูลหรือไม่มีสิทธิ์เข้าถึง",
        },
        { status: 403 }
      );
    }

    const [history] =
      await db.execute(
        `
        SELECT
          ah.A_id AS id,
          ah.A_date AS date,
          ah.A_comment AS comment,
          'history' AS source
        FROM articlehistory ah
        WHERE ah.article_id = ?

        UNION ALL

        SELECT
          n.n_id AS id,
          n.n_dare AS date,
          n.n_comment AS comment,
          'notification' AS source
        FROM notification n
        WHERE n.article_id = ?

        ORDER BY date DESC
        `,
        [id, id]
      );

    return Response.json(
      history
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


