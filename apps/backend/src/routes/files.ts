import express from "express";
import { pgPool } from "../db/connection";
const router = express.Router();

// GET /api/files/:projectId - Get all files for a project
router.get("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const result = await pgPool.query(
      "SELECT * FROM files WHERE project_id = $1 ORDER BY created_at DESC",
      [projectId]
    );
    res.json(result.rows);
  } catch (error) {
    let errorMsg = "Unknown error";
    if (error instanceof Error) {
      errorMsg = error.message;
    }
    res.status(500).json({ error: "Failed to fetch files", details: errorMsg });
  }
});

// POST /api/files - Create a new file
router.post("/", async (req, res) => {
  try {
    const { projectId, path, name, content, fileType } = req.body;
    const result = await pgPool.query(
      `INSERT INTO files (project_id, path, name, content, file_type, size) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [projectId, path, name, content, fileType, content?.length || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    let errorMsg = "Unknown error";
    if (error instanceof Error) {
      errorMsg = error.message;
    }
    res.status(500).json({ error: "Failed to create file", details: errorMsg });
  }
});

export default router;
