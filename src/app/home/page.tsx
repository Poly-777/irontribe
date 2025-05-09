'use client';

import React from 'react';
import Navbar from '../components/navbar';
import { Box, Typography, Button, Container } from '@mui/material';
import Image from 'next/image';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Box
        sx={{
          height: '90vh',
          backgroundImage: 'url("/bgimage.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1,
          }}
        />
        <Container sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Unleash Your Power
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Join the ultimate training experience
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              fontWeight: 'bold',
              bgcolor: '#f44336',
              '&:hover': { bgcolor: '#d32f2f' },
            }}
          >
            Join Now
          </Button>
        </Container>
      </Box>

      {/* About Section */}
      <Box sx={{ py: 8, backgroundColor: '#f5f5f5', textAlign: 'center' }}>
        <Container>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            About IronTribe Gym
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: '700px', margin: '0 auto' }}>
            At irontribe Gym, we believe in pushing limits and redefining fitness. Whether you're a beginner or a pro athlete,
            our certified trainers, world-class equipment, and motivating atmosphere help you achieve your fitness goals.
          </Typography>
        </Container>
      </Box>

      {/* Classes Section */}
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Container>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
            Our Popular Classes
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            {['HIIT Training', 'Strength & Conditioning', 'Zumba Dance', 'CrossFit', 'Yoga Flex'].map((className) => (
              <Box
                key={className}
                sx={{
                  width: 250,
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: '#eee',
                  boxShadow: 2,
                  '&:hover': { backgroundColor: '#e0e0e0' },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {className}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Trainers Section */}
      <Box sx={{ py: 8, backgroundColor: '#111', color: '#fff', textAlign: 'center' }}>
        <Container>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
            Meet Our Trainers
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            {[
              { name: 'Krishnamoni', specialty: 'Strength Coach' },
              { name: 'Priyanku', specialty: 'Yoga & Mobility' },
              { name: 'Diganta', specialty: 'HIIT & Cardio' },
            ].map((trainer) => (
              <Box
                key={trainer.name}
                sx={{
                  backgroundColor: '#222',
                  p: 3,
                  borderRadius: 2,
                  width: 250,
                  boxShadow: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {trainer.name}
                </Typography>
                <Typography variant="body2">{trainer.specialty}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ py: 6, textAlign: 'center', backgroundColor: '#f44336', color: '#fff' }}>
        <Container>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            Ready to Transform Your Body?
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ bgcolor: '#fff', color: '#f44336', fontWeight: 'bold' }}
          >
            Get Your Free Trial
          </Button>
        </Container>
      </Box>
    </>
  );
}
