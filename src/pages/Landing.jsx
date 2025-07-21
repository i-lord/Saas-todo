import React from "react";
import { Box, Button, Container, Typography, AppBar, Toolbar, Stack, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const features = [
  {
    title: "Organize Your Projects",
    description: "Manage all your personal projects and tasks in one simple, beautiful app.",
  },
  {
    title: "Kanban Task Board",
    description: "Visualize your workflow with a modern, drag-and-drop Kanban board.",
  },
  {
    title: "Productivity Analytics",
    description: "Track your progress, spot bottlenecks, and celebrate your achievements with built-in analytics.",
  },
  {
    title: "Secure & Fast",
    description: "Your data is protected by Firebase Auth and blazing-fast Cloud Functions.",
  },
];

const Landing = () => {
  return (
    <Box
      minHeight="100vh"
      width="100vw"
      sx={{
        background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)',
        overflowX: 'hidden',
        px: { xs: 0, sm: 0 },
      }}
    >

      <AppBar position="static" elevation={0} sx={{ background: 'transparent', boxShadow: 'none' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700, color: '#1976d2' }}>
            SaaS To-Do
          </Typography>
          <Button color="primary" variant="outlined" component={RouterLink} to="/login" sx={{ mr: 2 }}>
            Log In
          </Button>
          <Button color="primary" variant="contained" component={RouterLink} to="/signup">
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ pt: { xs: 5, sm: 10 }, pb: { xs: 3, sm: 6 } }}>
        <Typography
          variant="h2"
          align="center"
          fontWeight={800}
          color="#1a237e"
          gutterBottom
          sx={{ fontSize: { xs: '2rem', sm: '3rem', md: '3.75rem' } }}
        >
          Organize. Collaborate. Succeed.
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          sx={{ mb: 5, fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}
        >
          The modern SaaS To-Do app for teams who want to get things done — together.
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          sx={{ mb: 6, alignItems: 'center' }}
        >
          <Button size="large" variant="contained" color="primary" component={RouterLink} to="/signup" fullWidth={true} sx={{ maxWidth: { xs: '100%', sm: 220 } }}>
            Get Started Free
          </Button>
          <Button size="large" variant="outlined" color="primary" component={RouterLink} to="/login" fullWidth={true} sx={{ maxWidth: { xs: '100%', sm: 220 } }}>
            Try Demo
          </Button>
        </Stack>
        <Stack spacing={3}>
          {features.map((f, i) => (
            <Paper
              key={i}
              elevation={3}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 2, sm: 3 },
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <Box
                sx={{
                  minWidth: 48,
                  minHeight: 48,
                  width: { xs: 48, sm: 64 },
                  height: { xs: 48, sm: 64 },
                  bgcolor: '#e3f2fd',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: { xs: 22, sm: 30 },
                  color: '#1976d2',
                  fontWeight: 700,
                }}
              >
                {String.fromCharCode(65 + i)}
              </Box>
              <Box textAlign={{ xs: 'center', sm: 'left' }}>
                <Typography variant="h6" fontWeight={700} color="#1976d2">
                  {f.title}
                </Typography>
                <Typography color="text.secondary">{f.description}</Typography>
              </Box>
            </Paper>
          ))}
        </Stack>
      </Container>
      <Box sx={{ textAlign: 'center', pb: 4, color: 'text.secondary' }}>
        <Typography variant="body2">© {new Date().getFullYear()} SaaS To-Do. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default Landing;
