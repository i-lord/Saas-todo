import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TaskBoard from "../components/TaskBoard";
import { fetchTasks, createTask } from "../features/tasks/tasksSlice";
import { CircularProgress, Box, Typography, Container, Button, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TaskForm from "../components/TaskForm";
import { useAuth } from "../contexts/AuthContext";

const TasksPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const currentProjectId = useSelector((state) => state.projects.currentProjectId);
  const { projects } = useSelector((state) => state.projects);
  const { status, error } = useSelector((state) => state.tasks);
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);

  useEffect(() => {
    if (currentProjectId) {
      dispatch(fetchTasks(currentProjectId));
    }
  }, [currentProjectId, dispatch]);

  // Find current project for display
  const currentProject = projects.find(p => (p.projectId || p.id) === currentProjectId);

  if (!currentProjectId) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Select a project to view tasks
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Choose a project from the dropdown in the header to start managing tasks.
        </Typography>
      </Container>
    );
  }
  if (status === "loading") {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  if (status === "failed") {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error" align="center" sx={{ mt: 4 }}>
          {error || "Failed to load tasks."}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 3,
          gap: 2
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Tasks
          </Typography>
          {currentProject && (
            <Typography variant="subtitle1" color="text.secondary">
              {currentProject.name}
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setTaskFormOpen(true)}
          sx={{ fontWeight: 600, width: { xs: '100%', sm: 'auto' } }}
        >
          Add Task
        </Button>
      </Box>

      {/* Task Board */}
      <TaskBoard />

      {/* Task Form Modal */}
      <TaskForm
        open={taskFormOpen}
        onClose={() => setTaskFormOpen(false)}
        loading={creatingTask}
        onSubmit={async (taskData) => {
          setCreatingTask(true);
          try {
            await dispatch(createTask({
              ...taskData,
              projectId: currentProjectId,
              createdBy: user.uid
            })).unwrap();
            setTaskFormOpen(false);
          } catch (err) {
            alert('Failed to create task: ' + (err || 'Unknown error'));
          } finally {
            setCreatingTask(false);
          }
        }}
      />
    </Container>
  );
};

export default TasksPage;
