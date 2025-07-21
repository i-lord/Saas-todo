import React, { useState } from "react";
import { Box, Button, Container, Typography, TextField, Divider, Stack, Paper } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import { auth } from "../services/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchProjects } from "../features/projects/projectsSlice";
import { useAuth } from "../contexts/AuthContext";

const AuthPage = ({ initialMode = "login" }) => {
  const [mode, setMode] = useState(initialMode); // "login" or "signup"
  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Map Firebase error codes to friendly messages
  const getFriendlyError = (err) => {
    if (!err || !err.code) return err.message || String(err);
    switch (err.code) {
      case 'auth/email-already-in-use':
        return 'This email is already in use.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password.';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in was cancelled.';
      default:
        return err.message || 'Authentication failed.';
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGoogleAuth = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      dispatch(fetchProjects());
      navigate("/app");
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!form.email || !form.password || (mode === "signup" && !form.confirm)) {
        setError('All fields are required.');
        setLoading(false);
        return;
      }
      if (mode === "signup" && form.password !== form.confirm) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, form.email, form.password);
      } else {
        await signInWithEmailAndPassword(auth, form.email, form.password);
      }
      dispatch(fetchProjects());
      navigate("/app");
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      width="100vw"
      sx={{
        background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 1, sm: 0 },
      }}
    >
      <Container maxWidth="xs" disableGutters={true} sx={{ px: { xs: 0, sm: 2 } }}>
        <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            align="center"
            gutterBottom
            sx={{ fontSize: { xs: '1.7rem', sm: '2.1rem' } }}
          >
            {mode === "signup" ? "Sign Up" : "Log In"}
          </Typography>
          <Stack spacing={2}>
            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              fullWidth
              onClick={handleGoogleAuth}
              sx={{ textTransform: 'none', fontWeight: 600 }}
              disabled={loading}
            >
              {mode === "signup" ? "Sign up with Google" : "Log in with Google"}
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
                  disabled={loading}
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={loading}
                />
                {mode === "signup" && (
                  <TextField
                    label="Confirm Password"
                    name="confirm"
                    type="password"
                    value={form.confirm}
                    onChange={handleChange}
                    fullWidth
                    required
                    disabled={loading}
                  />
                )}
                {error && <Typography color="error">{error}</Typography>}
                <Button variant="contained" type="submit" fullWidth sx={{ fontWeight: 600 }} disabled={loading}>
                  {loading ? 'Loading...' : (mode === "signup" ? "Create Account" : "Log In")}
                </Button>
              </Stack>
            </form>
          </Stack>
          <Typography align="center" sx={{ mt: 2 }}>
            {mode === "signup" ? (
              <>Already have an account? <Button variant="text" onClick={() => setMode("login")}>Log in</Button></>
            ) : (
              <>Don't have an account? <Button variant="text" onClick={() => setMode("signup")}>Sign up</Button></>
            )}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthPage;
