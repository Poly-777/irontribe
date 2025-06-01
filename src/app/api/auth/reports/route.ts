// src/app/api/reports/route.ts
import { pool } from '../../../lib/db'; // Adjust path
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { rows } = await pool.query('SELECT ReportID, ReportType, GeneratedDate FROM Report ORDER BY GeneratedDate DESC');
    return NextResponse.json(rows, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}