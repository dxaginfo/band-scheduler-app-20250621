import React, { ReactNode } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Container, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Calendar, MusicNote, Group, Settings, Menu as MenuIcon } from '@mui/icons-material';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky">
        <Toolbar>
          <Button 
            color="inherit" 
            onClick={toggleDrawer}
            sx={{ display: { xs: 'block', md: 'none' }, mr: 2 }}
          >
            <MenuIcon />
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Band Scheduler
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Button color="inherit" component={Link} href="/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} href="/rehearsals">
              Rehearsals
            </Button>
            <Button color="inherit" component={Link} href="/songs">
              Songs
            </Button>
            <Button color="inherit" component={Link} href="/setlists">
              Setlists
            </Button>
          </Box>
          <Button color="inherit" component={Link} href="/login">
            Login
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer}
        >
          <List>
            <ListItem button component={Link} href="/dashboard">
              <ListItemIcon><Calendar /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} href="/rehearsals">
              <ListItemIcon><Calendar /></ListItemIcon>
              <ListItemText primary="Rehearsals" />
            </ListItem>
            <ListItem button component={Link} href="/songs">
              <ListItemIcon><MusicNote /></ListItemIcon>
              <ListItemText primary="Songs" />
            </ListItem>
            <ListItem button component={Link} href="/setlists">
              <ListItemIcon><MusicNote /></ListItemIcon>
              <ListItemText primary="Setlists" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button component={Link} href="/band">
              <ListItemIcon><Group /></ListItemIcon>
              <ListItemText primary="Band Management" />
            </ListItem>
            <ListItem button component={Link} href="/settings">
              <ListItemIcon><Settings /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto', 
          backgroundColor: (theme) => theme.palette.grey[200]
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Band Rehearsal Scheduler. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
