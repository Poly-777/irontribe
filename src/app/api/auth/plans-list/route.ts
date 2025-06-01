// src/app/api/auth/plans-list/route.ts
import { pool } from '../../../lib/db'; // Adjust path based on src/app/api/auth/plans-list
import { NextResponse, NextRequest } from 'next/server';
import { verifyAuth } from '../../../lib/auth';

export async function GET(request: NextRequest) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  // const { user } = authResult; // User object is available if needed for role-based access

  try {
    // Only fetch PlanID, PlanName, Price, and Duration for the dropdown
    const { rows } = await pool.query('SELECT "PlanID", "PlanName", "Price", "Duration" FROM Plan ORDER BY "PlanName"');
    return NextResponse.json(rows, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching plans list:', error);
    return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
