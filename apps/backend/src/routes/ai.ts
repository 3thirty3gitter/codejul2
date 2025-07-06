import express from "express";
import { askAI } from "../services/aiService";
const router = express.Router();

router.post("/chat", async (req, res) => {
  const { message, sessionId } = req.body;
  try {
    const reply = await askAI(message, sessionId);
    res.json({ reply, sessionId });
  } catch (err) {
    let errorMsg = "Unknown error";
    if (err instanceof Error) {
      errorMsg = err.message;
    }
    res.status(500).json({ error: "AI service error", details: errorMsg });
  }
});

export default router;
