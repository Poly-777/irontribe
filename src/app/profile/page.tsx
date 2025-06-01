// src/app/profile/page.tsx
'use client';

import { useState, useEffect, FormEvent, SyntheticEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dayjs, { Dayjs } from 'dayjs'; // Import dayjs

// Material-UI Imports
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Button,
  TextField,
  MenuItem,
  Grid, // Make sure Grid is imported
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
  Fade,
  Chip, // For attendance status
  Link, // Import Link for terms and conditions
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close'; // For "Cancel Edit" button
import DeleteIcon from '@mui/icons-material/Delete'; // For deleting schedules

// Define interfaces for data structures
interface ProfileData {
  memberid?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  dob: string; // Watanabe-MM-DD
  gender: string;
  joindate: string; // Watanabe-MM-DD
  membershipstatus: string;
  termsaccepted: boolean;
  isNewMember?: boolean; // Custom flag for new members
}

interface Trainer {
  TrainerID: number;
  Name: string;
  Specialization: string;
}

interface Plan {
  PlanID: number;
  PlanName: string;
  Price: number;
  Duration: number;
}

interface Payment {
  PaymentID: number;
  MemberID: number;
  Amount: string; // Use string for NUMERIC from DB
  PaymentDate: string; // Watanabe-MM-DD
  DueDate: string | null; // Watanabe-MM-DD or null
  PaymentStatus: string;
  PlanID: number | null;
}

interface Attendance {
  AttendanceID: number;
  MemberID: number;
  CheckInDate: string; // Watanabe-MM-DD
}

interface Schedule {
  ScheduleID: number; // Corrected from scheduleid to ScheduleID to match DB schema
  MemberID: number;
  TrainerID: number | null;
  DayOfWeek: string;
  TimeSlot: string;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = [
  '06:00 - 07:00', '07:00 - 08:00', '08:00 - 09:00', '09:00 - 10:00',
  '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00',
  '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00',
  '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00', '21:00 - 22:00',
];

// Helper for Tab Panel content
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formFields, setFormFields] = useState<ProfileData>({
    name: '', email: '', phone: '', address: '', dob: '', gender: '',
    joindate: dayjs().format('YYYY-MM-DD'), // Default to today using dayjs
    membershipstatus: 'Pending', termsaccepted: false
  });

  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [attendanceHistory, setAttendanceHistory] = useState<Attendance[]>([]);
  const [memberSchedules, setMemberSchedules] = useState<Schedule[]>([]);

  const [trainersList, setTrainersList] = useState<Trainer[]>([]);
  const [plansList, setPlansList] = useState<Plan[]>([]);

  const [currentTab, setCurrentTab] = useState(0); // For Material-UI Tabs

  // Profile Image Upload states
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for new payment form
  const [newPayment, setNewPayment] = useState({
    amount: '',
    dueDate: '',
    paymentStatus: 'Paid',
    planId: '',
    paymentMethod: 'UPI', // Added payment method
  });

  // State for new schedule form
  const [newSchedule, setNewSchedule] = useState({
    trainerId: '',
    dayOfWeek: '',
    timeSlot: '',
  });

  // Dialog for check-in confirmation
  const [openCheckInDialog, setOpenCheckInDialog] = useState(false);
  // Dialog for schedule deletion
  const [openDeleteScheduleDialog, setOpenDeleteScheduleDialog] = useState(false);
  const [scheduleToDeleteId, setScheduleToDeleteId] = useState<number | null>(null);


  // --- Data Fetching Functions ---
  const fetchProfileData = async () => {
    try {
      const res = await fetch('/api/auth/profile');
      if (res.status === 401) {
        router.push('/login'); // Redirect to login if unauthorized
        return null;
      }
      if (!res.ok) throw new Error('Failed to fetch profile data');
      const data: ProfileData = await res.json();
      setProfileData(data);
      // Ensure DOB and JoinDate are formatted as Watanabe-MM-DD for input type="date"
      setFormFields({
        ...data,
        dob: data.dob ? dayjs(data.dob).format('YYYY-MM-DD') : '',
        joindate: data.joindate ? dayjs(data.joindate).format('YYYY-MM-DD') : '',
      });
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/auth/payments');
      if (!res.ok) throw new Error('Failed to fetch payment history');
      const data: Payment[] = await res.json();
      setPaymentHistory(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await fetch('/api/auth/attendance');
      if (!res.ok) throw new Error('Failed to fetch attendance history');
      const data: Attendance[] = await res.json();
      setAttendanceHistory(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchMemberSchedules = async () => {
    try {
      const res = await fetch('/api/auth/member-schedules');
      if (!res.ok) throw new Error('Failed to fetch member schedules');
      const data: Schedule[] = await res.json();
      setMemberSchedules(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchTrainersAndPlans = async () => {
    try {
      const trainersRes = await fetch('/api/auth/trainers-list');
      const plansRes = await fetch('/api/auth/plans-list');

      if (!trainersRes.ok) throw new Error('Failed to fetch trainers list');
      if (!plansRes.ok) throw new Error('Failed to fetch plans list');

      const trainersData: Trainer[] = await trainersRes.json();
      const plansData: Plan[] = await plansRes.json();

      setTrainersList(trainersData);
      setPlansList(plansData);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // --- Initial Data Load Effect ---
  useEffect(() => {
    async function initPage() {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const profile = await fetchProfileData();
      if (profile) {
        await fetchPayments();
        await fetchAttendance();
        await fetchMemberSchedules();
        await fetchTrainersAndPlans(); // Fetch lists for dropdowns
      }
      setLoading(false);
    }
    initPage();
  }, [router]);

  // --- Profile Form Handlers ---
  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleProfileFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormFields({ ...formFields, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormFields({ ...formFields, [name]: value });
    }
  };

  const handleDateChange = (date: Dayjs | null, name: string) => {
    setFormFields((prev) => ({
      ...prev,
      [name]: date ? date.format('YYYY-MM-DD') : '',
    }));
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Basic client-side validation for required fields
    if (!formFields.name || !formFields.email || !formFields.phone || !formFields.dob || !formFields.gender) {
      setError('Please fill in all required profile fields (Name, Email, Phone, DOB, Gender).');
      setLoading(false);
      return;
    }
    if (!formFields.termsaccepted) {
      setError('You must accept the terms and conditions.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formFields,
        memberId: profileData?.memberid, // Pass memberId if exists for update
      };

      const res = await fetch('/api/auth/profile', {
        method: 'POST', // Use POST for both create/update as per API design
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save profile.');
      }

      setProfileData(data); // Update profile data with response
      // Re-format dates for form fields consistency after update
      setFormFields({
        ...data,
        dob: data.dob ? dayjs(data.dob).format('YYYY-MM-DD') : '',
        joindate: data.joindate ? dayjs(data.joindate).format('YYYY-MM-DD') : '',
      });
      setSuccess('Profile saved successfully!');
      setIsEditing(false); // Exit edit mode
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Profile Image Upload Handlers ---
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setUploadFeedback('File size exceeds 2MB limit.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setUploadFeedback('Only image files are allowed.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
      setUploadFeedback('Image selected successfully!');
      // In a real app, you'd send this to an upload API here
      // For now, it's just a preview.
      setTimeout(() => setUploadFeedback(null), 3000); // Clear feedback after 3 seconds
    };
    reader.readAsDataURL(file);
  };

  // --- Payments Tab Handlers ---
  const handleNewPaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPayment((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPayment = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!newPayment.amount || !newPayment.paymentStatus) {
      setError('Amount and Payment Status are required for payment.');
      return;
    }

    try {
      const res = await fetch('/api/auth/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPayment,
          amount: parseFloat(newPayment.amount), // Ensure amount is a number for DB
          planId: newPayment.planId ? parseInt(newPayment.planId) : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add payment.');
      }

      setSuccess('Payment added successfully!');
      setNewPayment({ amount: '', dueDate: '', paymentStatus: 'Paid', planId: '', paymentMethod: 'UPI' }); // Reset form
      fetchPayments(); // Refresh payment history
    } catch (err: any) {
      setError(err.message);
    }
  };

  // --- Schedules Tab Handlers ---
  const handleNewScheduleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSchedule((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSchedule = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!newSchedule.dayOfWeek || !newSchedule.timeSlot) {
      setError('Day of Week and Time Slot are required for schedule.');
      return;
    }

    try {
      const payload = {
        trainerId: newSchedule.trainerId ? parseInt(newSchedule.trainerId) : null,
        dayOfWeek: newSchedule.dayOfWeek,
        timeSlot: newSchedule.timeSlot,
      };

      const res = await fetch('/api/auth/member-schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add schedule.');
      }

      setSuccess('Schedule added successfully!');
      setNewSchedule({ trainerId: '', dayOfWeek: '', timeSlot: '' }); // Reset form
      fetchMemberSchedules(); // Refresh schedules
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteScheduleClick = (scheduleId: number) => {
    setScheduleToDeleteId(scheduleId);
    setOpenDeleteScheduleDialog(true);
  };

  const handleDeleteScheduleConfirm = async () => {
    setOpenDeleteScheduleDialog(false);
    if (scheduleToDeleteId === null) return;

    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/auth/member-schedules', { // Using the same API for DELETE
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduleId: scheduleToDeleteId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete schedule.');
      }

      setSuccess('Schedule deleted successfully!');
      fetchMemberSchedules(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setScheduleToDeleteId(null);
    }
  };

  const handleCancelDeleteSchedule = () => {
    setOpenDeleteScheduleDialog(false);
    setScheduleToDeleteId(null);
  };


  // --- Attendance Tab Handlers ---
  const handleCheckIn = async () => {
    setOpenCheckInDialog(false); // Close dialog first
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/auth/attendance/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to check in.');
      }

      setSuccess(data.message || 'Checked in successfully!');
      fetchAttendance(); // Refresh attendance history
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f3f4f6' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2, color: '#4b5563' }}>Loading profile...</Typography>
      </Box>
    );
  }

  if (error && !profileData) { // Show full error if no profile data could be loaded
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f3f4f6' }}>
        <Alert severity="error" sx={{ width: 'fit-content' }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f3f4f6', p: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1f2937', mb: 5 }}>
            Member Profile
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

          <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 4, mb: 3 }}>
              {/* Profile Image Upload */}
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid #1976d2',
                  flexShrink: 0,
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: '#e0e0e0',
                  cursor: 'pointer',
                  '&:hover .upload-overlay': { opacity: 1 },
                }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt="Profile Preview"
                    width={120}
                    height={120}
                    objectFit="cover"
                  />
                ) : (
                  <Image
                    src="/person.jpg" // Default placeholder
                    alt="Default Profile"
                    width={120}
                    height={120}
                    objectFit="cover"
                  />
                )}
                <Box
                  className="upload-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                    borderRadius: '50%',
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 40 }} />
                  <Typography variant="caption">Upload Photo</Typography>
                </Box>
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </Box>

              <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 1 }}>
                  {profileData?.name || 'N/A'}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
                  Email: {profileData?.email || 'N/A'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Phone: {profileData?.phone || 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: { xs: 2, sm: 0 } }}>
                <Button
                  variant="contained"
                  startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </Button>
                {isEditing && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CloseIcon />}
                    onClick={() => {
                        setIsEditing(false);
                        if (profileData) {
                           setFormFields({
                             ...profileData,
                             dob: profileData.dob ? dayjs(profileData.dob).format('YYYY-MM-DD') : '',
                             joindate: profileData.joindate ? dayjs(profileData.joindate).format('YYYY-MM-DD') : '',
                           });
                        }
                    }}
                  >
                    Close Form
                  </Button>
                )}
              </Box>
            </Box>
            {uploadFeedback && (
              <Fade in={!!uploadFeedback} timeout={500}>
                <Alert severity={uploadFeedback.includes('successfully') ? 'success' : 'error'} sx={{ mt: 2 }}>
                  {uploadFeedback}
                </Alert>
              </Fade>
            )}


            {/* Profile Edit Form */}
            {isEditing && (
              <Box component="form" onSubmit={handleProfileSubmit} sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Edit Profile Details</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} component="div"> {/* Added component="div" */}
                    <TextField
                      label="Full Name"
                      name="name"
                      fullWidth
                      value={formFields.name}
                      onChange={handleProfileFormChange}
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} component="div"> {/* Added component="div" */}
                    <TextField
                      label="Email"
                      name="email"
                      fullWidth
                      value={formFields.email}
                      onChange={handleProfileFormChange}
                      required
                      type="email"
                      size="small"
                      disabled // Email should typically not be editable if it's the primary user identifier
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} component="div"> {/* Added component="div" */}
                    <TextField
                      label="Phone"
                      name="phone"
                      fullWidth
                      value={formFields.phone}
                      onChange={handleProfileFormChange}
                      required
                      type="tel"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} component="div"> {/* Added component="div" */}
                    <TextField
                      label="Address"
                      name="address"
                      fullWidth
                      value={formFields.address}
                      onChange={handleProfileFormChange}
                      multiline
                      rows={2}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} component="div"> {/* Added component="div" */}
                    <DatePicker
                      label="Date of Birth"
                      value={formFields.dob ? dayjs(formFields.dob) : null}
                      onChange={(date) => handleDateChange(date, 'dob')}
                      slotProps={{ textField: { fullWidth: true, required: true, size: 'small' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} component="div"> {/* Added component="div" */}
                    <TextField
                      label="Gender"
                      name="gender"
                      select
                      fullWidth
                      value={formFields.gender}
                      onChange={handleProfileFormChange}
                      required
                      size="small"
                    >
                      <MenuItem value="">Select Gender</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Non-binary">Non-binary</MenuItem>
                      <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} component="div"> {/* Added component="div" */}
                    <DatePicker
                      label="Join Date"
                      value={formFields.joindate ? dayjs(formFields.joindate) : null}
                      onChange={(date) => handleDateChange(date, 'joindate')}
                      slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                      readOnly // Typically read-only, set by system
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} component="div"> {/* Added component="div" */}
                    <TextField
                      label="Membership Status"
                      name="membershipstatus"
                      select
                      fullWidth
                      value={formFields.membershipstatus}
                      onChange={handleProfileFormChange}
                      required
                      size="small"
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Expired">Expired</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} component="div"> {/* Added component="div" */}
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formFields.termsaccepted}
                          onChange={handleProfileFormChange}
                          name="termsaccepted"
                          color="primary"
                        />
                      }
                      label={
                        <Typography>
                          I accept the{' '}
                          <Link href="#" color="primary" onClick={(e) => e.preventDefault()} sx={{ textDecoration: 'underline' }}>
                            terms and conditions
                          </Link>
                        </Typography>
                      }
                    />
                  </Grid>
                  <Grid item xs={12} component="div"> {/* Added component="div" */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        disabled={loading}
                        sx={{
                          '&:hover': {
                            transform: 'scale(1.02)',
                            transition: 'transform 0.2s ease-in-out',
                          },
                        }}
                      >
                        Save Profile
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                          setIsEditing(false);
                          if (profileData) {
                             // Reset form to original data, ensuring date format consistency
                             setFormFields({
                               ...profileData,
                               dob: profileData.dob ? dayjs(profileData.dob).format('YYYY-MM-DD') : '',
                               joindate: profileData.joindate ? dayjs(profileData.joindate).format('YYYY-MM-DD') : '',
                             });
                          }
                        }}
                        sx={{
                          '&:hover': {
                            transform: 'scale(1.02)',
                            transition: 'transform 0.2s ease-in-out',
                          },
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>

          {/* Tabs for other sections */}
          <Paper elevation={3} sx={{ borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={currentTab} onChange={handleTabChange} aria-label="profile sections tabs" variant="fullWidth">
                <Tab label="Schedules" {...a11yProps(0)} />
                <Tab label="Payments" {...a11yProps(1)} />
                <Tab label="Attendance" {...a11yProps(2)} />
              </Tabs>
            </Box>

            {/* Schedules Tab */}
            <TabPanel value={currentTab} index={0}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Your Personal Schedules</Typography>
              <Box component="form" onSubmit={handleAddSchedule} sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>Add New Schedule</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} component="div">
                    <TextField
                      label="Trainer"
                      name="trainerId"
                      select
                      fullWidth
                      value={newSchedule.trainerId}
                      onChange={handleNewScheduleChange}
                      size="small"
                    >
                      <MenuItem value="">Select Trainer (Optional)</MenuItem>
                      {trainersList.map((trainer) => (
                        <MenuItem key={trainer.TrainerID} value={trainer.TrainerID}>
                          {trainer.Name} ({trainer.Specialization})
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} component="div">
                    <TextField
                      label="Day of Week"
                      name="dayOfWeek"
                      select
                      fullWidth
                      value={newSchedule.dayOfWeek}
                      onChange={handleNewScheduleChange}
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
                  <Grid item xs={12} sm={6} component="div">
                    <TextField
                      label="Time Slot"
                      name="timeSlot"
                      select
                      fullWidth
                      value={newSchedule.timeSlot}
                      onChange={handleNewScheduleChange}
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
                  <Grid item xs={12} component="div">
                    <Button type="submit" variant="contained" startIcon={<AddIcon />}
                      sx={{
                        '&:hover': {
                          transform: 'scale(1.02)',
                          transition: 'transform 0.2s ease-in-out',
                        },
                      }}
                    >Add Schedule</Button>
                  </Grid>
                </Grid>
              </Box>

              {memberSchedules.length === 0 ? (
                <Typography variant="body1" color="text.secondary">No schedules found for you.</Typography>
              ) : (
                <TableContainer component={Paper} elevation={1}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#e5e7eb' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Trainer</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Day</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Time Slot</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {memberSchedules.map((schedule) => (
                        <TableRow key={schedule.ScheduleID}>
                          <TableCell>{schedule.ScheduleID}</TableCell>
                          <TableCell>
                            {trainersList.find(t => t.TrainerID === schedule.TrainerID)?.Name || (schedule.TrainerID ? `ID: ${schedule.TrainerID}` : 'N/A')}
                          </TableCell>
                          <TableCell>{schedule.DayOfWeek}</TableCell>
                          <TableCell>{schedule.TimeSlot}</TableCell>
                          <TableCell align="center">
                            <IconButton color="error" onClick={() => handleDeleteScheduleClick(schedule.ScheduleID)} aria-label="delete schedule">
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </TabPanel>

            {/* Payments Tab */}
            <TabPanel value={currentTab} index={1}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Payment History</Typography>
              <Box component="form" onSubmit={handleAddPayment} sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>Add New Payment</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4} component="div">
                    <TextField
                      label="Amount"
                      name="amount"
                      fullWidth
                      value={newPayment.amount}
                      onChange={handleNewPaymentChange}
                      required
                      type="number"
                      inputProps={{ step: "0.01" }}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} component="div">
                    <TextField
                      label="Due Date"
                      name="dueDate"
                      fullWidth
                      type="date"
                      value={newPayment.dueDate}
                      onChange={handleNewPaymentChange}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} component="div">
                    <TextField
                      label="Payment Status"
                      name="paymentStatus"
                      select
                      fullWidth
                      value={newPayment.paymentStatus}
                      onChange={handleNewPaymentChange}
                      required
                      size="small"
                    >
                      <MenuItem value="Paid">Paid</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Overdue">Overdue</MenuItem>
                      <MenuItem value="Failed">Failed</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} component="div">
                    <TextField
                      label="Associated Plan"
                      name="planId"
                      select
                      fullWidth
                      value={newPayment.planId}
                      onChange={handleNewPaymentChange}
                      size="small"
                    >
                      <MenuItem value="">Select Plan (Optional)</MenuItem>
                      {plansList.map((plan) => (
                        <MenuItem key={plan.PlanID} value={plan.PlanID}>
                          {plan.PlanName} (${plan.Price.toFixed(2)})
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} component="div">
                    <TextField
                      label="Payment Method"
                      name="paymentMethod"
                      select
                      fullWidth
                      value={newPayment.paymentMethod}
                      onChange={handleNewPaymentChange}
                      required
                      size="small"
                    >
                      <MenuItem value="UPI">UPI</MenuItem>
                      <MenuItem value="Card">Card</MenuItem>
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} component="div">
                    <Button type="submit" variant="contained" startIcon={<AddIcon />}
                      sx={{
                        '&:hover': {
                          transform: 'scale(1.02)',
                          transition: 'transform 0.2s ease-in-out',
                        },
                      }}
                    >Add Payment</Button>
                  </Grid>
                </Grid>
              </Box>

              {paymentHistory.length === 0 ? (
                <Typography variant="body1" color="text.secondary">No payment history found.</Typography>
              ) : (
                <TableContainer component={Paper} elevation={1}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#e5e7eb' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Plan</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Method</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paymentHistory.map((payment) => (
                        <TableRow key={payment.PaymentID}>
                          <TableCell>{payment.PaymentID}</TableCell>
                          <TableCell>${parseFloat(payment.Amount).toFixed(2)}</TableCell>
                          <TableCell>{dayjs(payment.PaymentDate).format('YYYY-MM-DD')}</TableCell>
                          <TableCell>{payment.DueDate ? dayjs(payment.DueDate).format('YYYY-MM-DD') : 'N/A'}</TableCell>
                          <TableCell>
                            <Chip
                              label={payment.PaymentStatus}
                              color={
                                payment.PaymentStatus === 'Paid' ? 'success' :
                                payment.PaymentStatus === 'Pending' ? 'warning' :
                                'error'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {plansList.find(p => p.PlanID === payment.PlanID)?.PlanName || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {/* Assuming payment method is stored or derived, for now, hardcoded or add to schema */}
                            N/A {/* Placeholder, you'd fetch this if stored */}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </TabPanel>

            {/* Attendance Tab */}
            <TabPanel value={currentTab} index={2}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Attendance Tracker</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CheckCircleOutlineIcon />}
                onClick={() => setOpenCheckInDialog(true)}
                sx={{ mb: 3,
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
              >
                Check-in Today
              </Button>

              {attendanceHistory.length === 0 ? (
                <Typography variant="body1" color="text.secondary">No attendance history found.</Typography>
              ) : (
                <TableContainer component={Paper} elevation={1}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#e5e7eb' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Check-in Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell> {/* Added Status column */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {attendanceHistory.map((attendance) => (
                        <TableRow key={attendance.AttendanceID}>
                          <TableCell>{attendance.AttendanceID}</TableCell>
                          <TableCell>{dayjs(attendance.CheckInDate).format('YYYY-MM-DD')}</TableCell>
                          <TableCell>
                            <Chip
                              label="Present" // Assuming all fetched attendance means 'Present'
                              color="success"
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </TabPanel>
          </Paper>

          {/* Check-in Confirmation Dialog */}
          <Dialog
            open={openCheckInDialog}
            onClose={() => setOpenCheckInDialog(false)}
            aria-labelledby="checkin-dialog-title"
            aria-describedby="checkin-dialog-description"
          >
            <DialogTitle id="checkin-dialog-title">{"Confirm Check-in"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="checkin-dialog-description">
                Are you sure you want to check-in for today?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenCheckInDialog(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleCheckIn} color="primary" autoFocus>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Schedule Confirmation Dialog */}
          <Dialog
            open={openDeleteScheduleDialog}
            onClose={handleCancelDeleteSchedule}
            aria-labelledby="delete-schedule-dialog-title"
            aria-describedby="delete-schedule-dialog-description"
          >
            <DialogTitle id="delete-schedule-dialog-title">{"Confirm Schedule Deletion"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="delete-schedule-dialog-description">
                Are you sure you want to delete this schedule? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDeleteSchedule} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDeleteScheduleConfirm} color="error" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>

        </Container>
      </Box>
    </LocalizationProvider>
  );
}
