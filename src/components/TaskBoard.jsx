import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Typography, Grid, Card, CardContent, Avatar, Chip, IconButton, Menu, MenuItem, Button, ButtonGroup, Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { updateTask, deleteTask } from "../features/tasks/tasksSlice";
import TaskForm from "./TaskForm";
import { formatTaskDate, isOverdue, getRelativeTime } from "../utils/dateUtils";

const statusColumns = [
  { key: "Todo", label: "To Do" },
  { key: "In Progress", label: "In Progress" },
  { key: "Done", label: "Done" },
];

function TaskCard({ task }) {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setEditFormOpen(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(task.taskId || task.id)).unwrap();
      } catch (err) {
        alert('Failed to delete task: ' + (err || 'Unknown error'));
      }
    }
    handleMenuClose();
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await dispatch(updateTask({
        taskId: task.taskId || task.id,
        ...task,
        status: newStatus
      })).unwrap();
    } catch (err) {
      alert('Failed to update task: ' + (err || 'Unknown error'));
    }
  };

  // Get available status transitions
  const getStatusTransitions = (currentStatus) => {
    const transitions = {
      'Todo': [{ status: 'In Progress', icon: PlayArrowIcon, color: 'warning', label: 'Start' }],
      'In Progress': [
        { status: 'Todo', icon: RadioButtonUncheckedIcon, color: 'default', label: 'To Do' },
        { status: 'Done', icon: CheckCircleIcon, color: 'success', label: 'Done' }
      ],
      'Done': [{ status: 'In Progress', icon: PlayArrowIcon, color: 'warning', label: 'Reopen' }]
    };
    return transitions[currentStatus] || [];
  };

  // Determine if due date is overdue
  const taskIsOverdue = isOverdue(task.dueDate, task.status);
  const statusTransitions = getStatusTransitions(task.status);

  return (
    <>
      <Card 
        sx={{ 
          mb: 2, 
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3
          },
          border: taskIsOverdue ? '2px solid #f44336' : 'none'
        }}
      >
        <CardContent sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ flex: 1 }}>
              {task.title}
            </Typography>
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{ ml: 1 }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
          
          {task.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {task.description}
            </Typography>
          )}
          
          {/* Task metadata */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {task.assignedTo && (
                <Avatar sx={{ width: 24, height: 24 }}>
                  {task.assignedTo[0]?.toUpperCase()}
                </Avatar>
              )}
              {task.dueDate && (
                <Tooltip title={getRelativeTime(task.dueDate)}>
                  <Chip
                    label={formatTaskDate(task.dueDate)}
                    size="small"
                    color={taskIsOverdue ? 'error' : 'default'}
                    variant={taskIsOverdue ? 'filled' : 'outlined'}
                  />
                </Tooltip>
              )}
            </Box>
          </Box>
          
          {/* Quick Status Change Buttons */}
          {statusTransitions.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {statusTransitions.map((transition) => {
                const IconComponent = transition.icon;
                return (
                  <Button
                    key={transition.status}
                    size="small"
                    variant="outlined"
                    color={transition.color}
                    startIcon={<IconComponent fontSize="small" />}
                    onClick={() => handleStatusChange(transition.status)}
                    sx={{ 
                      fontSize: '0.75rem',
                      py: 0.5,
                      px: 1,
                      minWidth: 'auto',
                      borderRadius: 2
                    }}
                  >
                    {transition.label}
                  </Button>
                );
              })}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Edit Task Form */}
      <TaskForm
        open={editFormOpen}
        onClose={() => setEditFormOpen(false)}
        loading={updating}
        task={task}
        onSubmit={async (taskData) => {
          setUpdating(true);
          try {
            await dispatch(updateTask({
              taskId: task.taskId || task.id,
              ...taskData
            })).unwrap();
            setEditFormOpen(false);
          } catch (err) {
            alert('Failed to update task: ' + (err || 'Unknown error'));
          } finally {
            setUpdating(false);
          }
        }}
      />
    </>
  );
}

const TaskBoard = () => {
  const { tasks, status } = useSelector((state) => state.tasks);
  const { currentProjectId } = useSelector((state) => state.projects);

  // Filter tasks by current project first, then group by status
  const projectTasks = currentProjectId 
    ? tasks.filter((task) => task.projectId === currentProjectId)
    : tasks;

  // Group filtered tasks by status
  const grouped = statusColumns.reduce((acc, col) => {
    acc[col.key] = projectTasks.filter((task) => task.status === col.key);
    return acc;
  }, {});

  // Column colors for visual distinction
  const columnColors = {
    'Todo': '#e3f2fd',
    'In Progress': '#fff3e0', 
    'Done': '#e8f5e8'
  };

  return (
    <Box sx={{ flexGrow: 1, overflowX: 'auto' }}>
      <Grid container spacing={3} sx={{ minWidth: '900px', flexWrap: 'nowrap' }}>
        {statusColumns.map((col) => (
          <Grid item xs={4} key={col.key} sx={{ minWidth: '280px', flex: '1 1 0' }}>
            <Box 
              sx={{ 
                bgcolor: columnColors[col.key],
                borderRadius: 2,
                p: 2,
                minHeight: '500px'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                  {col.label}
                </Typography>
                <Chip 
                  label={grouped[col.key].length} 
                  size="small" 
                  sx={{ fontWeight: 600 }}
                />
              </Box>
              
              {grouped[col.key].length === 0 ? (
                <Box 
                  sx={{ 
                    textAlign: 'center', 
                    py: 4,
                    color: 'text.secondary',
                    fontStyle: 'italic'
                  }}
                >
                  <Typography variant="body2">
                    No {col.label.toLowerCase()} tasks
                  </Typography>
                </Box>
              ) : (
                grouped[col.key].map((task) => (
                  <TaskCard key={task.taskId || task.id} task={task} />
                ))
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TaskBoard;
