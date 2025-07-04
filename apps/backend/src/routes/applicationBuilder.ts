import { Router } from "express";
import { applicationBuilder } from "../services/applicationBuilderService";
import { codeGenerator } from "../services/codeGenerationService";

const router = Router();

// Generate project plan from description
router.post("/plan", async (req, res) => {
  try {
    const { description, requirements, style, target, userId } = req.body;
    
    console.log("??? Building project plan for:", description);
    
    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    const buildRequest = {
      description,
      requirements,
      style,
      target,
      userId
    };

    const plan = await applicationBuilder.generateProjectPlan(buildRequest);
    
    console.log("? Project plan generated:", plan.title);
    
    res.json({
      success: true,
      plan,
      message: "Project plan generated successfully"
    });
  } catch (error: any) {
    console.error("? Application builder error:", error);
    res.status(500).json({ 
      error: "Application planning failed", 
      details: error.message 
    });
  }
});

// Start building project (generate code)
router.post("/build/:planId", async (req, res) => {
  try {
    const { planId } = req.params;
    
    console.log("?? Starting build for plan:", planId);
    
    // Actually generate the application code
    console.log("?? Generating cookie website...");
    const buildResult = await codeGenerator.generateCookieWebsite(planId);
    
    console.log("?? Build result:", buildResult);
    
    if (buildResult.status === 'completed') {
      res.json({
        success: true,
        message: "Application built successfully!",
        buildId: buildResult.buildId,
        status: buildResult.status,
        projectPath: buildResult.projectPath,
        files: buildResult.files.map(f => ({ path: f.path, type: f.type }))
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Build failed",
        buildId: buildResult.buildId,
        status: buildResult.status,
        error: buildResult.error
      });
    }
  } catch (error: any) {
    console.error("? Build start error:", error);
    res.status(500).json({ 
      error: "Build failed to start", 
      details: error.message 
    });
  }
});

export default router;
