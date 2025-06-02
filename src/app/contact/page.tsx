'use client';
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Stack,
} from '@mui/material';
import { Phone, Email, LocationOn } from '@mui/icons-material';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  }); 
 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    }, 2000);
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          backgroundImage: 'url("/bgimage.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: 10,
        }}
      >
        <Container>
          <Box sx={{ textAlign: 'center', color: 'black', mb: 6, backgroundColor:"rgba(211, 211, 211,0.70)" }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Get in Touch with Us
            </Typography>
            <Typography variant="subtitle1">
              We'd love to hear from you! Whether you have questions or feedback, feel free to reach out to us.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Left: Contact Info */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 4, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.75)' }}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Contact Information
                </Typography>
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center">
                    <Phone sx={{ mr: 2 }} />
                    <Typography variant="body1">+1 (123) 456-7890</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Email sx={{ mr: 2 }} />
                    <Typography variant="body1">info@irontribegym.com</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <LocationOn sx={{ mr: 2 }} />
                    <Typography variant="body1">123 Gym Street, City, Country</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            {/* Right: Contact Form */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 4, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.75)' }}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Send Us a Message
                </Typography>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                    required
                  />
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                    required
                  />
                  <TextField
                    label="Message"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                    required
                  />
                  <Box display="flex" justifyContent="center">
                    <Button
                      variant="contained"
                      type="submit"
                      sx={{ width: '50%' }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                  </Box>
                  {isSuccess && (
                    <Typography color="success.main" align="center" mt={2}>
                      Thank you! We will get back to you soon.
                    </Typography>
                  )}
                </form>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Map Section Outside the Background */}
      <Box sx={{ width: '100%', mt: 6 }}>
        <Typography variant="h6" fontWeight="bold" mb={2} align="center">
          Find Us Here
        </Typography>
        <iframe
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3225.57849722499!2d92.83076009999999!3d26.7002961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3744ebc8fd314411%3A0x28a60e3c5515613b!2sTezpur%20University!5e1!3m2!1sen!2sin!4v1746896419174!5m2!1sen!2sin'
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </Box>
    </>
  );
}
