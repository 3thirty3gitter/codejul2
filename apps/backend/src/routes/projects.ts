import express from "express";
import { pgPool } from "../db/connection";
const router = express.Router();

// GET /api/projects - Get all projects for user
router.get("/", async (req, res) => {
  try {
    const defaultUserId = "00000000-0000-0000-0000-000000000001";
    const result = await pgPool.query(
      "SELECT * FROM projects WHERE user_id = $1 ORDER BY updated_at DESC",
      [defaultUserId]
    );
    res.json(result.rows);
  } catch (error) {
    let errorMsg = "Unknown error";
    if (error instanceof Error) {
      errorMsg = error.message;
    }
    res.status(500).json({ error: "Failed to fetch projects", details: errorMsg });
  }
});

export default router;
