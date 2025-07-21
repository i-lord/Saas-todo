import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { getDefaultDueDate, formatDateForInput } from '../utils/dateUtils';

const statusOptions = [
  { value: 'Todo', label: 'To Do' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Done', label: 'Done' }
];

export default function TaskForm({ open, onClose, onSubmit, loading, task = null }) {
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'Todo',
    assignedTo: task?.assignedTo || '',
    dueDate: task?.dueDate ? formatDateForInput(task.dueDate) : getDefaultDueDate()
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Task title is required');
      return;
    }
    setError('');
    onSubmit(form);
  };

  const handleClose = () => {
    setForm({
      title: '',
      description: '',
      status: 'Todo',
      assignedTo: '',
      dueDate: getDefaultDueDate()
    });
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Task Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              required
              autoFocus
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={3}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={form.status}
                onChange={handleChange}
                label="Status"
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Assigned To"
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              fullWidth
              placeholder="Enter name or email"
            />
            <TextField
              label="Due Date"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              helperText="Select a due date for this task"
            />
            {error && <span style={{ color: 'red' }}>{error}</span>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? (task ? 'Updating...' : 'Creating...') : (task ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
