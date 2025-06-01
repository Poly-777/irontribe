"use client";
import React from "react";
import { Box, Typography, Grid, Card, CardContent, Button } from "@mui/material";

const plans = [
  {
    title: "Starter Plan",
    price: "₹499",
    duration: "per month",
    features: [
      "Limited workout access",
      "Basic diet tips",
      "Community support",
    ],
  },
  {
    title: "Monthly Plan",
    price: "₹999",
    duration: "per month",
    features: [
      "Access to all workouts",
      "Basic diet guidance",
      "Email support",
    ],
  },
  {
    title: "6-Month Plan",
    price: "₹4999",
    duration: "every 6 months",
    features: [
      "Customized workout plans",
      "Personalized diet chart",
      "Priority chat support",
    ],
    recommended: true,
  },
  {
    title: "12-Month Plan",
    price: "₹8999",
    duration: "every year",
    features: [
      "1-on-1 monthly coaching call",
      "All 6-month features",
      "Free IronTribe T-shirt",
    ],
  },
  {
    title: "Elite Plan",
    price: "₹14,999",
    duration: "every year",
    features: [
      "All 12-month features",
      "Weekly 1-on-1 coaching",
      "Exclusive merchandise bundle",
      "Priority event invites",
    ],
  },
];

export default function PricingPage() {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f9f9f9", py: 6, px: 3 ,marginTop:5}}>
      <Typography
        variant="h4"
        textAlign="center"
        fontWeight="bold"
        mb={4}
        sx={{ fontFamily: "Poppins, sans-serif" }}
      >
        Choose Your Plan
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 4,
                backgroundColor: plan.recommended ? "#000" : "#fff",
                color: plan.recommended ? "#fff" : "#000",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {plan.title}
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="error">
                  {plan.price}
                </Typography>

                <Typography variant="subtitle1" mb={2}>
                  {plan.duration}
                </Typography>
                <ul style={{ paddingLeft: "1rem" }}>
                  {plan.features.map((feature, i) => (
                    <li key={i}>
                      <Typography variant="body2">{feature}</Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <Box textAlign="center" pb={3}>
                <Button
                  variant={plan.recommended ? "contained" : "outlined"}
                  sx={{
                    borderColor: plan.recommended ? "#fff" : "#000",
                    color: plan.recommended ? "#000" : "#000",
                    backgroundColor: plan.recommended ? "#fff" : "#fff",
                    fontWeight: "bold",
                    px: 4,
                    "&:hover": {
                      backgroundColor: "red",
                      color: "#fff",
                    },
                  }}
                >
                  Choose Plan
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
