import { pool } from "../../../lib/db";
import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";


import bcrypt from "bcrypt" ;

// GET all users
export async function GET() {
  const result = await pool.query("SELECT id, name, mobile, emailid, created_at FROM users ORDER BY created_at DESC");
  return NextResponse.json(result.rows);
}

// POST new user
export async function POST(request: NextRequest) {
  try {
    const { name, mobile, emailid, password } = await request.json();

    if (!name || !mobile || !emailid || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // salt rounds = 10

    const result = await pool.query(
      `
      INSERT INTO users (name, mobile, emailid, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, mobile, emailid, created_at
      `,
      [name, mobile, emailid, hashedPassword]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("❌ Error creating user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

}

}

