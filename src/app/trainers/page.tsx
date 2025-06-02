'use client';
import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Chip,
} from '@mui/material';

const trainers = [
  {
    name: 'diganta',
    image: '/diganta.jpg',
    specialty: 'Strength & Conditioning',
    experience: '7 years',
    phone: '+91 98765 43210',
    description: 'Diganta focuses on strength training, powerlifting, and progressive overload techniques.',
  },
  {
    name: 'priyanku',
    image: '/priyanku.jpg',
    specialty: 'Functional Training',
    experience: '5 years',
    phone: '+91 91234 56789',
    description: 'priyanku helps clients build endurance and flexibility through core-focused functional movements.',
  },
  {
    name: 'krishnamoni',
    image: '/krishnamoni.jpg',
    specialty: 'Bodybuilding & Nutrition',
    experience: '10 years',
    phone: '+91 99887 77665',
    description: 'krishnamoni has trained professional athletes and bodybuilders, focusing on hypertrophy and meal plans.',
  },
];

export default function TrainersPage() {
  return (
    <>
      <Container sx={{ py: 6, marginTop:5}}>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Meet Our Trainers
        </Typography>
        <Typography variant="subtitle2" align="center" mb={4}>
          Certified professionals dedicated to your fitness journey.
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {trainers.map((trainer, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              key={index}
              display="flex"
              justifyContent="center"
            >
              <Card
                sx={{
                  width: '100%',
                  maxWidth: 360,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 3,
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <CardMedia
                  component="img"
                  height="250"
                  image={trainer.image}
                  alt={trainer.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {trainer.name}
                  </Typography>
                  <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
                    <Chip label={trainer.specialty} color="primary" />
                    <Chip label={trainer.experience} variant="outlined" />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {trainer.description}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    Contact: {trainer.phone}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
