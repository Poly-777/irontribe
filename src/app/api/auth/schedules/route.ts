import { pool } from '../../../lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ;

export async function POST(req: NextRequest) {
  try {
    const { trainerName, dayofweek, timeslot } = await req.json();

    const token = (await cookies()).get('session_user')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const memberid = decoded.id;
    console.log('Member ID:', memberid);

    await pool.query(
      `INSERT INTO Schedule (MemberID, TrainerName, DayOfWeek, TimeSlot)
       VALUES ($1, $2, $3, $4)`,
      [memberid, trainerName, dayofweek, timeslot]
    );
    
    return NextResponse.json({ message: 'Schedule created successfully' });
  } catch (err: any) {
    console.error('Schedule creation error:', err);
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
  }
}


// export async function GET(req: NextRequest) {
//   try {
//     const token = (await cookies()).get('session_user')?.value;
//     if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//     const decoded = jwt.verify(token, JWT_SECRET) as any;
//     const memberid = decoded.id;

//     const result = await pool.query('SELECT * FROM Schedule WHERE MemberID = $1', [memberid]);
//     return NextResponse.json(result.rows);
//   } catch (err: any) {
//     console.error('Schedule fetch error:', err);
//     return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 });
//   }
// }

// export async function PUT(req: NextRequest) {
//   try {
//     const { scheduleid, trainerid, dayofweek, timeslot } = await req.json();

//     await pool.query(
//       `UPDATE Schedule SET TrainerName = $1, DayOfWeek = $2, TimeSlot = $3 WHERE ScheduleID = $4`,
//       [trainerid, dayofweek, timeslot, scheduleid]
//     );

//     return NextResponse.json({ message: 'Schedule updated successfully' });
//   } catch (err: any) {
//     console.error('Schedule update error:', err);
//     return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 });
//   }
// }

// export async function DELETE(req: NextRequest) {
//   try {
//     const { scheduleid } = await req.json();

//     await pool.query(`DELETE FROM Schedule WHERE ScheduleID = $1`, [scheduleid]);
//     return NextResponse.json({ message: 'Schedule deleted successfully' });
//   } catch (err: any) {
//     console.error('Schedule delete error:', err);
//     return NextResponse.json({ error: 'Failed to delete schedule' }, { status: 500 });
//   }
// }
