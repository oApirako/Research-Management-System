// app/api/logout/route.js

import { cookies } from "next/headers";

export async function POST(req) {
  const origin =
    req.headers.get("origin");

  const expectedOrigin =
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  if (
    origin &&
    origin !== expectedOrigin
  ) {
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

  const cookieStore =
    await cookies();

  cookieStore.set(
    "token",
    "",
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      expires: new Date(0),
      path: "/",
    }
  );

  return Response.json({
    message:
      "Logout success",
  });
}