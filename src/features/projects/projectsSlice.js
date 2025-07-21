import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (userId, { rejectWithValue }) => {
    if (!userId) return rejectWithValue("No userId provided");
    try {
      const response = await axiosClient.get("/projects", { params: { userId } });
      return response.data.projects || response.data; // adapt to your backend shape
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
    currentProjectId: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    setCurrentProject(state, action) {
      state.currentProjectId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.projects = action.payload;
        // Auto-select first project if none selected
        if (!state.currentProjectId && action.payload.length > 0) {
          state.currentProjectId = action.payload[0].projectId || action.payload[0].id;
        }
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setCurrentProject } = projectsSlice.actions;
export default projectsSlice.reducer;
