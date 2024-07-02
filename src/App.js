// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { CssBaseline, Container, Box, Button, Typography } from '@mui/material';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserListing from './components/UserListing';
import UserVideos from './components/UserAllVideo';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Your App
          </Typography>
          <Button component={Link} to="/register" variant="contained" color="primary">
            Register
          </Button>
          <Button component={Link} to="/login" variant="contained" color="primary" sx={{ ml: 2 }}>
            Login
          </Button>
          <Button component={Link} to="/dashboard" variant="contained" color="primary" sx={{ ml: 2 }}>
            Dashboard
          </Button>
          <Button component={Link} to="/users" variant="contained" color="primary" sx={{ ml: 2 }}>
            User Listing
          </Button>
        </Box>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UserListing />} />
          <Route path="/user/:userId/videos" element={<UserVideos />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
