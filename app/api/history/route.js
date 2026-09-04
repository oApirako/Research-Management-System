import { connect } from '@/lib/db';

export async function GET() {
  try {
    const db = await connect();

    const [rows] = await db.execute(`
        SELECT ul.u_id, u.user_id, u.user_name, u.user_type, ul.u_date
        FROM userlog ul
        JOIN user u ON ul.user_id = u.user_id
        ORDER BY ul.u_date DESC
    `);

    await db.end();

    return Response.json(rows);
  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
