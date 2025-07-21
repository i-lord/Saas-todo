import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Divider, Stack, CircularProgress, Container, Button, Grid } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddIcon from "@mui/icons-material/Add";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProjectSelect from "../components/projectSelect/ProjectSelect";
import TaskBoard from "../components/TaskBoard";
import { fetchAnalytics } from "../api/analyticsApi";
import { useAuth } from "../contexts/AuthContext";
import { fetchProjects } from "../features/projects/projectsSlice";
import { fetchTasks } from "../features/tasks/tasksSlice";
import ProjectForm from "../components/ProjectForm";
import axiosClient from "../api/axiosClient";

// Modern Analytics Dashboard for Home page
function AnalyticsDashboard({ tasks, currentProject }) {
  // Calculate analytics directly from tasks data for real-time accuracy
  const projectTasks = tasks.filter(task => 
    task.projectId === currentProject?.id || task.projectId === currentProject?.projectId
  );
  
  // Calculate status counts from actual task data
  const statusCounts = {
    'Todo': projectTasks.filter(task => task.status === 'Todo').length,
    'In Progress': projectTasks.filter(task => task.status === 'In Progress').length,
    'Done': projectTasks.filter(task => task.status === 'Done').length
  };
  
  const statuses = Object.keys(statusCounts);
  const totalTasks = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
  
  const statusColors = {
    'Todo': { bg: '#e3f2fd', color: '#1976d2', icon: '📋' },
    'In Progress': { bg: '#fff3e0', color: '#f57c00', icon: '🔄' },
    'Done': { bg: '#e8f5e8', color: '#388e3c', icon: '✅' }
  };
  
  // Calculate overdue tasks from project tasks
  const overdueTasks = projectTasks.filter(task => {
    if (!task.dueDate || task.status === 'Done') return false;
    return new Date(task.dueDate) < new Date();
  });
  
  if (totalTasks === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          📊 No Tasks Yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first task to see analytics here!
        </Typography>
      </Paper>
    );
  }
  
  return (
    <Box>
      {/* Header */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        📊 Project Analytics
        {currentProject && (
          <Typography variant="body2" color="text.secondary">
            • {currentProject.name}
          </Typography>
        )}
      </Typography>
      
      {/* Key Metrics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f3e5f5' }}>
            <Typography variant="h4" fontWeight={700} color="#7b1fa2">
              {totalTasks}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Tasks
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e8' }}>
            <Typography variant="h4" fontWeight={700} color="#388e3c">
              {statusCounts.Done || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Completed
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}>
            <Typography variant="h4" fontWeight={700} color="#f57c00">
              {statusCounts['In Progress'] || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              In Progress
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: overdueTasks.length > 0 ? '#ffebee' : '#e3f2fd' }}>
            <Typography variant="h4" fontWeight={700} color={overdueTasks.length > 0 ? '#d32f2f' : '#1976d2'}>
              {overdueTasks.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Overdue
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Visual Progress Bar */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          📈 Progress Overview
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Overall Progress</Typography>
            <Typography variant="body2" fontWeight={600}>
              {totalTasks > 0 ? Math.round(((statusCounts.Done || 0) / totalTasks) * 100) : 0}% Complete
            </Typography>
          </Box>
          <Box sx={{ 
            width: '100%', 
            height: 8, 
            bgcolor: 'grey.200', 
            borderRadius: 4,
            overflow: 'hidden',
            display: 'flex'
          }}>
            {statuses.map((status) => {
              const percentage = totalTasks > 0 ? (statusCounts[status] / totalTasks) * 100 : 0;
              return percentage > 0 ? (
                <Box
                  key={status}
                  sx={{
                    width: `${percentage}%`,
                    height: '100%',
                    bgcolor: statusColors[status]?.color || '#1976d2',
                    transition: 'all 0.3s ease'
                  }}
                />
              ) : null;
            })}
          </Box>
        </Box>
        
        {/* Status Breakdown */}
        <Grid container spacing={2}>
          {statuses.map((status) => {
            const count = statusCounts[status] || 0;
            const percentage = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
            const config = statusColors[status] || { bg: '#f5f5f5', color: '#666', icon: '📄' };
            
            return (
              <Grid item xs={4} key={status}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: config.bg, 
                  borderRadius: 2,
                  textAlign: 'center',
                  border: `1px solid ${config.color}20`
                }}>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>
                    {config.icon}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color={config.color}>
                    {count}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {status}
                  </Typography>
                  <Typography variant="caption" display="block" color={config.color}>
                    {percentage}%
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </Box>
  );
}

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  // Quick actions row
  const [projectFormOpen, setProjectFormOpen] = useState(false);
const [creatingProject, setCreatingProject] = useState(false);

const quickActions = [
  {
    label: 'Create Project',
    icon: <AddIcon sx={{ fontSize: 24 }} color="primary" />, // Use Add (+) icon
    onClick: () => setProjectFormOpen(true),
    color: 'primary',
  },
    {
      label: 'View Tasks',
      icon: <AssignmentIcon sx={{ fontSize: 24 }} color="secondary" />,
      onClick: () => navigate('/app/tasks'),
      color: 'secondary',
    },
    {
      label: 'View Analytics',
      icon: <BarChartIcon sx={{ fontSize: 24 }} color="success" />,
      onClick: () => navigate('/app/analytics'),
      color: 'success',
    },

  ];
  const dispatch = useDispatch();
  const { projects, currentProjectId, status: projectsStatus, error: projectsError } = useSelector(state => state.projects);

  const { tasks, status: tasksStatus, error: tasksError } = useSelector(state => state.tasks);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    // Only fetch projects if not already loading or loaded
    if (projectsStatus !== "loading" && projectsStatus !== "succeeded") {
      dispatch(fetchProjects(user.uid));
    }
  }, [user, loading, navigate, dispatch, projectsStatus]);

  // Fetch tasks when currentProjectId changes
  useEffect(() => {
    if (currentProjectId) {
      dispatch(fetchTasks(currentProjectId));
    }
  }, [currentProjectId, dispatch]);

  // No need for separate analytics API call - we calculate from tasks data directly

  if (loading) {
    return (
      <Box minHeight="60vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }


  // Find current project
  const currentProject = (projects || []).find(
    (p) => (p.projectId || p.id) === currentProjectId
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Quick Actions Row */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={1} justifyContent="flex-start">
          {quickActions.map((action) => (
            <Grid item xs={6} sm={3} key={action.label}>
              <Button
                variant="outlined"
                color={action.color}
                fullWidth
                startIcon={action.icon}
                onClick={action.onClick}
                sx={{
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: { xs: 13, md: 15 },
                  mb: { xs: 1, sm: 0 },
                  minHeight: 40,
                }}
              >
                {action.label}
              </Button>
            </Grid>
          ))}
        </Grid>
        {currentProject && (
          <Paper elevation={0} sx={{ p: 2, mt: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} color="primary.main">
              Current Project
            </Typography>
            <Typography variant="body1" fontWeight={700}>{currentProject.name}</Typography>
            {currentProject.description && (
              <Typography variant="body2" color="text.secondary">{currentProject.description}</Typography>
            )}
          </Paper>
        )}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <AnalyticsDashboard 
            tasks={tasks || []} 
            currentProject={currentProject}
          />
        </Box>
      </Box>
      <ProjectForm
        open={projectFormOpen}
        onClose={() => setProjectFormOpen(false)}
        loading={creatingProject}
        onSubmit={async (form) => {
          setCreatingProject(true);
          try {
            // Call backend API to create project using axiosClient (includes auth header)
            await axiosClient.post('/projects', {
              ...form,
              ownerId: user.uid // Add the required ownerId field
            });
            setProjectFormOpen(false);
            setTimeout(() => {
              dispatch(fetchProjects(user.uid));
            }, 300); // Give backend a moment
          } catch (err) {
            alert('Failed to create project: ' + (err.response?.data?.message || err.message || err));
          } finally {
            setCreatingProject(false);
          }
        }}
      />
      <Box>
        {projectsStatus === "loading" || tasksStatus === "loading" ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : projectsError ? (
          <Typography color="error">{projectsError}</Typography>
        ) : tasksError ? (
          <Typography color="error">{tasksError}</Typography>
        ) : !currentProjectId ? (
          <Typography color="text.secondary">Select a project to view tasks.</Typography>
        ) : (
          <TaskBoard />
        )}
      </Box>
    </Container>
  );
};

export default Home;
