// /lib/otpSender.ts
import nodemailer from "nodemailer";

// Simulate SMS for now (replace with Twilio or other later)
export async function sendOtpBySms(mobile: string, otp: string) {
  console.log(`📱 SMS to ${mobile}: Your OTP is ${otp}`);
  // Replace with actual SMS API call (e.g., Twilio)
}

// Send via email
export async function sendOtpByEmail(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER!,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
}
