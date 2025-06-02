import React from "react";
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip } from "@mui/material";
import { useEffect, useState } from "react";

// Mock payment data
const payments = [
  { id: 1, name: "John Doe", plan: "Premium", status: "Paid", date: "2024-05-30" },
  { id: 2, name: "Jane Smith", plan: "Basic", status: "Pending", date: "2024-05-28" },
  { id: 3, name: "Mike Johnson", plan: "Personal Training", status: "Overdue", date: "2024-05-27" },
];
 


export default function PaymentTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
 useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/auth/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Fetch users error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Payment Status
      </Typography>
      <Paper sx={{ p: { xs: 1, sm: 2 } }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              {/* <TableCell>Plan</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  {/* <TableCell>{user.plan}</TableCell> */}
                  {/* <TableCell>
                    <Chip
                      // label={user.status}
                      color={
                        user.status === "Paid"
                          ? "success"
                          : user.status === "Pending"
                          ? "warning"
                          : "error"
                      }
                    />
                  </TableCell>
                  <TableCell>{new Date(user.date).toLocaleDateString()}</TableCell> */}
                </TableRow>
              ))
            }
            {/* {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.plan}</TableCell>
                <TableCell>
                  <Chip
                    label={p.status}
                    color={
                      p.status === "Paid"
                        ? "success"
                        : p.status === "Pending"
                        ? "warning"
                        : "error"
                    }
                  />
                </TableCell>
                <TableCell>{p.date}</TableCell>
              </TableRow>
            ))} */}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
