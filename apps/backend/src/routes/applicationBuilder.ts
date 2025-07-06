import { Router } from "express";
import { ApplicationBuilderService } from "../services/applicationBuilderService";

export default function(applicationBuilder = new ApplicationBuilderService()) {
  const router = Router();

  router.post("/plan", async (req, res) => {
    try {
      const plan = await applicationBuilder.generateProjectPlan(req.body);
      res.json({ plan });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
