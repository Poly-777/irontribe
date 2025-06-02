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
  const duration = searchParams.get("duration");

  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);


const handlePayment = async () => {
  setLoading(true);

  try {
    // 1. Load Razorpay script
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Failed to load Razorpay SDK. Check your connection.");
      return;
    }

    // 2. Call your backend to create an order
    const paymentRes = await fetch("/api/auth/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, price, duration }),
    });

    const { order, key } = await paymentRes.json();

    // 3. Create Razorpay payment options
    const options = {
      key: key, // Razorpay key_id
      amount: order.amount,
      currency: "INR",
      name: "IronTribe",
      description: `Payment for ${title}`,
      order_id: order.id,
      handler: function (response: any) {
        alert("Payment successful!");
        console.log(response);
        setPaid(true);
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
      },
      theme: {
        color: "#3399cc",
      },
    };

    // 4. Open Razorpay modal
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Payment error:", err);
    alert("Something went wrong during payment.");
  } finally {
    setLoading(false);
  }
};

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
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
