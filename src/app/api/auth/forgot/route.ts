// /app/api/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
// Update the import path if alias is not configured
import {pool} from "../../../lib/db";
import { sendOtpByEmail, sendOtpBySms } from "../../lib/otpSender";

function generateOTP(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString().substring(0, length);
}

export async function POST(req: NextRequest) {
  const { emailid, mobile } = await req.json();

  if (!emailid || !mobile)
    return NextResponse.json({ error: "Email and mobile required" }, { status: 400 });

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  try {
    await pool.query(
      `INSERT INTO password_reset_otps (emailid, mobile, otp, expires_at) VALUES ($1, $2, $3, $4)`,
      [emailid, mobile, otp, expiresAt]
    );

    // Send via custom functions
    await sendOtpByEmail(emailid, otp);
    await sendOtpBySms(mobile, otp);

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
