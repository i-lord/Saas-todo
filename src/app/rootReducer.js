import { combineReducers } from "@reduxjs/toolkit";
import projectsReducer from "../features/projects/projectsSlice";
import tasksReducer from "../features/tasks/tasksSlice";

const rootReducer = combineReducers({
  projects: projectsReducer,
  tasks: tasksReducer,
});

export default rootReducer;
