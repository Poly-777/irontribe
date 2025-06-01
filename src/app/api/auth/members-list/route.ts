// src/app/api/auth/members-list/route.ts
import { pool } from '../../../lib/db'; // Adjust path based on src/app/api/auth/members-list
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Only fetch MemberID and Name for the dropdown
    const { rows } = await pool.query('SELECT * FROM Member ORDER BY "Name"');
    // Note: Using double quotes for PascalCase column names as per your schema
    return NextResponse.json(rows, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching members list:', error);
    return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
