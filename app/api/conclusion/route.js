import { connect } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  let connection;

  try {
    const auth = await requireStaff();

    if (!auth.authorized) {
      return NextResponse.json(
        {
          message:
            "คุณไม่มีสิทธิ์เข้าถึงรายงานนี้",
        },
        {
          status: auth.status,
        }
      );
    }

    const { searchParams } =
      new URL(req.url);

    const author =
      searchParams.get("author") || "";

    const startYear =
      searchParams.get("startYear") || "";

    const endYear =
      searchParams.get("endYear") || "";

    const type =
      searchParams.get("type") || "";

    connection = await connect();

    let query = `
      SELECT
        a.article_id,
        a.article_title,
        a.article_type,
        a.article_date,
        u.user_name
      FROM article a
      JOIN user_article ua
        ON a.article_id = ua.article
      JOIN user u
        ON ua.user_id = u.user_id
      WHERE a.article__status = 'Approved'
    `;

    const params = [];

    if (author) {
      query +=
        " AND u.user_name LIKE ?";
      params.push(`%${author}%`);
    }

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
      await connection.execute(
        query,
        params
      );

    const summary =
      rows.reduce(
        (acc, item) => {
          acc[item.article_type] =
            (acc[item.article_type] || 0) +
            1;

          return acc;
        },
        {}
      );

    return NextResponse.json({
      total: rows.length,
      summary,
      results: rows,
    });
  } catch (error) {
    console.error(
      "CONCLUSION ERROR:",
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
    if (connection) {
      await connection.end();
    }
  }
}