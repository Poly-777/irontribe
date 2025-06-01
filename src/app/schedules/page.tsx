// src/app/schedules/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

// Material-UI Imports
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Define interfaces for your data structures
interface Schedule {
  scheduleid: number;
  memberid: number;
  trainerid: number | null;
  dayofweek: string;
  timeslot: string;
}

interface Member {
  memberid: number;
  name: string;
}

interface Trainer {
  trainerid: number;
  name: string;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = [
  '06:00 - 07:00', '07:00 - 08:00', '08:00 - 09:00', '09:00 - 10:00',
  '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00',
  '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00',
  '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00', '21:00 - 22:00',
];

export default function ScheduleManagementPage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [currentSchedule, setCurrentSchedule] = useState<Partial<Schedule>>({
    memberid: undefined,
    trainerid: null,
    dayofweek: '',
    timeslot: '',
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<number | null>(null);

  const fetchSchedules = async () => {
    try {
      const res = await fetch('/api/auth/schedules');
      if (!res.ok) throw new Error('Failed to fetch schedules');
      const data: Schedule[] = await res.json();
      setSchedules(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchMembersAndTrainers = async () => {
    try {
      const membersRes = await fetch('/api/auth/members-list'); // Assuming you'll create this API for members
      const trainersRes = await fetch('/api/auth/trainers-list'); // Assuming you'll create this API for trainers

      if (!membersRes.ok) throw new Error('Failed to fetch members');
      if (!trainersRes.ok) throw new Error('Failed to fetch trainers');

      const membersData: Member[] = await membersRes.json();
      const trainersData: Trainer[] = await trainersRes.json();

      setMembers(membersData);
      setTrainers(trainersData);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    async function initPage() {
      // Basic auth check
      const isAuthenticated = true; // Replace with actual auth check
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(null);

      await fetchSchedules();
      await fetchMembersAndTrainers(); // Fetch lookup data

      setLoading(false);
    }
    initPage();
  }, [router]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentSchedule((prev) => ({
      ...prev,
      [name]: value === '' ? null : value, // Allow null for trainerId if empty
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentSchedule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const endpoint = formMode === 'add' ? '/api/schedules' : '/api/schedules';
    const method = formMode === 'add' ? 'POST' : 'PUT';

    try {
      const payload = {
        memberId: parseInt(currentSchedule.memberid as any), // Ensure it's number
        trainerId: currentSchedule.trainerid ? parseInt(currentSchedule.trainerid as any) : null, // Ensure it's number or null
        dayOfWeek: currentSchedule.dayofweek,
        timeSlot: currentSchedule.timeslot,
        ...(formMode === 'edit' && { scheduleId: currentSchedule.scheduleid }),
      };

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Failed to ${formMode} schedule.`);
      }

      setSuccess(`Schedule ${formMode === 'add' ? 'added' : 'updated'} successfully!`);
      resetForm();
      fetchSchedules(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setFormMode('edit');
    setCurrentSchedule({ ...schedule });
  };

  const handleDeleteClick = (scheduleId: number) => {
    setScheduleToDelete(scheduleId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setOpenDeleteDialog(false);
    if (scheduleToDelete === null) return;

    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/schedules', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduleId: scheduleToDelete }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete schedule.');
      }

      setSuccess('Schedule deleted successfully!');
      fetchSchedules(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setScheduleToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setScheduleToDelete(null);
  };

  const resetForm = () => {
    setFormMode('add');
    setCurrentSchedule({
      memberid: undefined,
      trainerid: null,
      dayofweek: '',
      timeslot: '',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f3f4f6' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2, color: '#4b5563' }}>Loading schedules...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f3f4f6', p: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1f2937', mb: 5 }}>
          Schedule Management
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

        {/* Schedule Form */}
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 3 }}>
            {formMode === 'add' ? 'Add New Schedule' : `Edit Schedule (ID: ${currentSchedule.scheduleid})`}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Member"
                  name="memberid"
                  select
                  fullWidth
                  value={currentSchedule.memberid || ''}
                  onChange={handleSelectChange}
                  required
                  size="small"
                >
                  <MenuItem value="">Select Member</MenuItem>
                  {members.map((member) => (
                    <MenuItem key={member.memberid} value={member.memberid}>
                      {member.name} (ID: {member.memberid})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Trainer"
                  name="trainerid"
                  select
                  fullWidth
                  value={currentSchedule.trainerid || ''}
                  onChange={handleSelectChange}
                  size="small"
                >
                  <MenuItem value="">Select Trainer (Optional)</MenuItem>
                  {trainers.map((trainer) => (
                    <MenuItem key={trainer.trainerid} value={trainer.trainerid}>
                      {trainer.name} (ID: {trainer.trainerid})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Day of Week"
                  name="dayofweek"
                  select
                  fullWidth
                  value={currentSchedule.dayofweek || ''}
                  onChange={handleSelectChange}
                  required
                  size="small"
                >
                  <MenuItem value="">Select Day</MenuItem>
                  {daysOfWeek.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Time Slot"
                  name="timeslot"
                  select
                  fullWidth
                  value={currentSchedule.timeslot || ''}
                  onChange={handleSelectChange}
                  required
                  size="small"
                >
                  <MenuItem value="">Select Time Slot</MenuItem>
                  {timeSlots.map((slot) => (
                    <MenuItem key={slot} value={slot}>
                      {slot}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={formMode === 'add' ? <AddIcon /> : <EditIcon />}
                  >
                    {formMode === 'add' ? 'Add Schedule' : 'Update Schedule'}
                  </Button>
                  {formMode === 'edit' && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={resetForm}
                    >
                      Cancel Edit
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Schedules List */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 3 }}>
            All Schedules
          </Typography>
          {schedules.length === 0 ? (
            <Typography variant="body1" color="text.secondary">No schedules found.</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#e5e7eb' }}>
                    <TableCell sx={{ fontWeight: 'bold', color: '#4b5563' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#4b5563' }}>Member</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#4b5563' }}>Trainer</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#4b5563' }}>Day</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#4b5563' }}>Time Slot</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#4b5563' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedules.map((schedule) => (
                    <TableRow key={schedule.scheduleid} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{schedule.scheduleid}</TableCell>
                      <TableCell>
                        {members.find(m => m.memberid === schedule.memberid)?.name || `ID: ${schedule.memberid}`}
                      </TableCell>
                      <TableCell>
                        {trainers.find(t => t.trainerid === schedule.trainerid)?.name || (schedule.trainerid ? `ID: ${schedule.trainerid}` : 'N/A')}
                      </TableCell>
                      <TableCell>{schedule.dayofweek}</TableCell>
                      <TableCell>{schedule.timeslot}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => handleEdit(schedule)} aria-label="edit">
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteClick(schedule.scheduleid)} aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleCancelDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this schedule? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
