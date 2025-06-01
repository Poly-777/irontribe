// src/app/api/signup/route.ts
import { pool } from "../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // Ensure you use bcryptjs for consistency with login API
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

// Session inactivity duration in seconds (must match login API and frontend)
const SESSION_INACTIVITY_DURATION = 20 * 60; // 20 minutes

// GET all users (remains unchanged)
export async function GET() {
  const result = await pool.query("SELECT id, name, mobile, emailid, created_at FROM users ORDER BY created_at DESC");
  return NextResponse.json(result.rows);
}

// POST new user
export async function POST(request: NextRequest) {
  const client = await pool.connect(); // Get a client from the pool for transaction

  try {
    await client.query('BEGIN'); // Start transaction

    const { name, mobile, emailid, password } = await request.json();

    if (!name || !mobile || !emailid || !password) {
      await client.query('ROLLBACK');
      return NextResponse.json({ message: "Missing required fields: name, mobile, email, password." }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultRole = 'member'; // Default role for new signups in JWT

    // 1. Insert new user into the users table (without 'role' column)
    const userInsertResult = await client.query(
      `
      INSERT INTO users (name, mobile, emailid, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, mobile, emailid, created_at
      `,
      [name, mobile, emailid, hashedPassword]
    );

    const newUser = userInsertResult.rows[0];
    const newUserId = newUser.id;

    // 2. Create a corresponding entry in the Member table
    // MemberID is now directly linked to users.id
    // Removed 'Email' column as it's not in your Member table schema
    const memberInsertResult = await client.query(
      `
    
        INSERT INTO Member (MemberID, Name, Age, Sex, Height, Weight, BodyShape, Notes, Address, PhotoURL, JoinDate)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
      `,
      [
        newUserId, // MemberID is the same as users.id
        name, // Use the same name as in users table
        null, // Age (null initially) 
        null,      // Sex (null initially) 
        null,      // Height (null initially) 
        null,      // Weight (null initially) 
        null,      // BodyShape (null initially) 
        null,      // Notes (null initially)
        null,      // Address (null initially) 
        '/person.jpg', // Default PhotoURL 
        null,      // JoinDate (null initially) 
      ]
    );

    await client.query('COMMIT'); // Commit transaction if both inserts succeed

    // Ensure JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables.');
      return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
    }

    // Generate JWT for the newly registered user
    const token = jwt.sign(
      { userId: newUserId, email: newUser.emailid, role: defaultRole }, // Use defaultRole for JWT
      process.env.JWT_SECRET as string,
      { expiresIn: SESSION_INACTIVITY_DURATION }
    );

    // Set the JWT in an HttpOnly cookie
    const cookie = serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: SESSION_INACTIVITY_DURATION,
      path: '/',
      sameSite: 'lax',
    });

    console.log('User registered and logged in:', newUser.emailid);

    // Return success response with user data and set the cookie
    return new NextResponse(JSON.stringify({
      message: 'Registration successful. You are now logged in.',
      user: { id: newUser.id, name: newUser.name, email: newUser.emailid, role: defaultRole },
    }), {
      status: 201,
      headers: { 'Set-Cookie': cookie },
    });

  } catch (error: any) {
    await client.query('ROLLBACK'); // Rollback transaction on any error
    console.error("❌ Error creating user or member profile:", error);

    // Handle unique constraint violation (duplicate email)
    if (error.code === '23505' && error.constraint === 'users_emailid_key') {
      return NextResponse.json({ message: 'Email already registered. Please use a different email or log in.' }, { status: 409 });
    }
    if (error.code === '23505' && error.constraint === 'member_pkey') { // If MemberID (PK) already exists
      return NextResponse.json({ message: 'A member profile already exists for this user ID.' }, { status: 409 });
    }

    return NextResponse.json({ message: "Internal Server Error", details: error.message }, { status: 500 });
  } finally {
    client.release(); // Release the client back to the pool
  }
}
