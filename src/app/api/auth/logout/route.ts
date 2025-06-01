// File: /app/api/auth/logout/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Clear the cookie by setting an empty value and maxAge = 0
  // const cookieStore = await cookies();
  // cookieStore.set("session_user", "", {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   maxAge: 0,
  //   path: "/",
  // });
  const cookieStore = await cookies();
  cookieStore.delete('session_user');

  return NextResponse.json({ message: "Logout successful" });
}
