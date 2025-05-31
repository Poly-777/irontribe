'use client';
import React from 'react';
import { Box, Typography, Container, Button, Grid } from '@mui/material';
import Image from 'next/image';
import Navbar from '../components/navbar';

const AboutUs = () => {
  return (
    <>
      <Navbar />

      <Container maxWidth="lg" sx={{ bgcolor: '#121212', color: '#e0e0e0', minHeight: '100vh', py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, color: '#fff' }}>
            About IronTribe Gym
          </Typography>
          <Typography variant="h6" sx={{ color: '#bbb' }}>
            Transforming lives, one workout at a time.
          </Typography>
        </Box>

        <Box sx={{ py: 6, bgcolor: '#1f1f1f', textAlign: 'center', borderRadius: 2, mb: 8 }}>
          <Container>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#fff' }}>
              Our Story
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 800, margin: '0 auto', mb: 4, color: '#ccc' }}>
              IronTribe Gym was founded with a vision to provide a place where individuals can push their limits
              and unlock their full potential. With a state-of-the-art facility, expert trainers, and a supportive
              community, we aim to help everyone—from beginners to advanced athletes—achieve their fitness goals.
            </Typography>
            <Button
              variant="contained"
              color="error"
              size="large"
              sx={{ fontWeight: 'bold', px: 5, py: 1.5, boxShadow: '0 0 10px #ff3d00' }}
            >
              Join Us Today
            </Button>
          </Container>
        </Box>

        <Box sx={{ py: 6, textAlign: 'center', mb: 8 }}>
          <Container>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#fff' }}>
              Our Mission
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 800, margin: '0 auto', mb: 4, color: '#ccc' }}>
              At IronTribe Gym, we believe in strength—not just physical strength, but mental and emotional strength
              as well. Our mission is to create a space where you feel empowered, supported, and motivated to push
              beyond your limits. Whether you’re working towards your first push-up or preparing for an Ironman, we
              are here to help you every step of the way.
            </Typography>
          </Container>
        </Box>

        <Box sx={{ py: 6, bgcolor: '#1f1f1f', textAlign: 'center', borderRadius: 2, mb: 8 }}>
          <Container>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#fff' }}>
              Meet Our Trainers
            </Typography>
            <Grid container spacing={6} justifyContent="center">
              {[{
                name: 'Krishnamoni',
                specialty: 'Strength & Conditioning',
                imageUrl: '/person.jpg'
              }, {
                name: 'Priyanku',
                specialty: 'Yoga & Mobility',
                imageUrl: '/person.jpg'
              }, {
                name: 'Diganta',
                specialty: 'HIIT & Cardio',
                imageUrl: '/person.jpg'
              }].map((trainer) => (
                <Grid item key={trainer.name} xs={12} sm={6} md={4}>
                  <Box sx={{ textAlign: 'center', px: 3 }}>
                    <Image
                      src={trainer.imageUrl}
                      alt={trainer.name}
                      width={200}
                      height={200}
                      style={{ borderRadius: '50%', boxShadow: '0 0 15px #ff3d00' }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, color: '#fff' }}>
                      {trainer.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#bbb' }}>
                      {trainer.specialty}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Container>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#fff' }}>
              Our Core Values
            </Typography>
            <Grid container spacing={6} justifyContent="center">
              {['Community', 'Discipline', 'Empowerment', 'Consistency'].map((value) => (
                <Grid item xs={12} sm={6} md={3} key={value}>
                  <Box sx={{ textAlign: 'center', px: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ff3d00' }}>
                      {value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#bbb', mt: 1 }}>
                      We believe in building a community that supports each other, disciplines ourselves to achieve
                      our goals, empowers each other, and remains consistent to reach new heights.
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Container>
    </>
  );
};

export default AboutUs;
