import { NextRequest, NextResponse } from "next/server";
import { pool} from "../../../../lib/db";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_payment_id, title } = await req.json();

    if (!razorpay_payment_id || !title) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT price, duration FROM Plan WHERE title = $1`,
      [title]
    );

    const plan = result.rows[0];

    await pool.query(
      `INSERT INTO Plan (title, price, duration, razorpay_payment_id) VALUES ($1, $2, $3, $4)`,
      [title, plan.price, plan.duration, razorpay_payment_id]
    );

    return NextResponse.json({ message: "Payment confirmed" }, { status: 201 });
  } catch (err) {
    console.error("Payment confirm error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
