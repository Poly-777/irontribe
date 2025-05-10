'use client';
import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Modal,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const images = [
  '/bgimage.jpg',
  '/bgimage.jpg',
  '/bgimage.jpg',
  '/bgimage.jpg',
  '/bgimage.jpg',
  '/bgimage.jpg',
  '/bgimage.jpg',
  '/bgimage.jpg',
  '/bgimage.jpg',
  '/bgimage.jpg',
  '/bgimage.jpg',
  '/bgimage.jpg',
];

export default function GalleryPage() {
  const [open, setOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState('');

  const handleOpen = (src) => {
    setSelectedImg(src);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImg('');
  };

  return (
    <>
      <Container sx={{ py: 6 , marginTop:10}}>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          IronTribe Gym Gallery
        </Typography>
        <Typography variant="subtitle2" align="center" mb={4}>
          A snapshot of our environment and members in action
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          {images.map((src, i) => (
            <Grid item xs={12} sm={6} md={4} key={i} display="flex" justifyContent="center">
              <Box
                onClick={() => handleOpen(src)}
                sx={{
                  cursor: 'pointer',
                  overflow: 'hidden',
                  borderRadius: 2,
                  boxShadow: 2,
                  width: { xs: '90%', sm: '100%' },
                  height: 180,
                  '& img': {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                  },
                  '&:hover img': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <img src={src} alt={`gallery-${i}`} />
              </Box>
            </Grid>
          ))}
        </Grid>

        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '90%',
              maxHeight: '90%',
              outline: 'none',
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: '#fff',
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 10,
              }}
            >
              <CloseIcon />
            </IconButton>
            <img
              src={selectedImg}
              alt="fullview"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '90vh',
                borderRadius: '10px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
              }}
            />
          </Box>
        </Modal>
      </Container>
    </>
  );
}
