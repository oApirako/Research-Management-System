import { connect } from "@/lib/db";

export async function GET(req) {
  let conn;

  try {
    const url = new URL(req.url);

    const search =
      url.searchParams.get("search") || "";

    const type =
      url.searchParams.get("type") || "";

    const year =
      url.searchParams.get("year") || "";

    const owner =
      url.searchParams.get("owner") || "";

    const page = Math.max(
      1,
      parseInt(
        url.searchParams.get("page") || "1",
        10
      )
    );

    const pageSize = 4;
    const offset =
      (page - 1) * pageSize;

    let where =
      "WHERE a.article__status = 'Approved'";

    const params = [];

    if (search) {
      where +=
        " AND a.article_title LIKE ?";
      params.push(`%${search}%`);
    }

    if (type) {
      where +=
        " AND a.article_type = ?";
      params.push(type);
    }

    if (year) {
      where +=
        " AND YEAR(a.article_date) = ?";
      params.push(year);
    }

    if (owner) {
      where +=
        " AND u.user_name LIKE ?";
      params.push(`%${owner}%`);
    }

    conn = await connect();

    const [rows] = await conn.execute(
      `
      SELECT
        a.*,
        u.user_name AS owner_name,
        n.n_dare
      FROM article a
      JOIN user_article ua
        ON a.article_id = ua.article
      JOIN user u
        ON ua.user_id = u.user_id
      JOIN notification n
        ON n.article_id = a.article_id
      ${where}
      ORDER BY n.n_dare DESC
      LIMIT ${pageSize}
      OFFSET ${offset}
      `,
      params
    );

    const [
      [{ count }]
    ] = await conn.execute(
      `
      SELECT COUNT(*) AS count
      FROM article a
      JOIN user_article ua
        ON a.article_id = ua.article
      JOIN user u
        ON ua.user_id = u.user_id
      ${where}
      `,
      params
    );

    return Response.json({
      items: rows,
      total: Number(count) || 0,
    });
  } catch (error) {
    console.error(
      "ARTICLES API ERROR:",
      error
    );

    return Response.json(
      {
        message:
          "Internal Server Error",
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