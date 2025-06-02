import { pool } from "../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// You should keep this secret safe in .env.local
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  const { emailid, password } = await req.json();

  const result = await pool.query(`SELECT * FROM users WHERE emailid = $1`, [emailid]);
  const user = result.rows[0];

  if (!user) {
    return NextResponse.json({ error: "User not found!" }, { status: 401 });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  // Create a JWT token
  const token = jwt.sign(
    {
      id: user.id,
      emailid: user.emailid,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  // Set secure cookie
  (await cookies()).set("session_user", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });

  // Also return user session data in response for client to store in sessionStorage
  return NextResponse.json(
    {
      message: "Login successful",
      session: {
        id: user.id,
        name: user.name,
        emailid: user.emailid,
      },
    },
    { status: 200 }
  );
}
