// AttendancePage.tsx
"use client";
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  AppBar,
  Toolbar,
} from "@mui/material";

const AttendancePage = () => {
  const [attendance, setAttendance] = useState<{ name: string; date: string; status: string }[]>([]);
  const [form, setForm] = useState({ name: "", date: "", status: "Present" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttendance([...attendance, form]);
    setForm({ name: "", date: "", status: "Present" });
  };

  return (
    <Box sx={{ bgcolor: "#f4f4f4", minHeight: "100vh", p: 3 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            Attendance System
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: 4, maxWidth: 600, mx: "auto", p: 3, bgcolor: "#fff", borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          Mark Attendance
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            value={form.name}
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Date"
            type="date"
            value={form.date}
            required
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            fullWidth
            margin="normal"
          >
            <MenuItem value="Present">Present</MenuItem>
            <MenuItem value="Absent">Absent</MenuItem>
            <MenuItem value="Late">Late</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Submit
          </Button>
        </form>
      </Box>

      {attendance.length > 0 && (
        <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Attendance Records
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendance.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default AttendancePage;
