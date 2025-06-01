"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
    image: "/food3.jpg",
  },
  {
    title: "Late Night Snack",
    description: "Green tea with roasted chickpeas.",
    image: "/food1.jpg",
  },
  {
    title: "Cheat Meal",
    description: "Steamed fish with sautéed vegetables.",
    image: "/food2.jpg",
  },
];

// Static placeholder recipe for now
const staticRecipe = {
  ingredients: [
    "1 cup rolled oats",
    "1 banana",
    "1 boiled egg",
    "1/2 cup milk or water",
    "Honey to taste",
  ],
  steps: [
    "Boil the oats with milk or water for 5-7 minutes.",
    "Slice the banana and mix it into the oats.",
    "Add honey for sweetness.",
    "Serve with a boiled egg on the side.",
  ],
};

export default function DietPlanPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);

  useEffect(() => {
    const email = localStorage.getItem("emailid");
    if (email) {
      setIsAuthenticated(true);
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleOpen = (meal: any) => {
    setSelectedMeal(meal);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMeal(null);
  };

  if (!isAuthenticated) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        pt: 8,
        pb: 8,
        display: "flex",
        justifyContent: "center",
        marginTop:3,
        alignItems: "flex-start",
        backgroundImage: `url('/bgimage.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Box sx={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1200, px: 3 }}>
        <Typography
          variant="h4"
          textAlign="center"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 4, color: "#fff", textShadow: "0 0 8px rgba(0,0,0,0.7)" }}
        >
          Daily Diet Plan
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {meals.map((meal, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 6,
                  },
                }}
                onClick={() => handleOpen(meal)}
              >
                <CardMedia component="img" height="180" image={meal.image} alt={meal.title} />
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

      {/* Recipe Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {selectedMeal?.title} Recipe
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Ingredients:
            </Typography>
            <ul>
              {staticRecipe.ingredients.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
              Instructions:
            </Typography>
            <ol>
              {staticRecipe.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
