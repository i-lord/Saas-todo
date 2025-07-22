import { https } from "firebase-functions";
import admin from "firebase-admin";
import express from "express";
import cors from "cors";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const app = express();
// Update CORS to allow both local and Vercel frontend
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://saas-todo-six.vercel.app"
  ]
}));
app.use(express.json());

// --- Analytics Endpoint ---
app.get("/analytics", async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: "Missing userId query param" });
    }
    // Get all projects for the user
    const projectsSnap = await admin.firestore().collection("projects").where("ownerId", "==", userId).get();
    const projectIds = projectsSnap.docs.map(doc => doc.id);
    if (projectIds.length === 0) {
      return res.json({ statusCounts: {} });
    }
    // Get all tasks for these projects
    const tasksSnap = await admin.firestore().collection("tasks").where("projectId", "in", projectIds).get();
    const statusCounts = {};
    tasksSnap.docs.forEach(doc => {
      const status = doc.data().status || "unknown";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    res.json({ statusCounts });
  } catch (err) {
    console.error("Error in analytics function:", err);
    res.status(500).json({ message: "Failed to aggregate analytics" });
  }
});

// --- Projects Endpoints ---
app.get("/projects", async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: "Missing userId query param" });
    }
    const projectsSnap = await admin.firestore().collection("projects").where("ownerId", "==", userId).get();
    const projects = projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ projects });
  } catch (err) {
    console.error("Error in projects endpoint:", err);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

app.post("/projects", async (req, res) => {
  try {
    const { name, description, ownerId } = req.body;
    if (!name || !ownerId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const projectRef = await admin.firestore().collection("projects").add({ name, description, ownerId });
    res.status(201).json({ id: projectRef.id });
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ message: "Failed to create project" });
  }
});

// --- Tasks Endpoints ---
app.get("/tasks", async (req, res) => {
  try {
    const projectId = req.query.projectId;
    if (!projectId) {
      return res.status(400).json({ message: "Missing projectId query param" });
    }
    const tasksSnap = await admin.firestore().collection("tasks").where("projectId", "==", projectId).get();
    const tasks = tasksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ tasks });
  } catch (err) {
    console.error("Error in tasks endpoint:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const { title, description, status, projectId, assignedTo, dueDate } = req.body;
    if (!title || !projectId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const taskRef = await admin.firestore().collection("tasks").add({
      title,
      description,
      status: status || "todo",
      projectId,
      assignedTo: assignedTo || null,
      dueDate: dueDate || null,
    });
    res.status(201).json({ id: taskRef.id });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
});

export const api = https.onRequest(app);
