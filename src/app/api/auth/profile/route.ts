// // src/app/api/profile/route.ts
// import { pool } from '../../../lib/db';
// import { NextResponse, NextRequest } from 'next/server';
// // Update the import path below if your auth helper is in a different location
// import { verifyAuth } from '../../../lib/auth'; // Import the auth helper


// // GET: Fetch logged-in user's profile (Member data)
// export async function GET(request: NextRequest) {
//   const authResult = await verifyAuth(request);
//   if (authResult instanceof NextResponse) {
//     return authResult; // Return unauthorized response if token is invalid
//   }
//   const { user } = authResult;

//   try {
//     // Try to find the member by the email from the authenticated user
//     const { rows } = await pool.query('SELECT * FROM Member WHERE Email = $1', [user.email]);

//     if (rows.length === 0) {
//       // If no member profile exists, return basic user info
//       return NextResponse.json({
//         message: 'Member profile not found, providing basic user info.',
//         email: user.email,
//         name: null, // Placeholder, as name might not be in users table
//         phone: null,
//         address: null,
//         dob: null,
//         gender: null,
//         joindate: null,
//         membershipstatus: 'Pending',
//         termsaccepted: false,
//         isNewMember: true // Indicate that this is a new member profile to be created
//       }, { status: 200 });
//     }

//     return NextResponse.json(rows[0], { status: 200 });
//   } catch (error: any) {
//     console.error('Error fetching profile:', error);
//     return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
//   }
// }

// // POST: Create or Update Member profile
// export async function POST(request: NextRequest) {
//   const authResult = await verifyAuth(request);
//   if (authResult instanceof NextResponse) {
//     return authResult;
//   }
//   const { user } = authResult;
//   console.log('Authenticated user:', user); // DEBUG: Log authenticated user info

//   try {
//     const {
//       name,
//       email, // This should match the authenticated user's email
//       phone,
//       address,
//       dob,
//       gender,
//       membershipstatus,
//       termsAccepted,
//       memberId // Optional: if updating an existing member
//     } = await request.json();

//     // Basic validation
//     if (!name || !email || !phone || !dob || !gender || termsAccepted === undefined) {
//       return NextResponse.json({ message: 'All required profile fields must be provided.' }, { status: 400 });
//     }

//     // Ensure the submitted email matches the authenticated user's email
//     if (email !== user.email) {
//       return NextResponse.json({ message: 'Submitted email must match authenticated user email.' }, { status: 403 });
//     }

//     let result;
//     if (memberId) {
//       // Update existing member
//       result = await pool.query(
//         `UPDATE Member
//          SET Name = $1, Phone = $2, Address = $3, DOB = $4, Gender = $5, MembershipStatus = $6, TermsAccepted = $7
//          WHERE MemberID = $8 AND Email = $9 RETURNING *`,
//         [name, phone, address, dob, gender, membershipstatus, termsAccepted, memberId, email]
//       );
//       if (result.rowCount === 0) {
//         return NextResponse.json({ message: 'Member not found or email mismatch.' }, { status: 404 });
//       }
//     } else {
//       // Create new member (only if one doesn't exist for this email)
//       const existingMember = await pool.query('SELECT "MemberID" FROM Member WHERE Email = $1', [email]);
//       if (existingMember.rows.length > 0) {
//         return NextResponse.json({ message: 'A member profile already exists for this email.' }, { status: 409 });
//       }

//       result = await pool.query(
//         `INSERT INTO Member (Name, Email, Phone, Address, DOB, Gender, JoinDate, MembershipStatus, TermsAccepted)
//          VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE, $7, $8) RETURNING *`,
//         [name, email, phone, address, dob, gender, membershipstatus, termsAccepted]
//       );
//     }

//     return NextResponse.json(result.rows[0], { status: memberId ? 200 : 201 });

//   } catch (error: any) {
//     console.error('Error updating/creating profile:', error);
//     if (error.code === '23505') { // Unique violation for email
//       return NextResponse.json({ message: 'A member with this email already exists.' }, { status: 409 });
//     }
//     return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
//   }
// }


// src/app/api/profile/route.ts
import { pool } from '../../../lib/db'; // Adjust path as needed for your db.ts
import { NextResponse, NextRequest } from 'next/server';
import { verifyAuth } from '../../../lib/auth'; // Your authentication helper

// Helper to get MemberID from user email
async function getMemberIdByEmail(email: string): Promise<number | null> {
  // Changed "MemberID" to memberid and "Email" to email (lowercase, no quotes)
  const { rows } = await pool.query('SELECT memberid FROM member WHERE email = $1', [email]);
  return rows.length > 0 ? rows[0].memberid : null;
}

