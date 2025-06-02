'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Paper,
  Divider,
  ClickAwayListener,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = ['Home', 'About', 'Gallery', 'pricing', 'Trainers', 'Contact'];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  // New state for user info
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Fetch from localStorage on mount
  useEffect(() => {
    const name = localStorage.getItem('name') || 'Guest';
    const email = localStorage.getItem('emailid') || 'guest@example.com';

    setUserName(name);
    setUserEmail(email);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleDropdownClose = () => {
    setDropdownOpen(false);
  };

const handleLogout = async () => {
  try {
    // Call logout API to clear cookie
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    // Clear session storage
    sessionStorage.removeItem("session_user");

    // Optional: redirect to login/home page
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed:", error);
  }
};


  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        IronTribe Gym
      </Typography>
      <List>
        {navItems.map((item) => {
          const itemPath = `/${item.toLowerCase()}`;
          const isActive = pathname === itemPath;

          return (
            <ListItem key={item} disablePadding>
              <ListItemText
                primary={
                  <Link
                    href={itemPath}
                    style={{
                      textDecoration: 'none',
                      color: isActive ? '#f44336' : 'inherit',
                      padding: '1rem',
                      display: 'block',
                      fontWeight: isActive ? 'bold' : 'normal',
                    }}
                  >
                    {item}
                  </Link>
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar component="nav" position="absolute" sx={{ backgroundColor: '#000', color: '#fff' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 0, display: 'flex', justifyContent: { xs: 'center', sm: 'start' } }}>
            <Link href="/">
              <Image src="/logogym.png" alt="IronTribe Gym" width={80} height={65} />
            </Link>
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'block' }, ml: 'auto' }}>
            {navItems.map((item) => {
              const itemPath = `/${item.toLowerCase()}`;
              const isActive = pathname === itemPath;

              return (
                <Button
                  key={item}
                  component={Link}
                  href={itemPath}
                  sx={{
                    color: isActive ? '#f44336' : '#fff',
                    mx: 1,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: isActive ? '100%' : 0,
                      height: '2px',
                      bottom: -2,
                      left: '50%',
                      backgroundColor: '#f44336',
                      transition: 'all 0.3s ease-out',
                      transform: 'translateX(-50%)',
                    },
                    '&:hover::after': {
                      width: '100%',
                    },
                    '&:hover': {
                      color: '#f44336',
                    },
                  }}
                >
                  {item}
                </Button>
              );
            })}
          </Box>

          {/* Avatar Dropdown */}
          <Box sx={{ ml: 2, position: 'relative' }}>
            <ClickAwayListener onClickAway={handleDropdownClose}>
              <Box>
                <IconButton onClick={handleDropdownToggle} ref={dropdownRef}>
                  <Avatar alt="User" src="/avatar.jpg" />
                </IconButton>

                {dropdownOpen && (
                  <Paper
                    elevation={4}
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      mt: 1,
                      minWidth: 180,
                      zIndex: 10,
                      borderRadius: 0,
                      overflow: 'hidden',
                      animation: 'fadeSlideDown 0.3s ease forwards',
                      '@keyframes fadeSlideDown': {
                        '0%': {
                          opacity: 0,
                          transform: 'translateY(-10px)',
                        },
                        '100%': {
                          opacity: 1,
                          transform: 'translateY(0)',
                        },
                      },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1 }}>
                      <Typography variant="body1" fontWeight="bold">
                        {userName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {userEmail}
                      </Typography>
                    </Box>
                    <Divider />
                    {[
                      { label: 'Profile', href: '/profile' },
                      { label: 'Schedules', href: '/schedules' },
                      { label: 'Trainers', href: '/trainers' },
                      { label: 'Diet Plan', href: '/diet' },
                    ].map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Box key={item.label} sx={{ px: 2, py: 1 }}>
                          <Link
                            href={item.href}
                            style={{
                              textDecoration: 'none',
                              color: isActive ? '#f44336' : '#000',
                              fontSize: '0.95rem',
                              display: 'block',
                              fontWeight: isActive ? 'bold' : 'normal',
                              position: 'relative',
                              paddingBottom: '4px',
                            }}
                            onClick={handleDropdownClose}
                          >
                            {item.label}
                            <span
                              style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                height: '2px',
                                width: isActive ? '100%' : '0',
                                backgroundColor: '#f44336',
                                transition: 'width 0.3s ease',
                              }}
                            />
                          </Link>
                        </Box>
                      );
                    })}
                    <Divider />
                    <Box sx={{ px: 2, py: 1 }}>
                      <Typography
                        variant="body2"
                        color="error"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => {
                          alert('Logging out...');
                          handleDropdownClose();
                          handleLogout();
                        }}
                      >
                        Logout
                      </Typography>
                    </Box>
                  </Paper>
                )}
              </Box>
            </ClickAwayListener>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
