// import { pool } from "../../../lib/db";
// import { NextRequest, NextResponse } from "next/server";
// import bcrypt from "bcrypt";
// import { cookies } from "next/headers";

// export async function POST(req: NextRequest) {
//   const { emailid, password } = await req.json();

//   const result = await pool.query(`SELECT * FROM users WHERE emailid = $1`, [emailid]);
//   const user = result.rows[0];

//   if (!user) {
//     return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
//   }

//   const match = await bcrypt.compare(password, user.password);
//   if (!match) {
//     return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
//   }

//   // Set secure cookie
//   (await
//         // Set secure cookie
//         cookies()).set("session_user", user.emailid, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     maxAge: 60 * 60 * 24, // 1 day
//     path: "/",
//   });

//   return NextResponse.json({ message: "Login successful" }, { status: 200 });
// }


// // src/app/api/login/route.ts
// import { pool } from '../../../lib/db'; // Adjust path as needed
// import { NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { serialize } from 'cookie'; // Import serialize from 'cookie'

// export async function POST(request: Request) {
//   try {
//     const { email: emailid, password } = await request.json();

//     if (!emailid || !password) {
//       return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
//     }

//     // 1. Find the user by email
//     const { rows } = await pool.query(
//       'SELECT id, emailid, password_hash, role FROM users WHERE email = $1',
//       [emailid]
//     );

//     if (rows.length === 0) {
//       return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
//     }

//     const user = rows[0];

//     // 2. Compare the provided password with the hashed password
//     const isPasswordValid = await bcrypt.compare(password, user.password_hash);

//     if (!isPasswordValid) {
//       return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
//     }

//     // Ensure JWT_SECRET is defined
//     if (!process.env.JWT_SECRET) {
//       console.error('JWT_SECRET is not defined in environment variables.');
//       return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
//     }

//     // 3. Generate JWT
//     const token = jwt.sign(
//       { userId: user.id, email: user.email, role: user.role },
//       process.env.JWT_SECRET as string, // Cast to string, as we checked for its existence
//       { expiresIn: '1h' } // Token expires in 1 hour
//     );

//     // 4. Set the JWT in an HttpOnly cookie
//     const cookie = serialize('auth_token', token, {
//       httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
//       secure: process.env.NODE_ENV === 'production', // Use secure in production (requires HTTPS)
//       maxAge: 60 * 60, // 1 hour (same as token expiry)
//       path: '/', // The cookie is valid for all paths
//       sameSite: 'lax', // Protects against CSRF attacks
//     });

//     // 5. Respond with success and the user's role (for client-side redirection logic)
//     return new NextResponse(JSON.stringify({
//       message: 'Login successful',
//       user: { id: user.id, email: user.email, role: user.role },
//     }), {
//       status: 200,
//       headers: { 'Set-Cookie': cookie }, // Set the cookie in the response headers
//     });

//   } catch (error: any) {
//     console.error('Login error:', error);
//     return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
//   }
// }


// src/app/api/login/route.ts
import { pool } from '../../../lib/db'; // Adjust path as needed
import { NextResponse, NextRequest } from 'next/server'; // Import NextRequest
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie'; // Import serialize from 'cookie'
import { verifyAuth } from '../../../lib/auth'; // Import the auth helper

export async function POST(request: Request) {
  try {
    // Changed 'emailid' to 'email' to match the key sent by the frontend
    const { email, password } = await request.json();

    console.log('Login attempt for email:', email); // DEBUG 1

    if (!email || !password) {
      console.log('Missing email or password.'); // DEBUG 2
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    // 1. Find the user by emailid (matching DB schema)
    // Changed 'emailid' to 'email' in the query parameter to match the destructured variable
    const { rows } = await pool.query(
      'SELECT id, emailid, password FROM users WHERE emailid = $1',
      [email] // Use 'email' here, which now holds the value from the frontend's 'email' key
    );

    if (rows.length === 0) {
      console.log('User not found for email:', email); // DEBUG 3
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const user = rows[0];
    // console.log('User found:', user.emailid, 'Role:', user.role); // DEBUG 4
    console.log('Stored hashed password (from "password" column):', user.password); // DEBUG 5: Check if hash is present and looks valid

    // 2. Compare the provided password with the hashed password (using 'password' column)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('Password comparison failed for user:', user.emailid); // DEBUG 6
      // You can also log the plain password here for debugging ONLY, but remove in production!
      // console.log('Provided password (DEBUG ONLY):', password);
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    console.log('Password comparison successful for user:', user.emailid); // DEBUG 7

    // Ensure JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables.');
      return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
    }

    // 3. Generate JWT
    // Changed 'email' to 'emailid' in JWT payload (user.emailid comes from DB row)
    const token = jwt.sign(
      { userId: user.id, email: user.emailid, role: user.role ="admin" },
      process.env.JWT_SECRET as string, // Cast to string, as we checked for its existence
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // 4. Set the JWT in an HttpOnly cookie
    const cookie = serialize('auth_token', token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Use secure in production (requires HTTPS)
      maxAge: 60 * 60, // 1 hour (same as token expiry)
      path: '/', // The cookie is valid for all paths
      sameSite: 'lax', // Protects against CSRF attacks
    });

    console.log('Login successful, setting cookie for user:', user.emailid); // DEBUG 8

    // 5. Respond with success and the user's role (for client-side redirection logic)
    // Changed 'email' to 'emailid' in response user object
    return new NextResponse(JSON.stringify({
      message: 'Login successful',
      user: { id: user.id, email: user.emailid, role: user.role },
    }), {
      status: 200,
      headers: { 'Set-Cookie': cookie }, // Set the cookie in the response headers
    });

  } catch (error: any) {
    console.error('Login API caught an unexpected error:', error); // DEBUG 9: Catch all unexpected errors
    return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

// GET: Verify authentication status and return user info
export async function GET(request: NextRequest) {
  const authResult = await verifyAuth(request);

  if (authResult instanceof NextResponse) {
    // If verifyAuth returns a NextResponse, it means authentication failed
    return authResult;
  }

  // If verifyAuth returns a user object, authentication was successful
  const { user } = authResult;
  return NextResponse.json({
    isAuthenticated: true,
    user: {
      userId: user.userId,
      email: user.email, // This 'user.email' comes from the JWT payload, which was set as 'emailid'
      role: user.role,
    },
  }, { status: 200 });
}


