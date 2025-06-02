"use client";
import React, { useState, useEffect } from "react";
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
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function AdminLoginPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState({
    emailid: "",
    password: "",
    emailError: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    setButtonDisabled(!(admin.emailid && validatePassword(admin.password)));
    // eslint-disable-next-line
  }, [admin.emailid, admin.password]);

  const validateEmail = (emailid: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailid);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    if (email === "" || validateEmail(email)) {
      setAdmin({ ...admin, emailid: email, emailError: "" });
    } else {
      setAdmin({
        ...admin,
        emailid: email,
        emailError: "Please enter a valid email address",
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setAdmin((prevAdmin) => ({
      ...prevAdmin,
      password: password,
    }));
    validatePassword(password);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    const res = await fetch("/api/auth/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailid: admin.emailid,
        password: admin.password,
      }),
    });

    const data = await res.json();
    console.log("Login response:", data);

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    const session = data.session;
    if (!session || !session.id || !session.emailid || !session.name) {
      throw new Error("Invalid session data received from server.");
    }

    // Store in sessionStorage and localStorage
    sessionStorage.setItem("session_admin", JSON.stringify(session));
    localStorage.setItem("id", session.id);
    localStorage.setItem("emailid", session.emailid);
    localStorage.setItem("name", session.name);

    console.log("Session data stored successfully:", session);

    alert("Login successful!");
    router.push("/admin-dashboard");
  } catch (error: any) {
    console.error("Login error:", error);
    setErrorMessage(error.message || "Something went wrong");
  }
};



  const errorMessageStyle = {
    color: "red",
    marginTop: "10px",
    fontSize: "0.85rem",
  };
 
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
      <Paper
        elevation={6}
        sx={{
          width: { xs: "100%", sm: "380px" },
          padding: 4,
          borderRadius: 4,
          bgcolor: "rgba(255, 255, 255, 0.85)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        }}
      >
        <Box display="flex" justifyContent="center" mb={0}>
          <Image src="/logogym.png" alt="logo" width={140} height={120} />
        </Box>

        <Typography
          variant="h5"
          fontWeight="bold"
          color="black"
          textAlign="center"
          mb={1}
        >
          Admin Login
        </Typography>
        <Typography
          variant="subtitle1"
          color="black"
          textAlign="center"
          mb={3}
        >
          Sign in to manage IronTribe as an administrator
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            color="success"
            label="Admin Email"
            name="emailid"
            type="email"
            fullWidth
            size="small"
            value={admin.emailid}
            onChange={handleEmailChange}
            error={!!admin.emailError}
            helperText={admin.emailError}
            margin="normal"
          />

          <TextField
            label="Password"
            color="success"
            name="password"
            type={showPassword ? "text" : "password"}
            fullWidth
            size="small"
            value={admin.password}
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
            <div style={errorMessageStyle}>{errorMessage}</div>
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={buttonDisabled}
            type="submit"
            sx={{ mt: 2, fontWeight: "bold", py: 1.5 }}
          >
            Login as Admin
          </Button>
        </form>

        <Box textAlign="center" mt={3}>
          <Typography variant="body2">
            Not an admin?{" "}
            <Link href="/login" underline="hover" fontWeight="bold">
              User Login
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

