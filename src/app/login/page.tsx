"use client";
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
    emailid: "",
    password: "",
    name:"",
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
    validatePassword(password);
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

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  const res = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ emailid: user.emailid, password: user.password }),
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("emailid", user.emailid || "");
    localStorage.setItem("emailid", user.emailid || "");
    sessionStorage.setItem("session_userLogin", JSON.stringify(data.session));
  

    alert("Login successful!");
    router.push("/home");
  } else {
    alert(data.error || "Login failed");
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
            Submit
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