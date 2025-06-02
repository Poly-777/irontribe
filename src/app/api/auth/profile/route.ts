// import { pool } from '../../../lib/db'; // Adjust path as needed for your db.ts
// import { NextResponse, NextRequest } from 'next/server';
// import { verifyAuth } from '../../../lib/auth'; // Your authentication helper

// // Helper to get MemberID from user email
// async function getMemberIdByEmail(email: string): Promise<number | null> {
//   // Changed "MemberID" to memberid and "Email" to email (lowercase, no quotes)
//   const { rows } = await pool.query('SELECT MemberID FROM member WHERE email = $1', [email]);
//   return rows.length > 0 ? rows[0].MemberID : null;
// }

// // GET: Fetch member profile data
// export async function GET(request: NextRequest) {
//   const authResult = await verifyAuth(request);
//   if (authResult instanceof NextResponse) {
//     return authResult; // Return authentication error response
//   }
//   const { user } = authResult; // user object contains { userId, email, role } from JWT
//   console.log('Authenticated user:', user); // DEBUG: Log authenticated user info

//   try {
//     // Attempt to find the member profile using the email from the authenticated user
//     // Changed all column names and table name to lowercase, no quotes
//     const { rows } = await pool.query(
//       `SELECT MemberID, Name, Age, Sex, Height, Weight, BodyShape, Notes, Address, PhotoURL, JoinDate
//        FROM member
//        WHERE MemberID = $1`,
//       [user.MemberID]
//     );

//     // if (rows.length === 0) {
//     //   // If no member profile exists, return a "new member" placeholder.
//     //   // The frontend can then decide to show a form to create a new profile.
//     //   console.log(`No existing profile found for email: ${user.email}. Returning placeholder for new member.`);
//     //   return NextResponse.json({
//     //     MemberID: user.id || null, // Use userId from JWT or null if not available
//     //     Name: user.name, // Default name from email part
//     //     Age: '',
//     //     Sex: '',
//     //     Height: '',
//     //     Weight: '',
//     //     BodyShape: '',
//     //     Notes: new Date().toISOString().split('T')[0], // Current date
//     //     Address: 'Pending',
//     //     PhotoURL: '', // Placeholder for photo URL
//     //     JoinDate: '' // Placeholder for join date
//     //   }, { status: 200 });
//     // }

//     // Return the fetched profile data
//     console.log(`Profile data fetched successfully for email: ${user.email}`);
//     return NextResponse.json(rows[0], { status: 200 });

//   } catch (error: any) {
//     console.error('Error fetching member profile:', error);
//     return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
//   }
// }
// //user.email.split('@')[0] || '', // Default name from email part



// // POST: Create or Update member profile data
// export async function POST(request: NextRequest) {
//   const authResult = await verifyAuth(request);
//   const user = authResult;
//   const data = await request.json();
//   console.log('Authenticated user:', user); // DEBUG: Log authenticated user info
//   console.log('Request data:', data); // DEBUG: Log incoming request data
//   // if (authResult instanceof NextResponse) {
//   //   return authResult; // Return authentication error response
//   // }
//   // const { user } = authResult; // user object contains { userId, email, role } from JWT

//   // try {
//   //   const {
//   //     memberid, // Will be null for new members, populated for existing ones
//   //     name,
//   //     email, // This 'email' should match user.email from JWT for security
//   //     phone,
//   //     address,
//   //     dob,
//   //     gender,
//   //     joindate,
//   //     membershipstatus,
//   //     termsaccepted,
//   //     isNewMember // Flag from frontend to indicate if it's a new profile creation
//   //   } = await request.json();

//   //   // Basic validation
//   //   if (!name || !email || !phone || !dob || !gender) {
//   //     return NextResponse.json({ message: 'Name, Email, Phone, Date of Birth, and Gender are required.' }, { status: 400 });
//   //   }
//   //   if (email !== user.email) {
//   //     return NextResponse.json({ message: 'Email mismatch. Cannot update another user\'s profile.' }, { status: 403 });
//   //   }
//   //   if (!termsaccepted) {
//   //       return NextResponse.json({ message: 'Terms and Conditions must be accepted.' }, { status: 400 });
//   //   }

//   //   let result;
//   //   const client = await pool.connect(); // Get a client from the pool

//   //   try {
//   //     await client.query('BEGIN'); // Start transaction

//   //     if (memberid && !isNewMember) {
//   //       // UPDATE existing member profile
//   //       console.log(`Attempting to update profile for memberID: ${memberid}, email: ${email}`);
//   //       // Changed all column names and table name to lowercase, no quotes
//   //       const updateQuery = `
//   //         UPDATE member
//   //         SET
//   //           name = $1,
//   //           phone = $2,
//   //           address = $3,
//   //           dob = $4,
//   //           gender = $5,
//   //           joindate = $6,
//   //           membershipstatus = $7,
//   //           termsaccepted = $8
//   //         WHERE memberid = $9 AND email = $10
//   //         RETURNING *`; // RETURNING * allows us to send back the updated row

//   //       const updateRes = await client.query(updateQuery, [
//   //         name, phone, address, dob, gender, joindate, membershipstatus, termsaccepted,
//   //         memberid, email
//   //       ]);

