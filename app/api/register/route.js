//app/api/register.js
import { connect } from "@/lib/db";
import bcrypt from 'bcrypt';

export async function POST(req) {
  const { user_name, user_password, user_email, user_type } = await req.json();

  try {
    const hashedPassword = await bcrypt.hash(user_password, 10);
    const db = await connect();
    await db.execute(
      'INSERT INTO user (user_name, user_password, user_email, user_type) VALUES (?, ?, ?, ?)',
      [user_name, hashedPassword, user_email, 4]
    );

    await db.end();

    return new Response(JSON.stringify({ message: 'Register success' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
