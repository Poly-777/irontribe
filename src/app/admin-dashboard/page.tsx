"use client";
import React, { useState } from "react";
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
  { label: "Users", value: "users" },
  { label: "Attendance", value: "attendance" },
  { label: "Payments", value: "payments" },
  { label: "Settings", value: "settings" },
];

// Mock user data
const initialUsers = [
  {
    id: 1,
    name: "John Doe",
    plan: "Premium",
    paymentStatus: "Paid",
    lastAttendance: "2024-05-30",
    attendance: [
      { date: "2024-05-30", present: true },
      { date: "2024-05-29", present: true },
      { date: "2024-05-28", present: false },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    plan: "Basic",
    paymentStatus: "Pending",
    lastAttendance: "2024-05-28",
    attendance: [
      { date: "2024-05-30", present: false },
      { date: "2024-05-29", present: false },
      { date: "2024-05-28", present: true },
    ],
  },
  {
    id: 3,
    name: "Mike Johnson",
    plan: "Personal Training",
    paymentStatus: "Overdue",
    lastAttendance: "2024-05-27",
    attendance: [
      { date: "2024-05-30", present: false },
      { date: "2024-05-29", present: false },
      { date: "2024-05-28", present: false },
    ],
  },
];

function AttendanceTab({ users, setUsers }: { users: typeof initialUsers; setUsers: any }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  function getAttendanceForDate(user: typeof initialUsers[0], date: string) {
    return user.attendance.find((a) => a.date === date)?.present ?? false;
  }

  const presentCount = users.filter((u) => getAttendanceForDate(u, selectedDate)).length;
  const absentCount = users.length - presentCount;

  const handleMarkAttendance = (userId: number, present: boolean) => {
    setUsers((prev: typeof initialUsers) =>
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

// Example PaymentsTab component
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
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

export default function AdminDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState<typeof initialUsers[0] | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const router = useRouter();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserClick = (user: typeof initialUsers[0]) => {
    setSelectedUser(user);
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    router.push("/admin-login");
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const drawer = (
    <div>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
        <Image src="/logogym.png" alt="logo" width={80} height={60} style={{ maxWidth: "100%" }} />
      </Box>
      <List>
        {sidebarItems.map((item) => (
          <ListItem
            button
            key={item.value}
            selected={activeTab === item.value}
            onClick={() => {
              setActiveTab(item.value);
              setSelectedUser(null);
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
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
        aria-label="admin sidebar"
      >
        {/* Mobile Drawer */}
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
        {/* Desktop Drawer */}
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
      <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 3 } }}>
        {/* Top Bar */}
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            bgcolor: "#1976d2",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
              aria-label="open drawer"
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Admin Dashboard
            </Typography>
            <IconButton color="inherit" onClick={handleLogout} title="Logout">
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Toolbar /> {/* Offset for AppBar */}

        {/* Main Content Area */}
        {activeTab === "dashboard" && (
          <>
            {/* Quick Stats */}
            <Typography
              variant={isMobile ? "h6" : "h4"}
              fontWeight="bold"
              mb={isMobile ? 1 : 3}
              mt={isMobile ? 1 : 0}
            >
              Welcome, Admin!
            </Typography>
            <Grid container spacing={isMobile ? 1 : 3} mb={isMobile ? 1 : 3}>
              <Grid item xs={12} sm={4}>
                <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, textAlign: "center" }}>
                  <Typography variant="subtitle2" color="primary">
                    Total Users
                  </Typography>
                  <Typography variant={isMobile ? "h6" : "h4"} fontWeight="bold" mt={1}>
                    {users.length}
                  </Typography>
                  <Typography color="text.secondary" mt={1} fontSize={isMobile ? 12 : 14}>
                    Registered Members
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, textAlign: "center" }}>
                  <Typography variant="subtitle2" color="primary">
                    Paid Members
                  </Typography>
                  <Typography variant={isMobile ? "h6" : "h4"} fontWeight="bold" mt={1}>
                    {users.filter((u) => u.paymentStatus === "Paid").length}
                  </Typography>
                  <Typography color="text.secondary" mt={1} fontSize={isMobile ? 12 : 14}>
                    Up to date with payments
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, textAlign: "center" }}>
                  <Typography variant="subtitle2" color="primary">
                    Attendance Today
                  </Typography>
                  <Typography variant={isMobile ? "h6" : "h4"} fontWeight="bold" mt={1}>
                    {users.filter((u) => u.attendance[0]?.present).length}
                  </Typography>
                  <Typography color="text.secondary" mt={1} fontSize={isMobile ? 12 : 14}>
                    Present today
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            {/* User Table */}
            <Paper elevation={3} sx={{ p: { xs: 1, sm: 3 }, mb: isMobile ? 1 : 3 }}>
              <Box
                display="flex"
                flexDirection={isMobile ? "column" : "row"}
                justifyContent="space-between"
                alignItems={isMobile ? "stretch" : "center"}
                mb={isMobile ? 1 : 2}
                gap={isMobile ? 1 : 0}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Users & Plans
                </Typography>
                <TextField
                  size="small"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: isMobile ? "100%" : 240 }}
                />
              </Box>
              <Box sx={{ width: "100%", overflowX: "auto" }}>
                <TableContainer>
                  <Table size={isMobile ? "small" : "medium"}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Plan</TableCell>
                        <TableCell>Last Attendance</TableCell>
                        <TableCell>Payment</TableCell>
                        <TableCell>Attendance</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} hover>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>
                            <Chip label={user.plan} color="primary" size="small" />
                          </TableCell>
                          <TableCell>{user.lastAttendance}</TableCell>
                          <TableCell>
                            <Chip
                              label={user.paymentStatus}
                              color={
                                user.paymentStatus === "Paid"
                                  ? "success"
                                  : user.paymentStatus === "Pending"
                                  ? "warning"
                                  : "error"
                              }
                              icon={
                                user.paymentStatus === "Paid" ? (
                                  <CheckCircleIcon fontSize="small" />
                                ) : (
                                  <CancelIcon fontSize="small" />
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            {user.attendance[0]?.present ? (
                              <Chip label="Present" color="success" size="small" />
                            ) : (
                              <Chip label="Absent" color="error" size="small" />
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleUserClick(user)}
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredUsers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            No users found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Paper>
            {/* User Details Drawer/Modal */}
            {selectedUser && (
              <Paper
                elevation={6}
                sx={{
                  p: { xs: 1.5, sm: 3 },
                  mb: isMobile ? 1 : 3,
                  background: "#e3f2fd",
                  maxWidth: 600,
                  mx: "auto",
                }}
              >
                <Box
                  display="flex"
                  flexDirection={isMobile ? "column" : "row"}
                  justifyContent="space-between"
                  alignItems={isMobile ? "stretch" : "center"}
                  gap={isMobile ? 1 : 0}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {selectedUser.name} - Details
                  </Typography>
                  <Button onClick={() => setSelectedUser(null)} size="small">
                    Close
                  </Button>
                </Box>
                <Typography mt={2}>
                  <strong>Plan:</strong> {selectedUser.plan}
                </Typography>
                <Typography>
                  <strong>Payment Status:</strong>{" "}
                  <Chip
                    label={selectedUser.paymentStatus}
                    color={
                      selectedUser.paymentStatus === "Paid"
                        ? "success"
                        : selectedUser.paymentStatus === "Pending"
                        ? "warning"
                        : "error"
                    }
                    size="small"
                  />
                </Typography>
                <Typography mt={2} fontWeight="bold">
                  Attendance (Recent):
                </Typography>
                <Box sx={{ width: "100%", overflowX: "auto" }}>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedUser.attendance.map((att, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{att.date}</TableCell>
                            <TableCell>
                              {att.present ? (
                                <Chip label="Present" color="success" size="small" />
                              ) : (
                                <Chip label="Absent" color="error" size="small" />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Paper>
            )}
          </>
        )}

        {activeTab === "attendance" && (
          <AttendanceTab users={users} setUsers={setUsers} />
        )}

        {activeTab === "payments" && <PaymentsTab />}

        {/* Add more tab components here as needed */}
      </Box>
    </Box>
  );
}
