"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Grid, Card, CardMedia, CardContent } from "@mui/material";

const meals = [
  {
    title: "Breakfast",
    description: "Oats with fruits and a boiled egg.",
    image: "/food1.jpg",
  },
  {
    title: "Mid-Morning Snack",
    description: "A handful of almonds and a banana.",
    image: "/food2.jpg",
  },
  {
    title: "Lunch",
    description: "Grilled chicken, brown rice, and salad.",
    image: "/food3.jpg",
  },
  {
    title: "Evening Snack",
    description: "Green tea with roasted chickpeas.",
    image: "/food4.jpg",
  },
  {
    title: "Dinner",
    description: "Steamed fish with sautéed vegetables.",
    image: "/food1.jpg",
  },
];

export default function DietPlanPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const email = localStorage.getItem("emailid");
    if (email) {
      setIsAuthenticated(true);
    } else {
      router.push("/login"); // Redirect if not logged in
    }
  }, [router]);

  if (!isAuthenticated) {
    return null; // Or a loading spinner
  }

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: 4,marginTop:7 }}>
      <Typography
        variant="h4"
        textAlign="center"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 4 }}
      >
        Daily Diet Plan
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {meals.map((meal, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="180"
                image={meal.image}
                alt={meal.title}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {meal.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {meal.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
