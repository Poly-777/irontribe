// src/app/dashboard/page.tsx
'use client'; // Mark as a client component

import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Grid } from '@mui/material';

// Define interfaces for your data structures
interface Schedule {
  scheduleid: number;
  memberid: number;
  trainerid: number | null;
  dayofweek: string;
  timeslot: string;
}

interface Plan {
  planid: number;
  planname: string;
  duration: number;
  price: string; // Use string for NUMERIC type from DB
  description: string;
}

interface Feedback {
  feedbackid: number;
  memberid: number;
  trainerid: number | null;
  feedbackdate: string;
  rating: number;
  comments: string | null;
}

interface Report {
  reportid: number;
  reporttype: string;
  generateddate: string;
  // sqlquery: string; // Omitted for security reasons on frontend
}

export default function DashboardPage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      // Simulate user authentication check
      // In a real app, verify user session/token before fetching data
      const isAuthenticated = true; // Replace with actual auth check
      if (!isAuthenticated) {
        router.push('/login'); // Redirect to login if not authenticated
        return;
      }

      try {
        // Fetch Schedules
        const schedulesRes = await fetch('/api/auth/schedules');
        if (!schedulesRes.ok) throw new Error(`Failed to fetch schedules: ${schedulesRes.statusText}`);
        const schedulesData: Schedule[] = await schedulesRes.json();
        setSchedules(schedulesData);

        // Fetch Plans
        const plansRes = await fetch('/api/auth/plans');
        if (!plansRes.ok) throw new Error(`Failed to fetch plans: ${plansRes.statusText}`);
        const plansData: Plan[] = await plansRes.json();
        setPlans(plansData);

        // Fetch Feedbacks
        const feedbacksRes = await fetch('/api/auth/feedbacks');
        if (!feedbacksRes.ok) throw new Error(`Failed to fetch feedbacks: ${feedbacksRes.statusText}`);
        const feedbacksData: Feedback[] = await feedbacksRes.json();
        setFeedbacks(feedbacksData);

        // Fetch Reports
        const reportsRes = await fetch('/api/auth/reports');
        if (!reportsRes.ok) throw new Error(`Failed to fetch reports: ${reportsRes.statusText}`);
        const reportsData: Report[] = await reportsRes.json();
        setReports(reportsData);

      } catch (err: any) {
        console.error('Dashboard data fetch error:', err);
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f3f4f6' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2, color: '#4b5563' }}>Loading dashboard data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f3f4f6' }}>
        <Alert severity="error" sx={{ width: 'fit-content' }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f3f4f6', p: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1f2937', mb: 5 }}>
          Gym Dashboard
        </Typography>

        {/* Schedules Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 2 }}>
            Your Schedules
          </Typography>
          {schedules.length === 0 ? (
            <Typography variant="body1" color="text.secondary">No schedules found.</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#e5e7eb' }}>
                    <TableCell sx={{ fontWeight: 'bold', color: '#4b5563' }}>Member ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#4b5563' }}>Trainer ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#4b5563' }}>Day</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#4b5563' }}>Time Slot</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedules.map((schedule) => (
                    <TableRow key={schedule.scheduleid} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{schedule.memberid}</TableCell>
                      <TableCell>{schedule.trainerid || 'N/A'}</TableCell>
                      <TableCell>{schedule.dayofweek}</TableCell>
                      <TableCell>{schedule.timeslot}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Plans/Pricing Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 2 }}>
            Membership Plans
          </Typography>
          {plans.length === 0 ? (
            <Typography variant="body1" color="text.secondary">No plans found.</Typography>
          ) : (
            <Grid container spacing={3}>
              {plans.map((plan) => (
                <Grid item xs={12} sm={6} md={4} key={plan.planid}>
                  <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'semibold', color: '#1976d2', mb: 1 }}>
                      {plan.planname}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 1 }}>
                      ${parseFloat(plan.price).toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Duration: {plan.duration} months
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      {plan.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>

        {/* Feedback Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 2 }}>
            Recent Feedbacks
          </Typography>
          {feedbacks.length === 0 ? (
            <Typography variant="body1" color="text.secondary">No feedbacks found.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {feedbacks.map((feedback) => (
                <Paper key={feedback.feedbackid} elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'semibold', color: '#4b5563' }}>
                      Member ID: {feedback.memberid}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(feedback.feedbackdate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="text.secondary" sx={{ color: '#f59e0b', mb: 1 }}>
                    {'★'.repeat(feedback.rating)}{'☆'.repeat(5 - feedback.rating)}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#1f2937' }}>
                    {feedback.comments || 'No comments provided.'}
                  </Typography>
                  {feedback.trainerid && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Trainer ID: {feedback.trainerid}
                    </Typography>
                  )}
                </Paper>
              ))}
            </Box>
          )}
        </Paper>

        {/* Reports Section */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 2 }}>
            Generated Reports
          </Typography>
          {reports.length === 0 ? (
            <Typography variant="body1" color="text.secondary">No reports found.</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#e5e7eb' }}>
                    <TableCell sx={{ fontWeight: 'bold', color: '#4b5563' }}>Report ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#4b5563' }}>Report Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#4b5563' }}>Generated Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.reportid} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{report.reportid}</TableCell>
                      <TableCell>{report.reporttype}</TableCell>
                      <TableCell>{new Date(report.generateddate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

      </Container>
    </Box>
  );
}
