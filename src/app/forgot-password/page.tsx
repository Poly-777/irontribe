"use client";
import { useState } from "react";
import {
  Box, Button, TextField, Typography, Paper
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [emailid, setEmailid] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailid, mobile }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("OTP sent to your email and mobile.");
      router.push("/verify-otp");
    } else {
      alert(data.error || "Error sending OTP.");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h6" textAlign="center" gutterBottom>
          Forgot Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={emailid}
            onChange={(e) => setEmailid(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            label="Mobile Number"
            type="tel"
            fullWidth
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Send OTP
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
