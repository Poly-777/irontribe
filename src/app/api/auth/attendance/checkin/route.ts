// src/app/api/attendance/checkin/route.ts
import { pool } from '../../../../lib/db';
import { NextResponse, NextRequest } from 'next/server';
import { verifyAuth } from '../../../../lib/auth';

// Helper to get MemberID from user email
async function getMemberIdByEmail(email: string): Promise<number | null> {
  const { rows } = await pool.query('SELECT "MemberID" FROM Member WHERE Email = $1', [email]);
  return rows.length > 0 ? rows[0].MemberID : null;
}

// POST: Record today's check-in for the logged-in member
export async function POST(request: NextRequest) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  const { user } = authResult;
  console.log('Authenticated user:', user);

  try {
    const memberId = await getMemberIdByEmail(user.email);
    if (!memberId) {
      return NextResponse.json({ message: 'Member profile not found for this user.' }, { status: 404 });
    }

    // Check if already checked in today
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const { rows: existingCheckIn } = await pool.query(
      'SELECT * FROM Attendance WHERE "MemberID" = $1 AND "CheckInDate" = $2',
      [memberId, today]
    );

    if (existingCheckIn.length > 0) {
      return NextResponse.json({ message: 'Already checked in today.' }, { status: 200 });
    }

    // Insert new attendance record
    const { rows } = await pool.query(
      'INSERT INTO Attendance ("MemberID", "CheckInDate") VALUES ($1, $2) RETURNING *',
      [memberId, today]
    );

    return NextResponse.json({ ...rows[0], message: 'Check-in successful!' }, { status: 201 });
  } catch (error: any) {
    console.error('Error during check-in:', error);
    return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
