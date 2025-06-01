// src/app/membership/page.tsx
'use client'; // Mark as a client component

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for App Router
import { Box } from '@mui/material';
// import Navbar from '../../components/navbar'; // Removed Navbar import

// Define the shape of the form data
interface FormData {
  userId: number | null; // In a real app, this would come from the session
  name: string;
  email: string;
  phone: string;
  address: string;
  dob: string; // McClellan-MM-DD format
  gender: string;
  termsAccepted: boolean;
}

export default function MembershipFormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    userId: null, // Placeholder: will be set in useEffect
    name: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
    gender: '',
    termsAccepted: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Simulate fetching user ID after login.
  // In a real app, this would be from a session, context, or `next-auth` hook.
  useEffect(() => {
    // For demonstration: Assume user ID 1 is logged in.
    // IMPORTANT: Replace with actual user ID from your authentication system (e.g., Auth0 session)
    const simulatedUserId = 1;
    if (simulatedUserId) {
      setFormData((prev) => ({ ...prev, userId: simulatedUserId }));
      setLoading(false);
    } else {
      // If no user is logged in, redirect to login page
      router.push('/login'); // Assuming you have a /login page
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!formData.userId) {
      setError('User not authenticated. Please log in.');
      setLoading(false);
      return;
    }

    if (!formData.termsAccepted) {
      setError('You must accept the terms and conditions.');
      setLoading(false);
      return;
    }

    try {
      // *** IMPORTANT: Corrected URL for App Router's nested API route ***
      const response = await fetch('/api/auth/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit membership form.');
      }

      setSuccess('Membership details saved successfully!');
      router.push('/dashboard'); // Redirect to dashboard or profile page
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading user session...</p>
      </div>
    );
  }

  return (
     <Box
    component="main"
    sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "110%",
        background: `url('/bgimage.jpg') center/cover no-repeat`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(8px)",
    }}
    >
        // Removed flex-col as Navbar is gone, now just center the content directly
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans p-4">
      {/* Removed Navbar Component */}

      {/* Adjusted max-w to xl and added more padding (px-8 py-10) for better visual appeal */}
      <div className="bg-white px-8 py-10 rounded-lg shadow-md w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Membership Form</h1> {/* Increased mb for title */}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> {success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5"> {/* Increased space-y for more vertical spacing */}
          {/* Name field (added as per schema, not explicitly in image but good practice) */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label> {/* Added mb-1 */}
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base" /> {/* Adjusted px/py and sm:text-base */}
          </div>

          {/* Email field (as per image) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base" />
          </div>

          {/* Phone field (as per image) */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base" />
          </div>

          {/* Address field (as per image) */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={3} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"></textarea>
          </div>

          {/* Date of Birth field (as per image) */}
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base" />
          </div>

          {/* Gender field (as per image) */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          {/* Terms Accepted checkbox (as per image) */}
          <div className="flex items-center">
            <input type="checkbox" id="termsAccepted" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-900">I accept the <a href="#" className="text-blue-600 hover:underline">terms and conditions</a></label>
          </div>

          {/* Complete Membership button (as per image) */}
          <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"> {/* Adjusted py and text-base */}
            {loading ? 'Submitting...' : 'Complete Membership'}
          </button>
        </form>
      </div>
    </div>
    </Box>
    
  );
}

// Removed Navbar placeholder component
