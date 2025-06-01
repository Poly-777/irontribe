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
import { useEffect, useState } from 'react';

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
  const [trainers, setTrainers] = useState(mockTrainers);

  const [form, setForm] = useState({
    memberid: '',
    trainerid: '',
    dayofweek: '',
    timeslot: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting Schedule:', form);

    // Use fetch() or your own DB handler here
    // Example:
    // fetch('/api/schedules', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(form),
    // })

    // Reset form after submission
    setForm({ memberid: '', trainerid: '', dayofweek: '', timeslot: '' });
    alert('Schedule created successfully!');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, marginTop:{md:20,xs:20 }}}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3}}>
        <Typography variant="h5" gutterBottom>
          Create Schedule
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>

          <TextField
            select
            label="Trainer"
            name="trainerid"
            fullWidth
            required
            value={form.trainerid}
            onChange={handleChange}
            margin="normal"
          >
            {trainers.map((t) => (
              <MenuItem key={t.trainerid} value={t.trainerid}>
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
  );
}
