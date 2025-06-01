// src/app/api/schedules/route.ts
import { pool } from '../../../lib/db'; // Adjust path
import { NextResponse } from 'next/server';

// GET: Fetch all schedules
export async function GET(request: Request) {
  try {
    // In a real app, you might add filtering (e.g., by MemberID or TrainerID from query params)
    const { rows } = await pool.query('SELECT * FROM Schedule ORDER BY DayOfWeek, TimeSlot');
    return NextResponse.json(rows, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
  }
} 

// POST: Create a new schedule
export async function POST(request: Request) {
  try {
    const { memberId, trainerId, dayOfWeek, timeSlot } = await request.json();

    if (!memberId || !dayOfWeek || !timeSlot) {
      return NextResponse.json({ message: 'Member ID, Day of Week, and Time Slot are required.' }, { status: 400 });
    }

    const { rows } = await pool.query(
      `INSERT INTO Schedule (MemberID, TrainerID, DayOfWeek, TimeSlot)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [memberId, trainerId, dayOfWeek, timeSlot]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating schedule:', error);
    // You might add more specific error handling, e.g., for foreign key violations
    if (error.code === '23503') { // foreign_key_violation
      return NextResponse.json({ message: 'Invalid Member ID or Trainer ID.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

// PUT: Update an existing schedule
// Assumes ScheduleID is passed in the request body for simplicity,
// though a RESTful approach might use /api/schedules/[id] for PUT
export async function PUT(request: Request) {
  try {
    const { scheduleId, memberId, trainerId, dayOfWeek, timeSlot } = await request.json();

    if (!scheduleId || !memberId || !dayOfWeek || !timeSlot) {
      return NextResponse.json({ message: 'Schedule ID, Member ID, Day of Week, and Time Slot are required for update.' }, { status: 400 });
    }

    const { rowCount, rows } = await pool.query(
      `UPDATE Schedule
       SET MemberID = $1, TrainerID = $2, DayOfWeek = $3, TimeSlot = $4
       WHERE ScheduleID = $5 RETURNING *`,
      [memberId, trainerId, dayOfWeek, timeSlot, scheduleId]
    );

    if (rowCount === 0) {
      return NextResponse.json({ message: 'Schedule not found.' }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error: any) {
    console.error('Error updating schedule:', error);
    if (error.code === '23503') { // foreign_key_violation
      return NextResponse.json({ message: 'Invalid Member ID or Trainer ID.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

// DELETE: Delete a schedule
// Assumes ScheduleID is passed in the request body for simplicity,
// though a RESTful approach might use /api/schedules/[id] for DELETE
export async function DELETE(request: Request) {
  try {
    const { scheduleId } = await request.json();

    if (!scheduleId) {
      return NextResponse.json({ message: 'Schedule ID is required for deletion.' }, { status: 400 });
    }

    const { rowCount } = await pool.query(
      'DELETE FROM Schedule WHERE ScheduleID = $1',
      [scheduleId]
    );

    if (rowCount === 0) {
      return NextResponse.json({ message: 'Schedule not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Schedule deleted successfully.' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting schedule:', error);
    return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
