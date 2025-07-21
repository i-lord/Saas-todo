import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Avatar,
  Divider,
  Stack,
  Alert,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Badge,
  LinearProgress
} from "@mui/material";
import {
  Settings,
  Person,
  Palette,
  Notifications,
  Security,
  Language,
  Storage,
  Backup,
  Delete,
  Edit,
  Save,
  Cancel,
  Brightness4,
  Brightness7,
  Email,
  Phone,
  LocationOn,
  Work,
  CalendarToday,
  CloudSync,
  Download,
  Upload,
  Warning,
  CheckCircle,
  Info,
  Logout,
  Key,
  Shield
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useThemeContext } from "../contexts/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.projects);
  const { tasks } = useSelector((state) => state.tasks);
  
  // State for various settings
  const [profile, setProfile] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || '',
    phone: '',
    location: '',
    jobTitle: '',
    bio: ''
  });
  
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    taskReminders: true,
    weeklyDigest: true,
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    startOfWeek: 'monday'
  });
  
  const [editingProfile, setEditingProfile] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load user preferences from localStorage
  useEffect(() => {
    const savedPrefs = localStorage.getItem('userPreferences');
    if (savedPrefs) {
      setPreferences({ ...preferences, ...JSON.parse(savedPrefs) });
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = (newPrefs) => {
    localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
    setPreferences(newPrefs);
    showMessage('success', 'Preferences saved successfully!');
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      // In a real app, you'd update the user profile via Firebase Auth
      // For now, we'll just simulate the save
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEditingProfile(false);
      showMessage('success', 'Profile updated successfully!');
    } catch (error) {
      showMessage('error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      showMessage('error', 'Failed to sign out');
    }
  };

  const handleExportData = () => {
    const data = {
      projects: projects,
      tasks: tasks,
      preferences: preferences,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saas-todo-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setExportDialogOpen(false);
    showMessage('success', 'Data exported successfully!');
  };

  const calculateStorageUsage = () => {
    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    const storageUsed = (totalProjects * 0.1 + totalTasks * 0.05).toFixed(1); // Simulated MB
    const storageLimit = 100; // Simulated 100MB limit
    const usagePercentage = (storageUsed / storageLimit) * 100;
    
    return { storageUsed, storageLimit, usagePercentage };
  };

  const storage = calculateStorageUsage();

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">Please log in to access settings.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color="primary" sx={{ mb: 1 }}>
          ⚙️ Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account, preferences, and application settings
        </Typography>
      </Box>

      {/* Message Alert */}
      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                👤 Profile Settings
              </Typography>
              <IconButton onClick={() => setEditingProfile(!editingProfile)}>
                {editingProfile ? <Cancel /> : <Edit />}
              </IconButton>
            </Stack>
            
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar 
                  src={profile.photoURL} 
                  sx={{ width: 80, height: 80 }}
                >
                  {profile.displayName?.[0] || profile.email?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6">{profile.displayName || 'No name set'}</Typography>
                  <Typography variant="body2" color="text.secondary">{profile.email}</Typography>
                  <Chip 
                    label={user.emailVerified ? 'Verified' : 'Unverified'} 
                    size="small" 
                    color={user.emailVerified ? 'success' : 'warning'}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
              
              {editingProfile ? (
                <Stack spacing={2}>
                  <TextField
                    label="Display Name"
                    value={profile.displayName}
                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    label="Phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    label="Location"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    label="Job Title"
                    value={profile.jobTitle}
                    onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    label="Bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    multiline
                    rows={3}
                    fullWidth
                  />
                  <Stack direction="row" spacing={2}>
                    <Button 
                      variant="contained" 
                      onClick={handleProfileSave}
                      disabled={saving}
                      startIcon={<Save />}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button 
                      variant="outlined" 
                      onClick={() => setEditingProfile(false)}
                      startIcon={<Cancel />}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2">{profile.phone || 'No phone number'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2">{profile.location || 'No location set'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Work fontSize="small" color="action" />
                    <Typography variant="body2">{profile.jobTitle || 'No job title set'}</Typography>
                  </Box>
                </Stack>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Theme & Appearance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              🎨 Theme & Appearance
            </Typography>
            
            <Stack spacing={3}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={theme === 'dark'} 
                    onChange={toggleTheme}
                    icon={<Brightness7 />}
                    checkedIcon={<Brightness4 />}
                  />
                }
                label={`${theme === 'dark' ? 'Dark' : 'Light'} Mode`}
              />
              
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={preferences.language}
                  label="Language"
                  onChange={(e) => savePreferences({ ...preferences, language: e.target.value })}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Español</MenuItem>
                  <MenuItem value="fr">Français</MenuItem>
                  <MenuItem value="de">Deutsch</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Date Format</InputLabel>
                <Select
                  value={preferences.dateFormat}
                  label="Date Format"
                  onChange={(e) => savePreferences({ ...preferences, dateFormat: e.target.value })}
                >
                  <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                  <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                  <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Start of Week</InputLabel>
                <Select
                  value={preferences.startOfWeek}
                  label="Start of Week"
                  onChange={(e) => savePreferences({ ...preferences, startOfWeek: e.target.value })}
                >
                  <MenuItem value="sunday">Sunday</MenuItem>
                  <MenuItem value="monday">Monday</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Paper>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              🔔 Notifications
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <Email />
                </ListItemIcon>
                <ListItemText 
                  primary="Email Notifications" 
                  secondary="Receive updates via email"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={preferences.emailNotifications}
                    onChange={(e) => savePreferences({ 
                      ...preferences, 
                      emailNotifications: e.target.checked 
                    })}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Notifications />
                </ListItemIcon>
                <ListItemText 
                  primary="Push Notifications" 
                  secondary="Browser push notifications"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={preferences.pushNotifications}
                    onChange={(e) => savePreferences({ 
                      ...preferences, 
                      pushNotifications: e.target.checked 
                    })}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CalendarToday />
                </ListItemIcon>
                <ListItemText 
                  primary="Task Reminders" 
                  secondary="Reminders for due tasks"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={preferences.taskReminders}
                    onChange={(e) => savePreferences({ 
                      ...preferences, 
                      taskReminders: e.target.checked 
                    })}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Info />
                </ListItemIcon>
                <ListItemText 
                  primary="Weekly Digest" 
                  secondary="Weekly summary emails"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={preferences.weeklyDigest}
                    onChange={(e) => savePreferences({ 
                      ...preferences, 
                      weeklyDigest: e.target.checked 
                    })}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Storage & Data */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              💾 Storage & Data
            </Typography>
            
            <Stack spacing={3}>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2">Storage Used</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {storage.storageUsed} MB / {storage.storageLimit} MB
                  </Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={storage.usagePercentage} 
                  sx={{ height: 8, borderRadius: 4 }}
                  color={storage.usagePercentage > 80 ? 'error' : 'primary'}
                />
                <Typography variant="caption" color="text.secondary">
                  {storage.usagePercentage.toFixed(1)}% used
                </Typography>
              </Box>
              
              <Divider />
              
              <Stack spacing={2}>
                <Typography variant="subtitle2" fontWeight={600}>Data Management</Typography>
                
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => setExportDialogOpen(true)}
                  fullWidth
                >
                  Export Data
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<CloudSync />}
                  fullWidth
                >
                  Sync Data
                </Button>
                
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => setDeleteDialogOpen(true)}
                  fullWidth
                >
                  Delete All Data
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        {/* Security */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              🔒 Security & Privacy
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Shield color="primary" />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Account Security
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Last login: {new Date().toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Key color="primary" />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Password
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Last changed: Never
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <CheckCircle color="success" />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Two-Factor Auth
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Not enabled
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<Logout />}
                onClick={handleSignOut}
                sx={{ mr: 2 }}
              >
                Sign Out
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete Account
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Export Data Dialog */}
      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
        <DialogTitle>Export Your Data</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            This will download all your projects, tasks, and preferences as a JSON file.
          </Typography>
          <Alert severity="info">
            Your exported data will include {projects.length} projects and {tasks.length} tasks.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleExportData} variant="contained" startIcon={<Download />}>
            Export
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>⚠️ Confirm Deletion</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            This action cannot be undone!
          </Alert>
          <Typography variant="body2">
            Are you sure you want to delete all your data? This will permanently remove:
          </Typography>
          <ul>
            <li>{projects.length} projects</li>
            <li>{tasks.length} tasks</li>
            <li>All preferences and settings</li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            color="error" 
            variant="contained"
            startIcon={<Delete />}
            onClick={() => {
              // In a real app, implement actual deletion
              showMessage('error', 'Data deletion not implemented in demo');
              setDeleteDialogOpen(false);
            }}
          >
            Delete All Data
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SettingsPage;
