// File: /app/api/auth/logout/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    // Clear the cookie by setting an empty value and maxAge = 0
  const cookieStore = await cookies();
  cookieStore.delete('session_admin'); 

  return NextResponse.json({ 
    message: "Logout successful",
    clearLocalStorage: true 
  });
}
