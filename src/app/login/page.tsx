"use client";
import React, { useEffect, useState, Component } from "react";
import { useRouter } from "next/navigation";
import { Typography, Box, Button, Link, Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import { IconButton } from "@mui/material";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    emailid: "",
    password: "",
    emailError: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validatePassword = (password:any) => {
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
  }, [user.emailid, user.password]);

  const validateEmail = (emailid: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailid);
  };

  const handleEmailChange = (e: any) => {
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

  const handlePasswordChange = (e:any) => {
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

  const handleMouseDownPassword = (event:any) => {
    event.preventDefault();
  };

  
  const errorMessageStyle = {
    color: "red",
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid item xs={12} md={4} order={{ xs: 2, md: 1 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: { xs: "30px" },
              height: { xs: "100vh", md: "90%" },
              padding: "0 20px",
            }}
          >
            <Image src="/Logo.svg" alt="logo" width={300} height={160} />

            <Typography
              variant="h5"
              fontWeight="600"
              color="#0024E0"
              textAlign="center"
              fontFamily="Poppins,Sans-serif"
            >
              Welcome to IronTribe
            </Typography>
            <Typography
              variant="h6"
              color="#0024E0"
              textAlign="center"
              fontFamily="Poppins,Sans-serif"
            >
              Log in to proceed with your fitness journey
            </Typography>

            <Box sx={{ width: "80%" }}>
              <form>
                <TextField
                  placeholder="Enter Email Id"
                  label="Email id"
                  name="emailid"
                  size="small"
                  required
                  focused
                  type="email"
                  value={user.emailid}
                  onChange={handleEmailChange}
                  fullWidth
                  helperText={
                    user.emailError ? (
                      <span style={{ color: "red" }}>{user.emailError}</span>
                    ) : (
                      ""
                    )
                  }
                  margin="normal"
                />

                <TextField
                  focused
                  sx={{
                    height: "45px",
                    borderRadius: "5px",
                    marginBottom: passwordError ? "75px" : "0",
                  }}
                  placeholder="Password"
                  label="Password"
                  name="password"
                  size="small"
                  required
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                      </IconButton>
                    ),
                  }}
                  value={user.password}
                  onChange={(e) => {
                    const password = e.target.value;
                    validatePassword(password);
                    setUser({ ...user, password: e.target.value });
                  }}
                  fullWidth
                  margin="normal"
                  error={!!passwordError}
                  helperText={passwordError}
                />
                {errorMessage && (
                  <span className="error-message" style={errorMessageStyle}>
                    {errorMessage}
                  </span>
                )}

                <Button
                  variant="contained"
                  type="submit"
                  disabled={buttonDisabled}
                  sx={{
                    boxShadow: 1,
                    maxWidth: "100%",
                    height: "41px",
                    width: "100%",
                    fontWeight: "800",
                    fontFamily: "Poppins,Sans-serif",
                    color: "white",
                  }}
                >
                  Submit
                </Button>
              </form>
              <Typography
                sx={{ textAlign: "end", color: "rgba(0, 36, 224, 1)" }}
              >
                <Link
                  component="a"
                  href="/forgot-password"
                  sx={{ cursor: "pointer" }}
                >
                  forgot password
                </Link>
              </Typography>

              <Typography
                variant="h6"
                align="center"
                marginTop={1}
                fontWeight={600}
                sx={{ color: "blue" }}
              >
                or login with
              </Typography>
              <Box
                marginTop={"5px"}
                display={"flex"}
                flexDirection={"column"}
                gap={"15px"}
                sx={{ width: "100%" }}
              >
                <Button
                  variant="contained"
                  sx={{
                    height: 41,
                    fontSize: 16,
                    fontWeight: 400,
                    textTransform: "none",
                    borderRadius: "5px",
                    background: "#FF3E30",
                    "&:hover": { background: "#FF3E30" },
                  }}
                >
                  Login with Google
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                display: "block",
                textAlign: "center",
                marginTop: { xs: "20px", md: "15px" },
              }}
            >
              Don&#39;t have an Account ?
              <Link
                href="/signup"
                sx={{ "& .MuiTypography-root": { fontWeight: "bold" } }}
              >
                Sign Up
              </Link>
            </Box>
          </Box>

          <Box
            sx={{
              backgroundColor: "#f0f0f0",
              textAlign: "center",
              padding: "10px 0",
            }}
          >
            <Typography
              color="#555"
              sx={{ fontSize: "10px", fontFamily: "poppins" }}
            >
              © 2009-2024 -IronTribe | All Rights Reserved |
              Privacy Policy
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
