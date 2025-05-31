// /app/api/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
// Update the path below if your db file is located elsewhere
import {pool} from "../../../../lib/db";

export async function POST(req: NextRequest) {
  const { emailid, otp } = await req.json();

  if (!emailid || !otp)
    return NextResponse.json({ error: "Email and OTP required" }, { status: 400 });

  try {
    const res = await pool.query(
      `SELECT * FROM password_reset_otps 
       WHERE emailid = $1 AND otp = $2 AND used = false AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [emailid, otp]
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    await pool.query(
      `UPDATE password_reset_otps SET used = true WHERE id = $1`,
      [res.rows[0].id]
    );

    return NextResponse.json({ message: "OTP verified" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error verifying OTP" }, { status: 500 });
  }
}
