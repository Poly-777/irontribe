// // src/app/api/payments/route.ts
// import { pool } from '../../../lib/db';
// import { NextResponse, NextRequest } from 'next/server';
// import { verifyAuth } from '../../../lib/auth';

// // Helper to get MemberID from user email
// async function getMemberIdByEmail(email: string): Promise<number | null> {
//   const { rows } = await pool.query('SELECT "MemberID" FROM Member WHERE Email = $1', [email]);
//   return rows.length > 0 ? rows[0].MemberID : null;
// }

// // GET: Fetch payment history for the logged-in member
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
//       'SELECT * FROM Payment WHERE "MemberID" = $1 ORDER BY "PaymentDate" DESC',
//       [memberId]
//     );
//     return NextResponse.json(rows, { status: 200 });
//   } catch (error: any) {
//     console.error('Error fetching payments:', error);
//     return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
//   }
// }

// // POST: Add a new payment for the logged-in member
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

//     const { amount, dueDate, paymentStatus, planId } = await request.json();

//     if (!amount || !paymentStatus) {
//       return NextResponse.json({ message: 'Amount and Payment Status are required.' }, { status: 400 });
//     }

//     const { rows } = await pool.query(
//       `INSERT INTO Payment ("MemberID", "Amount", "PaymentDate", "DueDate", "PaymentStatus", "PlanID")
//        VALUES ($1, $2, CURRENT_DATE, $3, $4, $5) RETURNING *`,
//       [memberId, amount, dueDate, paymentStatus, planId]
//     );

//     return NextResponse.json(rows[0], { status: 201 });
//   } catch (error: any) {
//     console.error('Error adding payment:', error);
//     if (error.code === '23503') { // foreign_key_violation
//       return NextResponse.json({ message: 'Invalid Plan ID.' }, { status: 400 });
//     }
//     return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
//   }
// }


// src/app/api/payments/route.ts
import { pool } from '../../../lib/db';
import { NextResponse, NextRequest } from 'next/server';
import { verifyAuth } from '../../../lib/auth';

// Helper to get MemberID from user email
async function getMemberIdByEmail(email: string): Promise<number | null> {
  // Use lowercase 'memberid' and 'email' for column names
  const { rows } = await pool.query('SELECT memberid FROM member WHERE email = $1', [email]);
  return rows.length > 0 ? rows[0].memberid : null;
}

// GET: Fetch payment history for the logged-in member
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

    // Use lowercase column names in the SELECT query, including 'planid' and 'paymentmethod'
    const { rows } = await pool.query(
      'SELECT paymentid, memberid, amount, TO_CHAR(paymentdate, \'YYYY-MM-DD\') as paymentdate, TO_CHAR(duedate, \'YYYY-MM-DD\') as duedate, paymentstatus, planid, paymentmethod FROM payment WHERE memberid = $1 ORDER BY paymentdate DESC',
      [memberId]
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

// POST: Add a new payment for the logged-in member
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

    // Destructure 'paymentMethod' as well
    const { amount, dueDate, paymentStatus, planId: PlanID, paymentMethod } = await request.json();

    if (!amount || !paymentStatus || !paymentMethod) { // Validate paymentMethod
      return NextResponse.json({ message: 'Amount, Payment Status, and Payment Method are required.' }, { status: 400 });
    }

    // Use lowercase column names in the INSERT query, including 'planid' and 'paymentmethod'
    const { rows } = await pool.query(
      `INSERT INTO payment (memberid, amount, paymentdate, duedate, paymentstatus, planid, paymentmethod)
       VALUES ($1, $2, CURRENT_DATE, $3, $4, $5, $6) RETURNING *`,
      [memberId, amount, dueDate, paymentStatus, PlanID, paymentMethod] // Pass paymentMethod to the query
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Error adding payment:', error);
    if (error.code === '23503') { // foreign_key_violation
      return NextResponse.json({ message: 'Invalid Plan ID.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
