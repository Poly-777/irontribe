'use client';

import {
  Box,
  Container,
  Typography,
  Paper,
  MenuItem,
  TextField,
  Button,
} from '@mui/material';
import { useState } from 'react';
import { useRouter } from "next/navigation";

const mockTrainers = [
  { trainerid: 1, name: 'Diganta' },
  { trainerid: 2, name: 'Priyanku' },
  { trainerid: 3, name: 'Krishnamoni' }
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const timeSlots = [
  '6:00 AM - 7:00 AM',
  '7:00 AM - 8:00 AM',
  '6:00 PM - 7:00 PM',
  '7:00 PM - 8:00 PM',
];

export default function ScheduleForm() {
  const [trainers] = useState(mockTrainers);
 const router = useRouter();
  const [form, setForm] = useState({
    memberid: '',
    trainerName: '',
    dayofweek: '',
    timeslot: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const res = await fetch('/api/auth/schedules', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      trainerName: form.trainerName, // This must be the trainer name
      dayofweek: form.dayofweek,
      timeslot: form.timeslot,
    }),
  });
  try {
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to create schedule');
    }

    // If the response is ok, we can assume the schedule was created successfully
    const data = await res.json();
    console.log('Schedule created:', data);

    // Reset form state
    setForm({
      memberid: '',
      trainerName: '',
      dayofweek: '',
      timeslot: '',
    });
    router.push("/profile");

  } catch (error) {
    console.error('Error creating schedule:', error);
    alert(`Error: ${error.message}`);
  }
};


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
      {/* Dark overlay */}
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

      {/* Form container */}
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Create Schedule
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              select
              label="Trainer"
              name="trainerName"
              fullWidth
              required 
              value={form.trainerName}
              onChange={handleChange}
              margin="normal"
            >
              {trainers.map((t) => (
                <MenuItem key={t.trainerid} value={t.name}>
                  {t.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Day of Week"
              name="dayofweek"
              fullWidth
              required
              value={form.dayofweek}
              onChange={handleChange}
              margin="normal"
            >
              {days.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Time Slot"
              name="timeslot"
              fullWidth
              required
              value={form.timeslot}
              onChange={handleChange}
              margin="normal"
            >
              {timeSlots.map((slot) => (
                <MenuItem key={slot} value={slot}>
                  {slot}
                </MenuItem>
              ))}
            </TextField>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, bgcolor: '#f44336', '&:hover': { bgcolor: '#d32f2f' } }}
            >
              Submit Schedule
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
