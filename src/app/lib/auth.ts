// src/lib/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'; // For App Router server components/route handlers

// Define the structure of your JWT payload
export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
  // You can add other standard claims like 'iat' (issued at) or 'exp' (expiration time)
  // For example, exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiration
}

// --- Function to CREATE a JWT ---
/**
 * Creates a JWT for a given user payload.
 * This would typically be called after a successful login.
 * @param payload - The user data to include in the token.
 * @param expiresIn - Optional. Token expiration time (e.g., '1h', '7d'). Defaults to '1h'.
 * @returns The generated JWT string.
 * @throws Error if JWT_SECRET is not defined or if signing fails.
 */
export function createAuthToken(payload: Omit<JwtPayload, 'exp' | 'iat'>, expiresIn: string = '1h'): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('JWT_SECRET is not defined in environment variables.');
    throw new Error('Authentication configuration error.'); // Or handle more gracefully
  }

  // Prepare the payload for the token
  // You might want to add 'iat' (issued at) or ensure 'exp' is handled if not in payload
  const tokenPayload: JwtPayload = {
    ...payload,
    // exp: Math.floor(Date.now() / 1000) + (60 * 60), // Example: 1 hour from now
    // iat: Math.floor(Date.now() / 1000), // Example: Issued at current time
  };

  try {
    // Sign the token
    const token = jwt.sign(tokenPayload, secret, { expiresIn });
    return token;
  } catch (error) {
    console.error('JWT signing failed:', error);
    throw new Error('Failed to create authentication token.');
  }
}

// --- Your existing function to VERIFY a JWT ---
/**
 * Verifies the authentication token from cookies.
 * @param request - The NextRequest object.
 * @returns An object with the decoded user payload or a NextResponse for unauthorized access.
 */
export async function verifyAuth(request: NextRequest): Promise<{ user: JwtPayload } | NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized: No token provided.' }, { status: 401 });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET is not defined in environment variables for verification.');
    // It's crucial to handle this case, perhaps by denying access.
    return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, secret) as JwtPayload;
    // You might want to add more checks here, e.g., if the token structure is as expected
    return { user: decoded };
  } catch (error: any) {
    console.error('JWT verification failed:', error.message);
    // Handle different JWT errors specifically if needed (e.g., TokenExpiredError, JsonWebTokenError)
    if (error.name === 'TokenExpiredError') {
        return NextResponse.json({ message: 'Unauthorized: Token has expired.' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Unauthorized: Invalid token.' }, { status: 401 });
  }
}

// --- Example of how you might use createAuthToken in an API route (e.g., /api/login) ---
/*
// In your /api/login.ts or similar route handler:

import { NextRequest, NextResponse } from 'next/server';
import { createAuthToken } from '@/lib/auth'; // Adjust path as needed
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password }_ = body; // Underscore to avoid unused var warning if not used

    // 1. Authenticate the user (e.g., check credentials against a database)
    //    This is a placeholder for your actual authentication logic.
    const user = await authenticateUser(email, password); // Assume this function exists

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // 2. If authentication is successful, create the JWT payload
    const tokenPayload = {
      userId: user.id, // Assuming your user object has an id
      email: user.email,
      role: user.role, // Assuming your user object has a role
    };

    // 3. Create the JWT
    const token = createAuthToken(tokenPayload, '7d'); // Token expires in 7 days

    // 4. Set the token in an HTTP-Only cookie
    const cookieStore = cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true, // Important for security: prevents client-side JS access
      secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
      path: '/', // Available on all paths
      sameSite: 'lax', // Or 'strict' for better CSRF protection
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds (matches token expiry)
    });

    return NextResponse.json({ message: 'Login successful', user: tokenPayload }, { status: 200 });

  } catch (error: any) {
    console.error('Login error:', error);
    if (error.message === 'Authentication configuration error.' || error.message === 'Failed to create authentication token.') {
        return NextResponse.json({ message: 'Server error during authentication.' }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}

// Placeholder for your actual user authentication logic
async function authenticateUser(email, password) {
  // Replace this with your database lookup and password verification
  console.log(`Attempting to authenticate: ${email}`);
  if (email === "test@example.com" && password === "password123") {
    return { id: 1, email: "test@example.com", role: "user" };
  }
  return null;
}
*/
