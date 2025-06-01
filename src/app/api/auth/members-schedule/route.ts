// // src/app/api/member-schedules/route.ts
// import { pool } from '../../../lib/db';
// import { NextResponse, NextRequest } from 'next/server';
// import { verifyAuth } from '../../../lib/auth';

// // Helper to get MemberID from user email
// async function getMemberIdByEmail(email: string): Promise<number | null> {
//   const { rows } = await pool.query('SELECT "MemberID" FROM Member WHERE Email = $1', [email]);
//   return rows.length > 0 ? rows[0].MemberID : null;
// }

// // GET: Fetch schedules for the logged-in member
// export async function GET(request: NextRequest) {
//   const authResult = await verifyAuth(request);
//   if (authResult instanceof NextResponse) {
//     return authResult;
//   }
//   const { user } = authResult;

//   try {
//     const memberId = await getMemberIdByEmail(user.email);
//     if (!memberId) {
//       return NextResponse.json({ message: 'Member profile not found for this user.' }, { status: 404 });
//     }

//     const { rows } = await pool.query(
//       'SELECT * FROM Schedule WHERE "MemberID" = $1 ORDER BY "DayOfWeek", "TimeSlot"',
//       [memberId]
//     );
//     return NextResponse.json(rows, { status: 200 });
//   } catch (error: any) {
//     console.error('Error fetching member schedules:', error);
//     return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
//   }
// }

// // POST: Create a new schedule for the logged-in member
// export async function POST(request: NextRequest) {
//   const authResult = await verifyAuth(request);
//   if (authResult instanceof NextResponse) {
//     return authResult;
//   }
//   const { user } = authResult;

//   try {
//     const memberId = await getMemberIdByEmail(user.email);
//     if (!memberId) {
//       return NextResponse.json({ message: 'Member profile not found for this user.' }, { status: 404 });
//     }

//     const { trainerId, dayOfWeek, timeSlot } = await request.json();

//     if (!dayOfWeek || !timeSlot) {
//       return NextResponse.json({ message: 'Day of Week and Time Slot are required.' }, { status: 400 });
//     }

//     const { rows } = await pool.query(
//       `INSERT INTO Schedule ("MemberID", "TrainerID", "DayOfWeek", "TimeSlot")
//        VALUES ($1, $2, $3, $4) RETURNING *`,
//       [memberId, trainerId, dayOfWeek, timeSlot]
//     );

//     return NextResponse.json(rows[0], { status: 201 });
//   } catch (error: any) {
//     console.error('Error creating member schedule:', error);
//     if (error.code === '23503') { // foreign_key_violation
//       return NextResponse.json({ message: 'Invalid Trainer ID.' }, { status: 400 });
//     }
//     return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
//   }
// }

        // src/app/api/member-schedules/route.ts
        import { pool } from '../../../lib/db';
        import { NextResponse, NextRequest } from 'next/server';
        import { verifyAuth } from '../../../lib/auth';

        // Helper to get MemberID from user email
        async function getMemberIdByEmail(email: string): Promise<number | null> {
          const { rows } = await pool.query('SELECT "MemberID" FROM Member WHERE Email = $1', [email]);
          return rows.length > 0 ? rows[0].MemberID : null;
        }

        // GET: Fetch schedules for the logged-in member
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

            // Using double quotes for PascalCase column names to match DB
            const { rows } = await pool.query(
              'SELECT "ScheduleID", "MemberID", "TrainerID", "DayOfWeek", "TimeSlot" FROM Schedule WHERE "MemberID" = $1 ORDER BY "DayOfWeek", "TimeSlot"',
              [memberId]
            );
            return NextResponse.json(rows, { status: 200 });
          } catch (error: any) {
            console.error('Error fetching member schedules:', error);
            return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
          }
        }

        // POST: Create a new schedule for the logged-in member
        export async function POST(request: NextRequest) {
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

            const { trainerId, dayOfWeek, timeSlot } = await request.json();

            if (!dayOfWeek || !timeSlot) {
              return NextResponse.json({ message: 'Day of Week and Time Slot are required.' }, { status: 400 });
            }

            // Using double quotes for PascalCase column names to match DB
            const { rows } = await pool.query(
              `INSERT INTO Schedule ("MemberID", "TrainerID", "DayOfWeek", "TimeSlot")
               VALUES ($1, $2, $3, $4) RETURNING *`,
              [memberId, trainerId, dayOfWeek, timeSlot]
            );

            return NextResponse.json(rows[0], { status: 201 });
          } catch (error: any) {
            console.error('Error creating member schedule:', error);
            if (error.code === '23503') { // foreign_key_violation
              return NextResponse.json({ message: 'Invalid Trainer ID.' }, { status: 400 });
            }
            return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
          }
        }

        // DELETE: Delete a schedule for the logged-in member
        export async function DELETE(request: NextRequest) {
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

            const { scheduleId } = await request.json(); // Expecting scheduleId in body

            if (!scheduleId) {
              return NextResponse.json({ message: 'Schedule ID is required for deletion.' }, { status: 400 });
            }

            // Ensure the schedule belongs to the authenticated member before deleting
            const { rowCount } = await pool.query(
              'DELETE FROM Schedule WHERE "ScheduleID" = $1 AND "MemberID" = $2',
              [scheduleId, memberId]
            );

            if (rowCount === 0) {
              return NextResponse.json({ message: 'Schedule not found or does not belong to this member.' }, { status: 404 });
            }

            return NextResponse.json({ message: 'Schedule deleted successfully.' }, { status: 200 });
          } catch (error: any) {
            console.error('Error deleting member schedule:', error);
            return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
          }
        }
        