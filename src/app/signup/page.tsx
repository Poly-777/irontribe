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
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Image from "next/image";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid"; // npm install uuid

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    memberId: uuidv4(),
    name: "",
    mobile: "",
    emailid: "",
    password: "",
    address: "",
    dob: "",
    gender: "",
    joindate: "",
    membershipstatus: "",
    termaccepted: false,
  });

  const [errors, setErrors] = React.useState({
    name: "",
    mobile: "",
    emailid: "",
    password: "",
    address: "",
    dob: "",
    gender: "",
    joindate: "",
    membershipstatus: "",
    termaccepted: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);

  const validate = () => {
    const newErrors: any = {};

    if (!/^[A-Za-z]+ [A-Za-z]+$/.test(user.name))
      newErrors.name = "Enter full name (first and last)";
    if (!/^\d{10}$/.test(user.mobile))
      newErrors.mobile = "Mobile number must be 10 digits";
    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(user.emailid)
    )
      newErrors.emailid = "Invalid email address";
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
        user.password
      )
    )
      newErrors.password =
        "Password must be 8+ chars, include uppercase, lowercase, digit & special character";
    if (!user.address) newErrors.address = "Address is required";
    if (!user.dob) newErrors.dob = "Date of Birth is required";
    if (!user.gender) newErrors.gender = "Gender is required";
    if (!user.joindate) newErrors.joindate = "Join Date is required";
    if (!user.membershipstatus)
      newErrors.membershipstatus = "Select membership status";
    // if (!user.termaccepted)
    //   newErrors.termaccepted = "Accept the terms and conditions.";   

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    setButtonDisabled(!validate());
  }, [user]);

  const handleSignup = async (e: any) => {
    e.preventDefault();
    if (!validate()) return;

    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      router.push("/home");
      console.log("Signup successful", user);
    } else {
      alert("Signup failed. Try again.");
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
        height: "auto",
        minHeight: "100vh",
        background: `url('/bgimage.jpg') center/cover no-repeat`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(8px)",
        py: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: { xs: "100%", sm: "500px" },
          padding: 4,
          borderRadius: 4,
          bgcolor: "rgba(255, 255, 255, 0.85)",
        }}
      >
        <Box display="flex" justifyContent="center" mb={2}>
          <Image
  src="/logogym.png"
  alt="logo"
  width={140}
  height={120}
  style={{
    mixBlendMode: "multiply", // tries to blend the background
    backgroundColor: "transparent",
  }}
/>
        </Box>

        <Typography variant="h5" textAlign="center" fontWeight="bold" mb={2}>
          Create an Account
        </Typography>

        <form onSubmit={handleSignup}>
          <TextField
            label="Full Name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Mobile"
            value={user.mobile}
            onChange={(e) => setUser({ ...user, mobile: e.target.value })}
            error={!!errors.mobile}
            helperText={errors.mobile}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Email"
            value={user.emailid}
            onChange={(e) => setUser({ ...user, emailid: e.target.value })}
            error={!!errors.emailid}
            helperText={errors.emailid}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
            margin="dense"
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              ),
            }}
          />
          <TextField
            label="Address"
            value={user.address}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
            error={!!errors.address}
            helperText={errors.address}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Date of Birth"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={user.dob}
            onChange={(e) => setUser({ ...user, dob: e.target.value })}
            error={!!errors.dob}
            helperText={errors.dob}
            fullWidth
            margin="dense"
          />
          <FormControl fullWidth margin="dense" error={!!errors.gender}>
            <InputLabel>Gender</InputLabel>
            <Select
              value={user.gender}
              onChange={(e) => setUser({ ...user, gender: e.target.value })}
              label="Gender"
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
            <Typography variant="caption" color="error">
              {errors.gender}
            </Typography>
          </FormControl>
          <TextField
            label="Join Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={user.joindate}
            onChange={(e) => setUser({ ...user, joindate: e.target.value })}
            error={!!errors.joindate}
            helperText={errors.joindate}
            fullWidth
            margin="dense"
          />
          <FormControl fullWidth margin="dense" error={!!errors.membershipstatus}>
            <InputLabel>Membership Status</InputLabel>
            <Select
              value={user.membershipstatus}
              onChange={(e) =>
                setUser({ ...user, membershipstatus: e.target.value })
              }
              label="Membership Status"
            >
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Old">Old</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
            <Typography variant="caption" color="error">
              {errors.membershipstatus}
            </Typography>
          </FormControl>

          <Box display="flex" alignItems="center" mt={2}>
            <Checkbox
              checked={user.termaccepted}
              onChange={(e) =>
                setUser({ ...user, termaccepted: e.target.checked })
              }
              color="primary"
            />
            <Typography variant="body2" sx={{ ml: 1 }}>
            I agree to the <Link>terms and conditions.</Link>
          </Typography>
          {/* {errors.termaccepted && (
            <Typography variant="caption" sx={{ ml:1 }} color="error">
              {errors.termaccepted}
            </Typography>
          )} */}
          </Box>
          

          <Button
            variant="contained"
            fullWidth
            type="submit"
            disabled={buttonDisabled}
            sx={{ mt: 2,backgroundColor: "#000000",
            "&:hover": { backgroundColor: "#808080" },
            textTransform: "none",
            fontWeight: 500, }}
          >
            Register
          </Button>
        </form>
      </Paper>
    </Box>
  );
}





  //           <Box
  //   sx={{
  //     position: "absolute",
  //     top: 0,
  //     left: 0,
  //     right: 0,
  //     bottom: 0,
  //     backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: Dark overlay to enhance blur effect
  //     backdropFilter: "blur(12px)", // Apply blur effect
  //     zIndex: -1, // Ensures the blur stays in the background
  //   }}
  // />