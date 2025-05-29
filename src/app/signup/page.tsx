"use client";
import React, { useEffect } from "react";
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
import { signinUser } from "../api/lib/api";
import usePageRedirect from '../api/redirect/route';

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    name: "",
    mobile: "",
    emailid: "",
    password: "", 
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [nameError, setNameError] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [mobileError, setMobileError] = React.useState("");
  const [error, setError] = React.useState(""); // For general errors

  const validateName = (Name: any) => {
    const isValid = /^[A-Za-z]+ [A-Za-z]+$/.test(Name);
    if (!Name || !isValid) {
      setNameError("Name must have a Firstname and a Lastname - Ex. John Doe");
    } else {
      setNameError("");
    }
  };

  const validateMobile = (mobile: any) => {
    const isValid = /^\d{10}$/.test(mobile);
    if (!mobile || !isValid) {
      setMobileError("Mobile number must be 10 digits long.");
    } else {
      setMobileError("");
    }
  };

  const validateEmail = (emailid: any) => {
    const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailid);
    if (!emailid || !isValid) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (password: any) => {
    const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    if (!password || !isValid) {
      setPasswordError(
        "Password must:\n" +
        "- Be at least 8 characters long\n" +
        "- Contain at least one uppercase letter\n" +
        "- Contain at least one lowercase letter\n" +
        "- Contain at least one digit\n" +
        "- Contain at least one special character (e.g., !@#$%^&*)"
      );
    } else {
      setPasswordError("");
    }
  };

  useEffect(() => {
    if (
      !nameError &&
      !mobileError &&
      !emailError &&
      !passwordError &&
      user.name &&
      user.mobile &&
      user.emailid &&
      user.password
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [nameError, mobileError, emailError, passwordError, user]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const handleSignup = async (event: any) => {
    event.preventDefault();
    try {
      const data = await signinUser(user.name, user.mobile, user.emailid, user.password);
      if (data.status === 201) {
        localStorage.setItem("emailid", user.emailid || "");
        localStorage.setItem("mobile", user.mobile || "");
        localStorage.setItem("name", user.name || "");
        router.push("/home");
      } else if (data.status === 400) {
        router.push("/signup");
      } else if (data.status === 500) {
      // User already exists
      alert("User already exists. Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000); // Redirect after 2s
    } else {
        console.error("Unhandled status code:", data.status);
      }
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

   const goToLogin = usePageRedirect('login');

  return (
    <Box
    component="main"
    sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "120%",
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
          Create an Account
        </Typography>
        <Typography
          variant="subtitle1"
          color="black"
          textAlign="center"
          mb={3}
        >
          Join IronTribe and start your fitness journey
        </Typography>

        <form onSubmit={handleSignup}>
          <TextField
            color="success"
            label="Name"
            name="Name"
            size="small"
            value={user.name}
            onChange={(e) => {
              const Name = e.target.value;
              validateName(Name);
              setUser({ ...user, name: Name });
            }}
            fullWidth
            margin="normal"
            error={!!nameError}
            helperText={nameError}
          />
          <TextField
            label="Mobile No"
            color="success"
            name="Mobile"
            size="small"
            value={user.mobile}
            onChange={(e) => {
              const mobile = e.target.value;
              validateMobile(mobile);
              setUser({ ...user, mobile });
            }}
            fullWidth
            margin="normal"
            error={!!mobileError}
            helperText={mobileError}
          />
          <TextField
            label="Email id"
            color="success"
            name="emailid"
            type="email"
            size="small"
            value={user.emailid}
            onChange={(e) => {
              const email = e.target.value;
              validateEmail(email);
              setUser({ ...user, emailid: email });
            }}
            fullWidth
            margin="normal"
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            label="Password"
            color="success"
            name="password"
            type={showPassword ? "text" : "password"}
            size="small"
            value={user.password}
            onChange={(e) => {
              const password = e.target.value;
              validatePassword(password);
              setUser({ ...user, password });
            }}
            fullWidth
            margin="normal"
            error={!!passwordError}
            helperText={passwordError}
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

        <Typography
          variant="subtitle2"
          align="center"
          mt={3}
          fontWeight={500}
          color="primary"
        >
          or sign up with
        </Typography>

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "#000000",
            "&:hover": { backgroundColor: "#808080" },
            textTransform: "none",
            fontWeight: 500,
          }}
          >
          <Google sx={{ mr: 1 }} />
          Sign up with Google
        </Button>

        <Box textAlign="center" mt={3}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link href="/login" underline="hover" fontWeight="bold">
              Login
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
