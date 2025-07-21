import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
  Divider,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import {
  BarChart,
  TrendingUp,
  Assignment,
  CheckCircle,
  Schedule,
  Warning,
  Timeline,
  PieChart,
  Refresh,
  FilterList
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { fetchAnalytics } from "../api/analyticsApi";
import { fetchProjects } from "../features/projects/projectsSlice";
import { fetchTasks } from "../features/tasks/tasksSlice";
import ProjectSelect from "../components/projectSelect/ProjectSelect";
import { formatTaskDate, isOverdue, getRelativeTime } from "../utils/dateUtils";

const AnalyticsPage = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { projects, currentProjectId } = useSelector((state) => state.projects);
  const { tasks } = useSelector((state) => state.tasks);
  
  const [analyticsData, setAnalyticsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeFilter, setTimeFilter] = useState("all"); // all, week, month
  const [refreshing, setRefreshing] = useState(false);

  // Fetch analytics data
  const loadAnalytics = async () => {
    if (!user) return;
    
    try {
      setRefreshing(true);
      // Pass currentProjectId to get project-specific analytics
      const data = await fetchAnalytics(user.uid, currentProjectId);
      setAnalyticsData(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to fetch analytics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Clear analytics data immediately when project changes, then load new data
  useEffect(() => {
    if (currentProjectId) {
      // Clear previous analytics data to prevent showing stale data
      setAnalyticsData({});
      setError("");
      setLoading(true);
    }
    loadAnalytics();
  }, [user, currentProjectId]); // Reload analytics when project changes

  useEffect(() => {
    if (currentProjectId) {
      dispatch(fetchTasks(currentProjectId));
    }
  }, [currentProjectId, dispatch]);

  // Calculate derived analytics
  const calculateMetrics = () => {
    const statusCounts = analyticsData.statusCounts || {};
    const totalTasks = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
    
    const completionRate = totalTasks > 0 ? ((statusCounts.Done || 0) / totalTasks * 100) : 0;
    const inProgressRate = totalTasks > 0 ? ((statusCounts['In Progress'] || 0) / totalTasks * 100) : 0;
    const todoRate = totalTasks > 0 ? ((statusCounts.Todo || 0) / totalTasks * 100) : 0;
    
    // Filter tasks by current project first
    const projectTasks = currentProjectId 
      ? tasks.filter(task => task.projectId === currentProjectId)
      : tasks;
    
    // Calculate overdue tasks from current project tasks only
    const overdueTasks = projectTasks.filter(task => isOverdue(task.dueDate, task.status));
    const upcomingTasks = projectTasks.filter(task => {
      if (!task.dueDate || task.status === 'Done') return false;
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const threeDaysFromNow = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));
      return dueDate >= today && dueDate <= threeDaysFromNow;
    });
    
    return {
      totalTasks,
      completionRate,
      inProgressRate,
      todoRate,
      overdueTasks,
      upcomingTasks,
      statusCounts
    };
  };

  const metrics = calculateMetrics();

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">Please log in to view analytics.</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} color="primary">
              📊 Analytics Dashboard
            </Typography>
            {currentProjectId && (
              <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                {projects.find(p => (p.projectId || p.id) === currentProjectId)?.name || 'Current Project'}
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Time Filter</InputLabel>
              <Select
                value={timeFilter}
                label="Time Filter"
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
              </Select>
            </FormControl>
            <Tooltip title="Refresh Data">
              <IconButton onClick={loadAnalytics} disabled={refreshing}>
                <Refresh sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Get insights into your productivity and task management patterns
        </Typography>
        
        {/* Project Filter */}
        <Box sx={{ mb: 3 }}>
          <ProjectSelect />
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {metrics.totalTasks}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Tasks
                  </Typography>
                </Box>
                <Assignment sx={{ fontSize: 40, opacity: 0.8 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {metrics.completionRate.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Completion Rate
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, opacity: 0.8 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {metrics.overdueTasks.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Overdue Tasks
                  </Typography>
                </Box>
                <Warning sx={{ fontSize: 40, opacity: 0.8 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {metrics.upcomingTasks.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Due Soon
                  </Typography>
                </Box>
                <Schedule sx={{ fontSize: 40, opacity: 0.8 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Status Distribution Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                📈 Task Status Distribution
              </Typography>
              <BarChart color="primary" />
            </Stack>
            
            {metrics.totalTasks === 0 ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                <Typography color="text.secondary">No tasks found</Typography>
              </Box>
            ) : (
              <StatusBarChart data={metrics.statusCounts} />
            )}
          </Paper>
        </Grid>
        
        {/* Progress Overview */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              🎯 Progress Overview
            </Typography>
            
            <Stack spacing={3}>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2">Completed</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {metrics.statusCounts.Done || 0} tasks
                  </Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={metrics.completionRate} 
                  sx={{ height: 8, borderRadius: 4 }}
                  color="success"
                />
                <Typography variant="caption" color="text.secondary">
                  {metrics.completionRate.toFixed(1)}% complete
                </Typography>
              </Box>
              
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2">In Progress</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {metrics.statusCounts['In Progress'] || 0} tasks
                  </Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={metrics.inProgressRate} 
                  sx={{ height: 8, borderRadius: 4 }}
                  color="warning"
                />
                <Typography variant="caption" color="text.secondary">
                  {metrics.inProgressRate.toFixed(1)}% in progress
                </Typography>
              </Box>
              
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2">To Do</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {metrics.statusCounts.Todo || 0} tasks
                  </Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={metrics.todoRate} 
                  sx={{ height: 8, borderRadius: 4 }}
                  color="info"
                />
                <Typography variant="caption" color="text.secondary">
                  {metrics.todoRate.toFixed(1)}% pending
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
        
        {/* Overdue Tasks */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '350px', overflow: 'hidden' }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              ⚠️ Overdue Tasks ({metrics.overdueTasks.length})
            </Typography>
            
            <Box sx={{ height: '280px', overflowY: 'auto' }}>
              {metrics.overdueTasks.length === 0 ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography color="text.secondary">🎉 No overdue tasks!</Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {metrics.overdueTasks.slice(0, 5).map((task) => (
                    <Card key={task.id} variant="outlined" sx={{ border: '1px solid #f44336' }}>
                      <CardContent sx={{ py: 1.5 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {task.title}
                            </Typography>
                            <Typography variant="caption" color="error">
                              Due: {formatTaskDate(task.dueDate)}
                            </Typography>
                          </Box>
                          <Chip 
                            label={task.status} 
                            size="small" 
                            color="error" 
                            variant="outlined"
                          />
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                  {metrics.overdueTasks.length > 5 && (
                    <Typography variant="caption" color="text.secondary" textAlign="center">
                      +{metrics.overdueTasks.length - 5} more overdue tasks
                    </Typography>
                  )}
                </Stack>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Upcoming Tasks */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '350px', overflow: 'hidden' }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              📅 Due Soon ({metrics.upcomingTasks.length})
            </Typography>
            
            <Box sx={{ height: '280px', overflowY: 'auto' }}>
              {metrics.upcomingTasks.length === 0 ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography color="text.secondary">No upcoming deadlines</Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {metrics.upcomingTasks.slice(0, 5).map((task) => (
                    <Card key={task.id} variant="outlined" sx={{ border: '1px solid #ff9800' }}>
                      <CardContent sx={{ py: 1.5 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {task.title}
                            </Typography>
                            <Typography variant="caption" color="warning.main">
                              {getRelativeTime(task.dueDate)}
                            </Typography>
                          </Box>
                          <Chip 
                            label={task.status} 
                            size="small" 
                            color="warning" 
                            variant="outlined"
                          />
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                  {metrics.upcomingTasks.length > 5 && (
                    <Typography variant="caption" color="text.secondary" textAlign="center">
                      +{metrics.upcomingTasks.length - 5} more upcoming tasks
                    </Typography>
                  )}
                </Stack>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

// Enhanced StatusBarChart component with Material-UI styling
function StatusBarChart({ data }) {
  const statuses = Object.keys(data);
  const max = Math.max(...Object.values(data), 1);
  
  const statusColors = {
    'Todo': '#2196f3',
    'In Progress': '#ff9800', 
    'Done': '#4caf50'
  };
  
  if (statuses.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <Typography color="text.secondary">No data available</Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 4, 
      justifyContent: 'center', 
      alignItems: 'flex-end',
      height: '300px',
      pt: 2
    }}>
      {statuses.map((status) => (
        <Box key={status} sx={{ textAlign: 'center', minWidth: '80px' }}>
          <Box
            sx={{
              height: `${(data[status] / max) * 200}px`,
              width: 60,
              background: statusColors[status] || '#1976d2',
              borderRadius: 2,
              mb: 2,
              mx: 'auto',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 600,
              fontSize: '1.2rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 3
              }
            }}
          >
            {data[status]}
          </Box>
          <Typography variant="body2" fontWeight={600}>
            {status}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {((data[status] / Object.values(data).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default AnalyticsPage;
