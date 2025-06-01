// // src/app/api/auth/members/route.ts
// import { pool } from '../../../lib/db'; // Adjust path based on src/app/api/auth/members
// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const {
//       userId,
//       name,
//       email,
//       phone,
//       address,
//       dob,
//       gender,
//       termsAccepted,
//     } = body;

//     // Basic server-side validation
//     if (!userId || !name || !email || !phone || !dob || !gender || termsAccepted === undefined) {
//       return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
//     }

//     // Insert the new member into the 'members' table
//     const { rows } = await pool.query(
//       `INSERT INTO member (
//         user_id,
//         name,
//         email,
//         phone,
//         address,
//         dob,
//         gender,
//         terms_accepted,
//         membership_status,
//         join_date
//       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_DATE)
//       RETURNING *`, // Return all columns of the newly inserted row
//       [
//         userId,
//         name,
//         email,
//         phone,
//         address,
//         dob, // Ensure DOB is in 'YYYY-MM-DD' format from the frontend
//         gender,
//         termsAccepted,
//         'Active' // Default status, adjust as per your business logic
//       ]
//     );

//     // Respond with the newly created member data
//     return NextResponse.json(rows[0], { status: 201 });

//   } catch (error: any) {
//     console.error('Error creating member:', error);

//     // Handle specific PostgreSQL errors, e.g., unique constraint violation for user_id
//     if (error.code === '23505') { // unique_violation
//       return NextResponse.json({ message: 'A membership profile already exists for this user.' }, { status: 409 });
//     }

//     return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
//   }
// }

// // Add other methods if you need them, e.g., GET for fetching member data

// export async function GET(request: Request) {
//   // Example: if you need to fetch a member by user_id
//   const url = new URL(request.url);
//   const userId = url.searchParams.get('userId'); // Assuming userId is passed as a query param

//   if (!userId) {
//     return NextResponse.json({ message: 'User ID is required.' }, { status: 400 });
//   }

//   try {
//     const { rows } = await pool.query('SELECT * FROM members WHERE user_id = $1', [userId]);
//     if (rows.length === 0) {
//       return NextResponse.json({ message: 'Member not found.' }, { status: 404 });
//     }
//     return NextResponse.json(rows[0], { status: 200 });
//   } catch (error: any) {
//     console.error('Error fetching member:', error);
//     return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
//   }
// }


// src/app/api/auth/members/route.ts
import { pool } from '../../../lib/db'; // Adjust path based on src/app/api/auth/members
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      // userId, // Removed as per new Member schema (no user_id column)
      name,
      email,
      phone,
      address,
      dob,
      gender,
      termsAccepted,
    } = body;

    // Basic server-side validation
    if (!name || !email || !phone || !dob || !gender || termsAccepted === undefined) {
      return NextResponse.json({ message: 'All fields (Name, Email, Phone, Address, DOB, Gender, Terms Accepted) are required.' }, { status: 400 });
    }

    // Insert the new member into the 'Member' table using the provided schema
    // Note: Using snake_case for column names in the query for PostgreSQL convention,
    // even if diagram uses PascalCase. Table name 'Member' is used as provided.
    const { rows } = await pool.query(
      `INSERT INTO Member (
        Name,
        Email,
        Phone,
        Address,
        DOB,
        Gender,
        JoinDate,
        MembershipStatus,
        TermsAccepted
      ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE, $7, $8)
      RETURNING *`, // Return all columns of the newly inserted row
      [
        name,
        email,
        phone,
        address,
        dob, // Ensure DOB is in 'YYYY-MM-DD' format from the frontend
        gender,
        'Active', // Default status, you can adjust this based on your business logic
        termsAccepted
      ]
    );

    // Respond with the newly created member data
    return NextResponse.json(rows[0], { status: 201 });

  } catch (error: any) {
    console.error('Error creating member:', error);

    // Handle specific PostgreSQL errors, e.g., unique constraint violation for Email
    if (error.code === '23505') { // unique_violation
      return NextResponse.json({ message: 'A member with this email already exists.' }, { status: 409 });
    }

    return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

// You can add other methods like GET, PUT, DELETE if needed for Member operations

export async function GET(request: Request) {
  // Example: Fetch a member by email or MemberID
  const url = new URL(request.url);
  const email = url.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ message: 'Email is required to fetch member.' }, { status: 400 });
  }

  try {
    const { rows } = await pool.query('SELECT * FROM Member WHERE Email = $1', [email]);
    if (rows.length === 0) {
      return NextResponse.json({ message: 'Member not found.' }, { status: 404 });
    }
    return NextResponse.json(rows[0], { status: 200 });
  } catch (error: any) {
    console.error('Error fetching member:', error);
    return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