// GET: Fetch member profile data
export async function GET(request: NextRequest) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult; // Return authentication error response
  }
  const { user } = authResult; // user object contains { userId, email, role } from JWT

  try {
    // Attempt to find the member profile using the email from the authenticated user
    // Changed all column names and table name to lowercase, no quotes
    const { rows } = await pool.query(
      `SELECT
         memberid as memberid,
         name as name,
         email as email,
         phone as phone,
         address as address,
         TO_CHAR(dob, 'YYYY-MM-DD') as dob,
         gender as gender,
         TO_CHAR(joindate, 'YYYY-MM-DD') as joindate,
         membershipstatus as membershipstatus,
         termsaccepted as termsaccepted
       FROM member
       WHERE email = $1`,
      [user.email]
    );

    if (rows.length === 0) {
      // If no member profile exists, return a "new member" placeholder.
      // The frontend can then decide to show a form to create a new profile.
      console.log(`No existing profile found for email: ${user.email}. Returning placeholder for new member.`);
      return NextResponse.json({
        memberid: null,
        name: user.email.split('@')[0] || '', // Default name from email part
        email: user.email,
        phone: '',
        address: '',
        dob: '',
        gender: '',
        joindate: new Date().toISOString().split('T')[0], // Current date
        membershipstatus: 'Pending',
        termsaccepted: false,
        isNewMember: true // Flag for frontend
      }, { status: 200 });
    }

    // Return the fetched profile data
    console.log(`Profile data fetched successfully for email: ${user.email}`);
    return NextResponse.json(rows[0], { status: 200 });

  } catch (error: any) {
    console.error('Error fetching member profile:', error);
    return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

// POST: Create or Update member profile data
export async function POST(request: NextRequest) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult; // Return authentication error response
  }
  const { user } = authResult; // user object contains { userId, email, role } from JWT

  try {
    const {
      memberid, // Will be null for new members, populated for existing ones
      name,
      email, // This 'email' should match user.email from JWT for security
      phone,
      address,
      dob,
      gender,
      joindate,
      membershipstatus,
      termsaccepted,
      isNewMember // Flag from frontend to indicate if it's a new profile creation
    } = await request.json();

    // Basic validation
    if (!name || !email || !phone || !dob || !gender) {
      return NextResponse.json({ message: 'Name, Email, Phone, Date of Birth, and Gender are required.' }, { status: 400 });
    }
    if (email !== user.email) {
      return NextResponse.json({ message: 'Email mismatch. Cannot update another user\'s profile.' }, { status: 403 });
    }
    if (!termsaccepted) {
        return NextResponse.json({ message: 'Terms and Conditions must be accepted.' }, { status: 400 });
    }

    let result;
    const client = await pool.connect(); // Get a client from the pool

    try {
      await client.query('BEGIN'); // Start transaction

      if (memberid && !isNewMember) {
        // UPDATE existing member profile
        console.log(`Attempting to update profile for memberID: ${memberid}, email: ${email}`);
        // Changed all column names and table name to lowercase, no quotes
        const updateQuery = `
          UPDATE member
          SET
            name = $1,
            phone = $2,
            address = $3,
            dob = $4,
            gender = $5,
            joindate = $6,
            membershipstatus = $7,
            termsaccepted = $8
          WHERE memberid = $9 AND email = $10
          RETURNING *`; // RETURNING * allows us to send back the updated row

        const updateRes = await client.query(updateQuery, [
          name, phone, address, dob, gender, joindate, membershipstatus, termsaccepted,
          memberid, email
        ]);

        if (updateRes.rows.length === 0) {
          throw new Error('Profile not found or you do not have permission to update it.');
        }
        result = updateRes.rows[0];
        console.log('Profile updated successfully.');

      } else {
        // INSERT new member profile
        console.log(`Attempting to create new profile for email: ${email}`);
        // Ensure that a member with this email doesn't already exist to prevent duplicates
        // Changed "MemberID" to memberid and "Email" to email (lowercase, no quotes)
        const existingMember = await client.query('SELECT memberid FROM member WHERE email = $1', [email]);
        if (existingMember.rows.length > 0) {
            throw new Error('A profile for this email already exists.');
        }

        // Changed all column names and table name to lowercase, no quotes
        const insertQuery = `
          INSERT INTO member (
            name, email, phone, address, dob, gender, joindate, membershipstatus, termsaccepted
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING *`; // RETURNING * allows us to send back the newly created row

        const insertRes = await client.query(insertQuery, [
          name, email, phone, address, dob, gender, joindate, membershipstatus, termsaccepted
        ]);
        result = insertRes.rows[0];
        console.log('New profile created successfully.');
      }

      await client.query('COMMIT'); // Commit transaction

      // Reformat dates to YYYY-MM-DD before sending back to frontend
      // Ensure column names from DB result are accessed in lowercase
      const formattedResult = {
        ...result,
        memberid: result.memberid, // Access as lowercase
        name: result.name,
        email: result.email,
        phone: result.phone,
        address: result.address,
        dob: result.dob ? new Date(result.dob).toISOString().split('T')[0] : null, // Access as lowercase
        gender: result.gender,
        joindate: result.joindate ? new Date(result.joindate).toISOString().split('T')[0] : null, // Access as lowercase
        membershipstatus: result.membershipstatus,
        termsaccepted: result.termsaccepted,
      };

      return NextResponse.json(formattedResult, { status: 200 });

    } catch (dbError: any) {
      await client.query('ROLLBACK'); // Rollback transaction on error
      console.error('Database transaction failed:', dbError);
      // Check for unique constraint violation (e.g., if email already exists during insert)
      if (dbError.code === '23505') { // unique_violation
        return NextResponse.json({ message: 'A profile with this email already exists.' }, { status: 409 });
      }
      throw dbError; // Re-throw to be caught by outer catch
    } finally {
      client.release(); // Release the client back to the pool
    }

  } catch (error: any) {
    console.error('Error saving member profile:', error);
    return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
