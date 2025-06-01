// src/app/api/feedbacks/route.ts
import { pool } from '../../../lib/db'; // Adjust path
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { rows } = await pool.query('SELECT * FROM Feedback ORDER BY FeedbackDate DESC');
    return NextResponse.json(rows, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}