"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState } from "react";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const title = searchParams.get("title");
  const price = searchParams.get("price");

  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    console.log("handlepayment clicked");
    // Simulate payment process (replace with real API like Razorpay/Stripe)
    setTimeout(() => {
      setLoading(false);
      setPaid(true);
    }, 2000);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 500, width: "100%", borderRadius: 4, boxShadow: 6 }}>
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
          >
            {paid ? "Payment Successful" : "Confirm Your Plan"}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {!paid ? (
            <>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Plan:</strong> {title}
              </Typography>
              <Typography variant="subtitle1" gutterBottom color="error">
                <strong>Price:</strong> {price}
              </Typography>

              <Box mt={4} display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<PaymentIcon />}
                  onClick={handlePayment}
                  disabled={loading}
                  sx={{ px: 4, py: 1.5, fontWeight: "bold" }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Proceed to Pay"
                  )}
                </Button>
              </Box>
            </>
          ) : (
            <Box textAlign="center">
              <CheckCircleIcon sx={{ fontSize: 60, color: "green", mt: 2 }} />
              <Typography variant="h6" mt={2}>
                Thank you! Your payment for the <strong>{title}</strong> was
                successful.
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 4 }}
                onClick={() => router.push("/home")}
              >
                Go to Dashboard
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
