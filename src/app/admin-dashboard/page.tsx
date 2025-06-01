"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LogoutIcon from "@mui/icons-material/Logout";
import TodayIcon from "@mui/icons-material/Today";
import Image from "next/image";
import { useRouter } from "next/navigation";

const drawerWidth = 220;

const sidebarItems = [
  { label: "Dashboard", value: "dashboard" },
  { label: "Attendance", value: "attendance" },
  { label: "Payments", value: "payments" },
  { label: "Settings", value: "settings" },
];


function AttendanceTab({ users, setUsers }: { users: any[]; setUsers: React.Dispatch<React.SetStateAction<any[]>> }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  function getAttendanceForDate(user: typeof users[0], date: string) {
    return user.attendance?.find((a: any) => a.date === date)?.present ?? false;
  }

  const presentCount = users.filter((u) => getAttendanceForDate(u, selectedDate)).length;
  const absentCount = users.length - presentCount;

  const handleMarkAttendance = (userId: number, present: boolean) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              attendance: [
                ...(u.attendance?.filter((a: any) => a.date !== selectedDate) || []),
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
          Present: <span style={{ color: "#2e7d32" }}>{presentCount}</span> | Absent:{" "}
          <span style={{ color: "#d32f2f" }}>{absentCount}</span>
        </Typography>
      </Paper>

      <Paper sx={{ p: { xs: 1, sm: 2 } }}>
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
                        <Chip label="Present" color="success" icon={<CheckCircleIcon />} size="small" />
                      ) : (
                        <Chip label="Absent" color="error" icon={<CancelIcon />} size="small" />
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
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

function PaymentsTab() {
  const payments = [
    { id: 1, name: "John Doe", plan: "Premium", status: "Paid", date: "2024-05-30" },
    { id: 2, name: "Jane Smith", plan: "Basic", status: "Pending", date: "2024-05-28" },
    { id: 3, name: "Mike Johnson", plan: "Personal Training", status: "Overdue", date: "2024-05-27" },
  ];

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
              <TableCell>Plan</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.plan}</TableCell>
                <TableCell>
                  <Chip
                    label={p.status}
                    color={p.status === "Paid" ? "success" : p.status === "Pending" ? "warning" : "error"}
                  />
                </TableCell>
                <TableCell>{p.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

export default function AdminDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const router = useRouter();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6">Loading users...</Typography>
      </Box>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("admin");
    router.push("/admin-login");
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  // Get today's date in yyyy-mm-dd format for attendance check in dashboard
  const today = new Date().toISOString().slice(0, 10);
  const presentTodayCount = users.filter((u) => u.attendance?.some((a: any) => a.date === today && a.present)).length;

  const drawer = (
    <div>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
        <Image src="/logogym.png" alt="logo" width={80} height={60} />
      </Box>
      <List>
        {sidebarItems.map((item) => (
          <ListItem
            button
            key={item.value}
            selected={activeTab === item.value}
            onClick={() => {
              setActiveTab(item.value);
              setMobileOpen(false);
            }}
            sx={{
              bgcolor: activeTab === item.value ? "primary.light" : "inherit",
              color: activeTab === item.value ? "primary.main" : "inherit",
              borderRadius: 1,
              mb: 0.5,
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#f4f6f8" }}>
      {/* Sidebar */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        {/* AppBar */}
        <AppBar position="static" color="default" elevation={0} sx={{ mb: 3 }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            {isMobile && (
              <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap component="div">
              Gym Admin Dashboard
            </Typography>
            <IconButton color="inherit" onClick={handleLogout} title="Logout">
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Tabs & Content */}
        {activeTab === "dashboard" && (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", mb: 3, gap: 2 }}>
              <Paper
                sx={{
                  p: 2,
                  flex: 1,
                  minWidth: 150,
                  textAlign: "center",
                  bgcolor: "#1976d2",
                  color: "#fff",
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Total Users
                </Typography>
                <Typography variant="h4">{users.length}</Typography>
              </Paper>
              <Paper
                sx={{
                  p: 2,
                  flex: 1,
                  minWidth: 150,
                  textAlign: "center",
                  bgcolor: "#2e7d32",
                  color: "#fff",
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Present Today
                </Typography>
                <Typography variant="h4">{presentTodayCount}</Typography>
              </Paper>
            </Box>

            <TextField
              fullWidth
              placeholder="Search users by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Plan</TableCell>
                    <TableCell>Attendance Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.plan}</TableCell>
                      <TableCell>{user.attendance?.length || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {activeTab === "attendance" && <AttendanceTab users={users} setUsers={setUsers} />}
        {activeTab === "payments" && <PaymentsTab />}
        {activeTab === "settings" && (
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Settings
            </Typography>
            <Typography mt={2}>No settings configured yet.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
