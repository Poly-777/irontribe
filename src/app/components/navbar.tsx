'use client';

import React, { useState } from 'react';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = ['Home', 'About', 'Gallery', 'pricing', 'Trainers', 'Contact'];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
