import { Router } from "express";
import admin       from "firebase-admin";

const router = Router();

// GET /analytics?userId=...&projectId=...
router.get("/", async (req, res) => {
  const { userId, projectId } = req.query;
  if (!userId) return res.status(400).json({ message: "Missing userId" });
  try {
    let projectIds = [];
    
    if (projectId) {
      // Filter for specific project
      const projectDoc = await admin.firestore()
        .collection("projects")
        .doc(projectId)
        .get();
      
      if (!projectDoc.exists || projectDoc.data().ownerId !== userId) {
        return res.status(404).json({ message: "Project not found or access denied" });
      }
      projectIds = [projectId];
    } else {
      // fetch all project IDs for user
      const projectsSnap = await admin.firestore()
        .collection("projects")
        .where("ownerId", "==", userId)
        .get();
      projectIds = projectsSnap.docs.map(d => d.id);
    }
    
    if (projectIds.length === 0) return res.json({ statusCounts: {} });

    // fetch tasks in those projects
    const tasksSnap = await admin.firestore()
      .collection("tasks")
      .where("projectId", "in", projectIds)
      .get();

    const statusCounts = {};
    tasksSnap.docs.forEach(d => {
      const s = d.data().status || "unknown";
      statusCounts[s] = (statusCounts[s] || 0) + 1;
    });
    
    // Add project context info
    const responseData = { 
      statusCounts,
      projectId: projectId || null,
      projectCount: projectIds.length
    };
    
    res.json(responseData);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to aggregate analytics" });
  }
});

export default router;
