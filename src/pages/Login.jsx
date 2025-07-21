import React, { useState } from "react";
import { Box, Button, Container, Typography, TextField, Divider, Stack, Paper } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    alert('Google login coming soon!');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('All fields are required.');
      return;
    }
    // TODO: Implement email/password login
    alert('Email login coming soon!');
  };

  return (
    <Box minHeight="100vh" width="100vw" sx={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="xs">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={700} align="center" gutterBottom>Log In</Typography>
          <Stack spacing={2}>
            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              fullWidth
              onClick={handleGoogleLogin}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Log in with Google
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
                {error && <Typography color="error">{error}</Typography>}
                <Button variant="contained" type="submit" fullWidth sx={{ fontWeight: 600 }}>
                  Log In
                </Button>
              </Stack>
            </form>
          </Stack>
          <Typography align="center" sx={{ mt: 2 }}>
            Don't have an account? <a href="/signup">Sign up</a>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
