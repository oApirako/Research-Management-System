import { connect } from "@/lib/db";
import { requireStaff } from "@/lib/auth";

export async function GET(req) {
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

    const {
      searchParams,
    } = new URL(req.url);

    const name =
      searchParams.get("name") || "";

    const year =
      searchParams.get("year") || "";

    const type =
      searchParams.get("type") || "";

    conn = await connect();

    let query = `
      SELECT
        a.article_id,
        a.article_title,
        a.article_category,
        a.article_type,
        a.article_date,
        a.article_link,
        a.article__status
      FROM article a
      INNER JOIN user_article ua
        ON ua.article = a.article_id
      INNER JOIN user u
        ON u.user_id = ua.user_id
      WHERE 1 = 1
    `;

    const params = [];

    if (name) {
      query +=
        " AND u.user_name LIKE ?";
      params.push(`%${name}%`);
    }

    if (year) {
      query +=
        " AND YEAR(a.article_date) = ?";
      params.push(Number(year));
    }

    if (type) {
      query +=
        " AND a.article_type = ?";
      params.push(type);
    }

    query +=
      " ORDER BY a.article_date DESC";

    const [articles] =
      await conn.execute(
        query,
        params
      );

    const [typeRows] =
      await conn.query(
        `
        SHOW COLUMNS
        FROM article
        LIKE 'article_type'
        `
      );

    let enumValues = [];

    if (
      typeRows.length > 0 &&
      typeRows[0].Type
    ) {
      const enumStr =
        typeRows[0].Type;

      enumValues = enumStr
        .replace(
          /^enum\(|\)$/gi,
          ""
        )
        .split(",")
        .map((v) =>
          v.replace(/'/g, "")
        );
    }

    return Response.json({
      articles,
      types: enumValues,
    });
  } catch (error) {
    console.error(
      "NOTIFICATION LIST ERROR:",
      error
    );

    return Response.json(
      {
        error: "Server error",
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