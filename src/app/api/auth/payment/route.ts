import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { pool } from "../../../lib/db";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});


export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Missing title" }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT * FROM Plan WHERE title = $1`,
      [title]
    );

    const plan = result.rows[0];

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const order = await razorpay.orders.create({
      amount: plan.price * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json({
      key: process.env.RAZORPAY_KEY_ID,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    });
  } catch (err) {
    console.error("Payment API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
