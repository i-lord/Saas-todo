import { Router } from "express";
import admin       from "firebase-admin";

const router = Router();

// GET /projects?userId=...
router.get("/", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "Missing userId" });
  try {
    const snap = await admin.firestore()
      .collection("projects")
      .where("ownerId", "==", userId)
      .get();
    const projects = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ projects });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

// POST /projects
router.post("/", async (req, res) => {
  const { name, description, ownerId } = req.body;
  if (!name || !ownerId) return res.status(400).json({ message: "Missing fields" });
  try {
    const ref = await admin.firestore().collection("projects").add({ name, description, ownerId });
    res.status(201).json({ id: ref.id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to create project" });
  }
});

export default router;
