'use client';

import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Container,
  Paper,
  Avatar,
  IconButton,
  Divider,
} from '@mui/material';
import { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const sexes = ['Male', 'Female', 'Other'];
const bodyShapes = ['Athletic', 'Lean', 'Muscular', 'Toned', 'Bulky'];

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    sex: '',
    address: "",
    height: '',
    weight: '',
    bodyShape: '',
    notes: '',
  });

  const [editMode, setEditMode] = useState(false);

  // Fetch name from localStorage on mount
  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setProfile((prev) => ({ ...prev, name: storedName }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditMode(false);
    alert('Profile saved successfully!');
    // Save to backend here if needed
  };

  const isProfileEmpty = !profile.name;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url('/bgimage.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        pt: 8,
        pb: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1,
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2, marginTop:5}}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Edit button top right */}
          <IconButton
            onClick={() => setEditMode(!editMode)}
            sx={{ position: 'absolute', top: 16, right: 16 }}
            aria-label={editMode ? 'Cancel editing' : 'Edit profile'}
            color={editMode ? 'error' : 'primary'}
          >
            {editMode ? <CancelIcon /> : <EditIcon />}
          </IconButton>

          <Avatar
            alt="Profile Picture"
            src="/avatar.jpg"
            sx={{
              width: 120,
              height: 120,
              border: '3px solid #f44336',
              mb: 3,
            }}
          />

          <Typography variant="h4" gutterBottom textAlign="center">
            {profile.name || 'Your Profile'}
          </Typography>

          {isProfileEmpty && !editMode && (
            <Box textAlign="center" sx={{ mt: 2, mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Add more details to your profile for a better experience.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setEditMode(true)}
                sx={{ bgcolor: '#f44336', '&:hover': { bgcolor: '#d32f2f' } }}
              >
                Add Details
              </Button>
            </Box>
          )}

          {editMode ? (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                value={profile.name}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    boxShadow: '0 0 5px rgba(244, 67, 54, 0.3)',
                    transition: 'box-shadow 0.3s ease',
                    '&:hover fieldset': {
                      borderColor: '#f44336',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f44336',
                      boxShadow: '0 0 8px #f44336',
                    },
                  },
                }}
              />

              {[ 
                { label: 'Age', name: 'age', type: 'number', required: true },
                { label: 'Height (cm)', name: 'height', type: 'number', required: true },
                { label: 'Weight (kg)', name: 'weight', type: 'number', required: true },
              ].map(({ label, name, type, required }) => (
                <TextField
                  key={name}
                  label={label}
                  name={name}
                  type={type}
                  fullWidth
                  value={(profile as any)[name]}
                  onChange={handleChange}
                  margin="normal"
                  required={required}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      boxShadow: '0 0 5px rgba(244, 67, 54, 0.3)',
                      transition: 'box-shadow 0.3s ease',
                      '&:hover fieldset': {
                        borderColor: '#f44336',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#f44336',
                        boxShadow: '0 0 8px #f44336',
                      },
                    },
                  }}
                />
              ))}

              <TextField
                select
                label="Sex"
                name="sex"
                fullWidth
                value={profile.sex}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    boxShadow: '0 0 5px rgba(244, 67, 54, 0.3)',
                    transition: 'box-shadow 0.3s ease',
                    '&:hover fieldset': {
                      borderColor: '#f44336',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f44336',
                      boxShadow: '0 0 8px #f44336',
                    },
                  },
                }}
              >
                {sexes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

                <TextField
                label="Address"
                name="address"
                multiline
                rows={1}
                fullWidth
                value={profile.address}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    boxShadow: '0 0 5px rgba(244, 67, 54, 0.3)',
                    transition: 'box-shadow 0.3s ease',
                    '&:hover fieldset': {
                      borderColor: '#f44336',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f44336',
                      boxShadow: '0 0 8px #f44336',
                    },
                  },
                }}
              />

              <TextField
                select
                label="Preferred Body Shape"
                name="bodyShape"
                fullWidth
                value={profile.bodyShape}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    boxShadow: '0 0 5px rgba(244, 67, 54, 0.3)',
                    transition: 'box-shadow 0.3s ease',
                    '&:hover fieldset': {
                      borderColor: '#f44336',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f44336',
                      boxShadow: '0 0 8px #f44336',
                    },
                  },
                }}
              >
                {bodyShapes.map((shape) => (
                  <MenuItem key={shape} value={shape}>
                    {shape}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Goals / Notes"
                name="notes"
                multiline
                rows={4}
                fullWidth
                value={profile.notes}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    boxShadow: '0 0 5px rgba(244, 67, 54, 0.3)',
                    transition: 'box-shadow 0.3s ease',
                    '&:hover fieldset': {
                      borderColor: '#f44336',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f44336',
                      boxShadow: '0 0 8px #f44336',
                    },
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, bgcolor: '#f44336', '&:hover': { bgcolor: '#d32f2f' } }}
                startIcon={<SaveIcon />}
              >
                Save Profile
              </Button>
            </Box>
          ) : (
            !isProfileEmpty && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Name:</strong> {profile.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Age:</strong> {profile.age}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Sex:</strong> {profile.sex}
                </Typography>
                <Typography variant="body1" gutterBottom>
                <strong>Address:</strong> {profile.address}
                </Typography>

                <Typography variant="body1" gutterBottom>
                  <strong>Height:</strong> {profile.height} cm
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Weight:</strong> {profile.weight} kg
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Preferred Body Shape:</strong> {profile.bodyShape}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" gutterBottom>
                  <strong>Goals / Notes:</strong>
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {profile.notes || 'No notes added.'}
                </Typography>
              </Box>
            )
          )}
        </Paper>
      </Container>
    </Box>
  );
}
