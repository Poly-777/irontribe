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
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CancelIcon from "@mui/icons-material/Cancel";
import TodayIcon from "@mui/icons-material/Today";

// Mock data
const initialUsers = [
  {
    id: 1,
    name: "John Doe",
    plan: "Premium",
    paymentStatus: [
      { date: "2024-06-01", paid: true },
      { date: "2024-05-01", paid: true },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    plan: "Basic",
    paymentStatus: [
      { date: "2024-06-01", paid: false },
      { date: "2024-05-01", paid: true },
    ],
  },
  {
    id: 3,
    name: "Mike Johnson",
    plan: "Personal Training",
    paymentStatus: [
      { date: "2024-06-01", paid: true },
      { date: "2024-05-01", paid: false },
    ],
  },
];
 


function getPaymentForDate(user: typeof initialUsers[0], date: string) {
  return user.paymentStatus.find((p) => p.date === date)?.paid ?? false;
}

export default function PaymentTab() {
  const [users, setUsers] = useState(initialUsers);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const paidCount = users.filter((u) =>
    getPaymentForDate(u, selectedDate)
  ).length;
  const unpaidCount = users.length - paidCount;

  const handleMarkPayment = (userId: number, paid: boolean) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              paymentStatus: [
                ...u.paymentStatus.filter((p) => p.date !== selectedDate),
                { date: selectedDate, paid },
              ],
            }
          : u
      )
    );
  };

  return (
    <Box>
      <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold" mb={2}>
        Payment Management
      </Typography>

      <Paper
        sx={{
          p: { xs: 1, sm: 2 },
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <TodayIcon color="primary" />
        <TextField
          type="date"
          size="small"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          sx={{ maxWidth: 200 }}
        />
        <Typography fontWeight="bold" ml={2}>
          Paid: <span style={{ color: "#2e7d32" }}>{paidCount}</span> | Unpaid:{" "}
          <span style={{ color: "#d32f2f" }}>{unpaidCount}</span>
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
                  <TableCell align="center">Payment Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => {
                  const paid = getPaymentForDate(user, selectedDate);
                  return (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <Chip label={user.plan} color="primary" size="small" />
                      </TableCell>
                      <TableCell align="center">
                        {paid ? (
                          <Chip
                            label="Paid"
                            color="success"
                            icon={<AttachMoneyIcon />}
                            size="small"
                          />
                        ) : (
                          <Chip
                            label="Unpaid"
                            color="error"
                            icon={<CancelIcon />}
                            size="small"
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant={paid ? "outlined" : "contained"}
                          color="success"
                          sx={{ mr: 1 }}
                          onClick={() => handleMarkPayment(user.id, true)}
                        >
                          Mark Paid
                        </Button>
                        <Button
                          size="small"
                          variant={!paid ? "outlined" : "contained"}
                          color="error"
                          onClick={() => handleMarkPayment(user.id, false)}
                        >
                          Mark Unpaid
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
