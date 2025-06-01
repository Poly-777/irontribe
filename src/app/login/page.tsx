// src/app/login/page.tsx
'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Typography,
  Box,
  Button,
  Link,
  TextField,
  IconButton,
  Paper,
} from "@mui/material";
import Image from "next/image";

import { Visibility, VisibilityOff, Google } from "@mui/icons-material";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    emailid: "", // Renamed from 'email' to 'emailid' as per user's snippet
    password: "",
    emailError: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // For general login errors
  const [successMessage, setSuccessMessage] = useState(""); // Added for success message
  const [loading, setLoading] = useState(false); // Add loading state

  const validatePassword = (password: string) => {
    const isValid =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      );
    if (password === "" || isValid) {
      setPasswordError("");
      return true;
    } else {
      setPasswordError(
        "Password must:\n" +
          "- Be at least 8 characters long\n" +
          "- Contain at least one uppercase letter\n" +
          "- Contain at least one lowercase letter\n" +
          "- Contain at least one digit\n" +
          "- Contain at least one special character (e.g., !@#$%^&*)"
      );
      return false;
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.emailid && validatePassword(user.password)));
    // eslint-disable-next-line
  }, [user.emailid, user.password]);


  const validateEmail = (emailid: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailid);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    if (email === "" || validateEmail(email)) {
      setUser({ ...user, emailid: email, emailError: "" });
    } else {
      setUser({
        ...user,
        emailid: email,
        emailError: "Please enter a valid email address",
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setUser((prevUser) => ({
      ...prevUser,
      password: password,
    }));
    validatePassword(password); // Validate on change
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const errorMessageStyle = {
    color: "red",
    marginTop: "10px",
    fontSize: "0.85rem",
  };

  const successMessageStyle = { // Added style for success message
    color: "green",
    marginTop: "10px",
    fontSize: "0.85rem",
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
    setSuccessMessage(""); // Clear previous success messages
    setLoading(true); // Set loading to true at the start

    // Re-validate before submitting
    if (!validateEmail(user.emailid) || !validatePassword(user.password)) {
      setErrorMessage("Please correct the form errors.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/login", { // Correct API endpoint for login
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.emailid, password: user.password }), // Ensure payload matches API
      });
      const data = await res.json();
      if (res.ok) {
        // Login successful!
        const userRole = data.user.role; // Get the role from the API response
        setSuccessMessage(`Login successful! Redirecting to ${userRole} dashboard...`);

        // Use a timeout to display the message briefly before redirecting
        setTimeout(() => {
          if (userRole === 'admin') {
            router.push('/profile');
          } else if (userRole === 'member') {
            router.push('/profile');
          } else {
            // Fallback for unknown roles or if role is missing
            router.push('/profile');
          }
        }, 1500); // Redirect after 1.5 seconds
      } else {
        setErrorMessage(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box
      component="main"
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "110%", // Keep this for vertical centering if content is short
        background: `url('/bgimage.jpg') center/cover no-repeat`, // Ensure /public/bgimage.jpg exists
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(8px)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: { xs: "90%", sm: "380px" }, // Adjust width for small screens
          padding: 4,
          borderRadius: 4,
          bgcolor: "rgba(255, 255, 255, 0.85)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        }}
      >
        <Box display="flex" justifyContent="center" mb={0}>
          <Image src="/logogym.png" alt="logo" width={140} height={120} /> {/* Ensure /public/logogym.png exists */}
        </Box>

        <Typography
          variant="h5"
          fontWeight="bold"
          color="black"
          textAlign="center"
          mb={1}
        >
          Welcome to IronTribe
        </Typography>
        <Typography
          variant="subtitle1"
          color="black"
          textAlign="center"
          mb={3}
        >
          Log in to proceed with your fitness journey
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            color="success"
            label="Email"
            name="emailid"
            type="email"
            fullWidth
            size="small"
            value={user.emailid}
            onChange={handleEmailChange}
            error={!!user.emailError}
            helperText={user.emailError}
            margin="normal"
          />

          <TextField
            label="Password"
            color="success"
            name="password"
            type={showPassword ? "text" : "password"}
            fullWidth
            size="small"
            value={user.password}
            onChange={handlePasswordChange}
            error={!!passwordError}
            helperText={passwordError}
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              ),
            }}
          />

          {errorMessage && (
            <Typography sx={errorMessageStyle}>{errorMessage}</Typography>
          )}
          {successMessage && ( // Display success message
            <Typography sx={successMessageStyle}>{successMessage}</Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={buttonDisabled || loading}
            type="submit"
            sx={{ mt: 2, fontWeight: "bold", py: 1.5 }}
          >
            {loading ? "Loading..." : "Submit"}
          </Button>
        </form>

        <Box textAlign="right" mt={1}>
          <Link href="/forgot-password" underline="hover" color="primary">
            Forgot password?
          </Link>
        </Box>

        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{
            mt: 2,
            fontWeight: 500,
            textTransform: "none",
            borderColor: "#1976d2",
            color: "#1976d2",
            "&:hover": { backgroundColor: "#e3f2fd" },
          }}
          onClick={() => router.push("/admin-login")}
        >

          <Google sx={{ mr: 1 }} />
          <span style={{ fontWeight: 500 }}>Sign in with Google</span>
          Login as Admin

        </Button>

        <Box textAlign="center" mt={3}>
          <Typography variant="body2">
            Don’t have an account?{" "}
            <Link href="/signup" underline="hover" fontWeight="bold">
              Sign Up
            </Link>
          </Typography>
        </Box>

        <Typography
          variant="caption"
          display="block"
          textAlign="center"
          color="text.secondary"
          mt={3}
        >
          © 2009-2024 IronTribe | All Rights Reserved | Privacy Policy
        </Typography>
      </Paper>
    </Box>
  );
}

// setLoading is now handled by useState above, so this function is no longer needed.
function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}

