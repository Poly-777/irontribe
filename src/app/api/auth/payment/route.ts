// app/api/payment/route.ts (or route.js for JS)
import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../../lib/db";

// POST /api/payment
export async function POST(req: NextRequest) {
  try {
    const { title, price, duration } = await req.json();

    if (!title || !price || !duration) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO Plan (title, price, duration) VALUES ($1, $2, $3) RETURNING *`,
      [title, price, duration]
    );

    return NextResponse.json(
      { message: "Payment recorded", data: result.rows[0] },
      { status: 201 }
    );
  } catch (err) {
    console.error("Payment API error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// Optional: GET all payments (for admin/debug)
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM payments ORDER BY paid_at DESC");
    return NextResponse.json({ data: result.rows }, { status: 200 });
  } catch (err) {
    console.error("Fetch payments error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
