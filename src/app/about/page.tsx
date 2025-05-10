'use client';
import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import {Grid} from '@mui/material';
import Image from 'next/image';
import Navbar from '../components/navbar';

const AboutUs = () => {
  return ( 
    <>
    <Navbar/>

    <Container>
      <Box sx={{ pt: 8, textAlign: 'center',marginTop:5 }}>
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          About IronTribe Gym
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
          Transforming lives, one workout at a time.
        </Typography>
      </Box>

      <Box sx={{ py: 6, backgroundColor: '#f5f5f5', textAlign: 'center' }}>
        <Container>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
            Our Story
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: '800px', margin: '0 auto', mb: 4 }}>
            IronTribe Gym was founded with a vision to provide a place where individuals can push their limits
            and unlock their full potential. With a state-of-the-art facility, expert trainers, and a supportive
            community, we aim to help everyone—from beginners to advanced athletes—achieve their fitness goals.
          </Typography>
          <Button variant="contained" color="primary" size="large" sx={{ fontWeight: 'bold' }}>
            Join Us Today
          </Button>
        </Container>
      </Box>

      {/* Mission Statement Section */}
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Container>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
            Our Mission
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: '800px', margin: '0 auto', mb: 4 }}>
            At IronTribe Gym, we believe in strength—not just physical strength, but mental and emotional strength
            as well. Our mission is to create a space where you feel empowered, supported, and motivated to push
            beyond your limits. Whether you’re working towards your first push-up or preparing for an Ironman, we
            are here to help you every step of the way.
          </Typography>
        </Container>
      </Box>

      <Box sx={{ py: 6, backgroundColor: '#f5f5f5', textAlign: 'center' }}>
        <Container>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
            Meet Our Trainers
          </Typography>
          <Grid container spacing={4} justifyContent="center">
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
                <Box sx={{ textAlign: 'center' }}>
                  <Image
                    src={trainer.imageUrl}
                    alt={trainer.name}
                    width={200}
                    height={200}
                    style={{ borderRadius: '50%' }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
                    {trainer.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
            Our Core Values
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {['Community', 'Discipline', 'Empowerment', 'Consistency'].map((value) => (
              <Grid item xs={12} sm={6} md={3} key={value}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
