import { Router } from "express";
import admin       from "firebase-admin";

const router = Router();

// GET /tasks?projectId=...
router.get("/", async (req, res) => {
  const { projectId } = req.query;
  if (!projectId) return res.status(400).json({ message: "Missing projectId" });
  try {
    const snap = await admin.firestore()
      .collection("tasks")
      .where("projectId", "==", projectId)
      .get();
    const tasks = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ tasks });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// POST /tasks
router.post("/", async (req, res) => {
  const { title, projectId, description, status, assignedTo, dueDate, createdBy } = req.body;
  if (!title || !projectId) return res.status(400).json({ message: "Missing fields" });
  try {
    const taskData = {
      title,
      projectId,
      description: description || "",
      status: status || "Todo",
      assignedTo: assignedTo || null,
      dueDate: dueDate || null,
      createdBy: createdBy || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const ref = await admin.firestore().collection("tasks").add(taskData);
    res.status(201).json({ id: ref.id, ...taskData });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to create task" });
  }
});

// PUT /tasks/:taskId
router.put("/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status, assignedTo, dueDate } = req.body;
  if (!taskId) return res.status(400).json({ message: "Missing taskId" });
  try {
    const updateData = {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
      ...(assignedTo !== undefined && { assignedTo }),
      ...(dueDate !== undefined && { dueDate }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    await admin.firestore().collection("tasks").doc(taskId).update(updateData);
    
    // Return the updated task
    const updatedDoc = await admin.firestore().collection("tasks").doc(taskId).get();
    if (!updatedDoc.exists) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    res.json({ id: taskId, ...updatedDoc.data() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to update task" });
  }
});

// DELETE /tasks/:taskId
router.delete("/:taskId", async (req, res) => {
  const { taskId } = req.params;
  if (!taskId) return res.status(400).json({ message: "Missing taskId" });
  try {
    const taskDoc = await admin.firestore().collection("tasks").doc(taskId).get();
    if (!taskDoc.exists) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    await admin.firestore().collection("tasks").doc(taskId).delete();
    res.status(200).json({ message: "Task deleted successfully", id: taskId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to delete task" });
  }
});

export default router;
