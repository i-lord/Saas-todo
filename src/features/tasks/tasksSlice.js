import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/tasks?projectId=${projectId}`);
      return response.data.tasks || response.data; // adapt to your backend shape
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/tasks', taskData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskId, ...taskData }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/tasks/${taskId}`);
      return taskId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Optimistic updates for better UX
    addTaskOptimistic: (state, action) => {
      state.tasks.push({ ...action.payload, id: 'temp-' + Date.now() });
    },
    updateTaskOptimistic: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Create Task
      .addCase(createTask.pending, (state) => {
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        // Remove temp task if exists and add real task
        state.tasks = state.tasks.filter(task => !task.id.toString().startsWith('temp-'));
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload;
        // Remove temp task on failure
        state.tasks = state.tasks.filter(task => !task.id.toString().startsWith('temp-'));
      })
      // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => (task.taskId || task.id) === (action.payload.taskId || action.payload.id));
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => (task.taskId || task.id) !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { addTaskOptimistic, updateTaskOptimistic } = tasksSlice.actions;
export default tasksSlice.reducer;
