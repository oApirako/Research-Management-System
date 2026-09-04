//app/api/myarticle/enum/route.js

import { connect } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const field = searchParams.get("field");
    if (!field) return NextResponse.json([], { status: 400 });

    const db = await connect();
    const [rows] = await db.query(
      `SHOW COLUMNS FROM article LIKE ?`,
      [field]
    );
    await db.end();

    if (rows.length === 0) return NextResponse.json([]);

    const typeStr = rows[0].Type; // ตัวอย่าง: enum('Pending','Revision','Appoved','Rejected')
    const enumValues = typeStr
      .replace(/^enum\(|\)$/gi, "")
      .split(",")
      .map(v => v.replace(/'/g, ""));

    return NextResponse.json(enumValues);
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 500 });
  }
}