//   //       if (updateRes.rows.length === 0) {
//   //         throw new Error('Profile not found or you do not have permission to update it.');
//   //       }
//   //       result = updateRes.rows[0];
//   //       console.log('Profile updated successfully.');

//   //     } else {
//   //       // INSERT new member profile
//   //       console.log(`Attempting to create new profile for email: ${email}`);
//   //       // Ensure that a member with this email doesn't already exist to prevent duplicates
//   //       // Changed "MemberID" to memberid and "Email" to email (lowercase, no quotes)
//   //       const existingMember = await client.query('SELECT memberid FROM member WHERE email = $1', [email]);
//   //       if (existingMember.rows.length > 0) {
//   //           throw new Error('A profile for this email already exists.');
//   //       }

//   //       // Changed all column names and table name to lowercase, no quotes
//   //       const insertQuery = `
//   //         INSERT INTO member (
//   //           name, email, phone, address, dob, gender, joindate, membershipstatus, termsaccepted
//   //         )
//   //         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
//   //         RETURNING *`; // RETURNING * allows us to send back the newly created row

//   //       const insertRes = await client.query(insertQuery, [
//   //         name, email, phone, address, dob, gender, joindate, membershipstatus, termsaccepted
//   //       ]);
//   //       result = insertRes.rows[0];
//   //       console.log('New profile created successfully.');
//   //     }

//   //     await client.query('COMMIT'); // Commit transaction

//   //     // Reformat dates to YYYY-MM-DD before sending back to frontend
//   //     // Ensure column names from DB result are accessed in lowercase
//   //     const formattedResult = {
//   //       ...result,
//   //       memberid: result.memberid, // Access as lowercase
//   //       name: result.name,
//   //       email: result.email,
//   //       phone: result.phone,
//   //       address: result.address,
//   //       dob: result.dob ? new Date(result.dob).toISOString().split('T')[0] : null, // Access as lowercase
//   //       gender: result.gender,
//   //       joindate: result.joindate ? new Date(result.joindate).toISOString().split('T')[0] : null, // Access as lowercase
//   //       membershipstatus: result.membershipstatus,
//   //       termsaccepted: result.termsaccepted,
//   //     };

//   //     return NextResponse.json(formattedResult, { status: 200 });

//   //   } catch (dbError: any) {
//   //     await client.query('ROLLBACK'); // Rollback transaction on error
//   //     console.error('Database transaction failed:', dbError);
//   //     // Check for unique constraint violation (e.g., if email already exists during insert)
//   //     if (dbError.code === '23505') { // unique_violation
//   //       return NextResponse.json({ message: 'A profile with this email already exists.' }, { status: 409 });
//   //     }
//   //     throw dbError; // Re-throw to be caught by outer catch
//   //   } finally {
//   //     client.release(); // Release the client back to the pool
//   //   }

//   // } catch (error: any) {
//   //   console.error('Error saving member profile:', error);
//   //   return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
//   // }
// }

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { pool } from "../../../lib/db";

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET ;

export async function GET(req: NextRequest) {
  try {
    // Get token from cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("session_user")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      emailid: string;
      name: string;
    };
    // console.log("Decoded JWT:", decoded); // DEBUG: Log decoded JWT

    // Fetch member details from Member table using user id
    const result = await pool.query(`
      SELECT 
        m.Name, m.Age, m.Sex, m.Height, m.Weight, 
        m.BodyShape, m.Notes, m.Address, m.PhotoURL 
      FROM Member m
      WHERE m.MemberID = $1
    `, [decoded.id]);

    const member = result.rows[0];
    // console.log("Fetched member profile:", member); // DEBUG: Log fetched member profile

    if (!member) {
      return NextResponse.json({ message: "Member profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: member.name,
      age: member.age || null,
      sex: member.sex || null,
      height: member.height || null,
      weight: member.weight || null,
      bodyshape: member.bodyshape || null,
      notes: member.notes || null,
      address: member.address || null,
      profileImageURL: member.photourl || null,
    });

  } catch (error: any) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ message: "Error fetching profile" }, { status: 500 });
  }
}



// POST:update member profile
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_user")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
    };

    const {
      name, age, sex, height, weight,
      bodyShape, notes, address, profileImageURL
    } = await req.json();

    // UPSERT logic
    await pool.query(
      `INSERT INTO Member (MemberID, Name, Age, Sex, Height, Weight, BodyShape, Notes, Address, PhotoURL)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (MemberID) DO UPDATE SET
         Name = EXCLUDED.Name,
         Age = EXCLUDED.Age,
         Sex = EXCLUDED.Sex,
         Height = EXCLUDED.Height,
         Weight = EXCLUDED.Weight,
         BodyShape = EXCLUDED.BodyShape,
         Notes = EXCLUDED.Notes,
         Address = EXCLUDED.Address,
         PhotoURL = EXCLUDED.PhotoURL`,
      [decoded.id, name, age, sex, height, weight, bodyShape, notes, address, profileImageURL || null]
    );

    return NextResponse.json({ message: "Profile saved successfully" });
  } catch (error: any) {
    console.error("Profile save error:", error);
    return NextResponse.json({ message: "Error saving profile" }, { status: 500 });
  }
}
