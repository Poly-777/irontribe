"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  TextField,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import TodayIcon from "@mui/icons-material/Today";

// Mock user data
const initialUsers = [
  {
    id: 1,
    name: "John Doe",
    plan: "Premium",
    attendance: [
      { date: "2024-05-31", present: true },
      { date: "2024-05-30", present: true },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    plan: "Basic",
    attendance: [
      { date: "2024-05-31", present: false },
      { date: "2024-05-30", present: false },
    ],
  },
  {
    id: 3,
    name: "Mike Johnson",
    plan: "Personal Training",
    attendance: [
      { date: "2024-05-31", present: false },
      { date: "2024-05-30", present: true },
    ],
  },
];

function getAttendanceForDate(user: typeof initialUsers[0], date: string) {
  return user.attendance.find((a) => a.date === date)?.present ?? false;
}

export default function AttendanceTab() {
  const [users, setUsers] = useState(initialUsers);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Count stats
  const presentCount = users.filter((u) =>
    getAttendanceForDate(u, selectedDate)
  ).length;
  const absentCount = users.length - presentCount;

  // Mark attendance
  const handleMarkAttendance = (userId: number, present: boolean) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              attendance: [
                ...u.attendance.filter((a) => a.date !== selectedDate),
                { date: selectedDate, present },
              ],
            }
          : u
      )
    );
  };

  return (
    <Box>
      <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold" mb={2}>
        Attendance Management
      </Typography>

      <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <TodayIcon color="primary" />
        <TextField
          type="date"
          size="small"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          sx={{ maxWidth: 200 }}
        />
        <Typography fontWeight="bold" ml={2}>
          Present: <span style={{ color: "#2e7d32" }}>{presentCount}</span> | Absent: <span style={{ color: "#d32f2f" }}>{absentCount}</span>
        </Typography>
      </Paper>

      <Paper sx={{ p: { xs: 1, sm: 2 } }}>
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <TableContainer>
            <Table size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => {
                  const present = getAttendanceForDate(user, selectedDate);
                  return (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <Chip label={user.plan} color="primary" size="small" />
                      </TableCell>
                      <TableCell align="center">
                        {present ? (
                          <Chip
                            label="Present"
                            color="success"
                            icon={<CheckCircleIcon />}
                            size="small"
                          />
                        ) : (
                          <Chip
                            label="Absent"
                            color="error"
                            icon={<CancelIcon />}
                            size="small"
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant={present ? "outlined" : "contained"}
                          color="success"
                          sx={{ mr: 1 }}
                          onClick={() => handleMarkAttendance(user.id, true)}
                        >
                          Mark Present
                        </Button>
                        <Button
                          size="small"
                          variant={!present ? "outlined" : "contained"}
                          color="error"
                          onClick={() => handleMarkAttendance(user.id, false)}
                        >
                          Mark Absent
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Box>
  );
}
