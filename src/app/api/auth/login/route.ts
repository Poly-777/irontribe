import { pool } from "../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { emailid, password } = await req.json();

  const result = await pool.query(`SELECT * FROM users WHERE emailid = $1`, [emailid]);
  const user = result.rows[0];

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  // Set secure cookie
  (await
        // Set secure cookie
        cookies()).set("session_user", user.emailid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });

  return NextResponse.json({ message: "Login successful" }, { status: 200 });
}
