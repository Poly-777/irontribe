// src/app/api/attendance/route.ts
import { pool } from '../../../lib/db';
import { NextResponse, NextRequest } from 'next/server';
import { verifyAuth } from '../../../lib/auth';

// Helper to get MemberID from user email
async function getMemberIdByEmail(email: string): Promise<number | null> {
  const { rows } = await pool.query('SELECT "MemberID" FROM Member WHERE Email = $1', [email]);
  return rows.length > 0 ? rows[0].MemberID : null;
}

// GET: Fetch attendance history for the logged-in member
export async function GET(request: NextRequest) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  const { user } = authResult;

  try {
    const memberId = await getMemberIdByEmail(user.email);
    if (!memberId) {
      return NextResponse.json({ message: 'Member profile not found for this user.' }, { status: 404 });
    }

    const { rows } = await pool.query(
      'SELECT * FROM Attendance WHERE "MemberID" = $1 ORDER BY "CheckInDate" DESC',
      [memberId]
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
