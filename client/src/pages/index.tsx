import React from 'react';
import Head from 'next/head';
import { Box, Typography, Container, Button, Grid, Paper } from '@mui/material';
import Layout from '../components/Layout';

const Home = () => {
  return (
    <Layout>
      <Head>
        <title>Band Rehearsal Scheduler - Home</title>
        <meta name="description" content="Schedule and manage your band rehearsals easily" />
      </Head>

      <Box 
        component="main" 
        sx={{
          py: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h1" 
            align="center" 
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 4 }}
          >
            Band Rehearsal Scheduler
          </Typography>
          
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Streamline your band rehearsals, track member availability, and manage your song library - all in one place.
          </Typography>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" size="large" color="primary" sx={{ mx: 1 }}>
              Get Started
            </Button>
            <Button variant="outlined" size="large" color="primary" sx={{ mx: 1 }}>
              Learn More
            </Button>
          </Box>
          
          <Grid container spacing={4} sx={{ mt: 6 }}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Schedule Rehearsals
                </Typography>
                <Typography>
                  Create and manage rehearsal schedules based on member availability. Send automatic notifications and reminders.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Track Song Progress
                </Typography>
                <Typography>
                  Maintain a library of songs, track progress, and assign specific songs to rehearsals to focus practice time.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Create Setlists
                </Typography>
                <Typography>
                  Build and organize setlists for performances, share them with the band, and track which songs need more practice.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
};

export default Home;
