import React, { useState } from "react";
import { Box, Button, Container, Typography, TextField, Divider, Stack, Paper } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';

const Signup = () => {
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGoogleSignup = () => {
    // TODO: Implement Google OAuth
    alert('Google signup coming soon!');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password || !form.confirm) {
      setError('All fields are required.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    // TODO: Implement email/password signup
    alert('Email signup coming soon!');
  };

  return (
    <Box minHeight="100vh" width="100vw" sx={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="xs">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={700} align="center" gutterBottom>Sign Up</Typography>
          <Stack spacing={2}>
            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              fullWidth
              onClick={handleGoogleSignup}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Sign up with Google
            </Button>
            <Divider>or</Divider>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Confirm Password"
                  name="confirm"
                  type="password"
                  value={form.confirm}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button variant="contained" type="submit" fullWidth sx={{ fontWeight: 600 }}>
                  Create Account
                </Button>
              </Stack>
            </form>
          </Stack>
          <Typography align="center" sx={{ mt: 2 }}>
            Already have an account? <a href="/login">Log in</a>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signup;
