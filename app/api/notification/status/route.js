import { connect } from "@/lib/db";
import { requireStaff } from "@/lib/auth";

export async function GET() {
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

    conn = await connect();

    const [typeRows] =
      await conn.query(
        `
        SHOW COLUMNS
        FROM article
        LIKE 'article__status'
        `
      );

    if (
      typeRows.length === 0
    ) {
      return Response.json(
        [],
        {
          status: 200,
        }
      );
    }

    const enumStr =
      typeRows[0].Type;

    const enumValues =
      enumStr
        .replace(
          /^enum\(|\)$/gi,
          ""
        )
        .split(",")
        .map((v) =>
          v.replace(/'/g, "")
        );

    return Response.json(
      enumValues
    );
  } catch (err) {
    console.error(
      "STATUS ERROR:",
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