import { https }      from "firebase-functions";
import express        from "express";
import cors           from "cors";

import projectsRoutes  from "../api/projects.js";
import tasksRoutes     from "../api/tasks.js";
import analyticsRoutes from "../api/analytics.js";
import authenticate    from "../utils/auth.js";

const app = express();
app.use(cors({ origin: true }));      // allow all origins (or lock to your domains)
app.use(express.json());

app.use(authenticate); // Require Firebase Auth for all API routes

app.use("/projects",  projectsRoutes);
app.use("/tasks",     tasksRoutes);
app.use("/analytics", analyticsRoutes);

export const api = https.onRequest(app);
