import { Router, Request, Response } from 'express';
import { applicationBuilderService } from '../services/applicationBuilderService';

const router = Router();

// Generate plan endpoint with comprehensive error handling
router.post('/generate-plan', async (req: Request, res: Response) => {
  try {
    console.log('?? Generate plan request received');
    console.log('?? Request body:', req.body);
    console.log('?? Body type:', typeof req.body);
    console.log('?? Body keys:', Object.keys(req.body || {}));
    
    // Check if body exists and has description
    if (!req.body) {
      console.error('? Request body is undefined');
      return res.status(400).json({
        error: 'Request body is missing',
        message: 'Make sure Content-Type is application/json'
      });
    }

    const { description } = req.body;
    
    if (!description) {
      console.error('? Description field missing from body:', req.body);
      return res.status(400).json({
        error: 'Description is required',
        message: 'Request body must contain a description field',
        received: req.body
      });
    }

    if (typeof description !== 'string') {
      return res.status(400).json({
        error: 'Description must be a string',
        received: typeof description
      });
    }

    console.log('?? Generating plan for:', description);
    
    const plan = await applicationBuilderService.generatePlan(description);
    
    console.log('? Plan generated successfully:', plan.name);
    res.json(plan);
  } catch (error) {
    console.error('? Plan generation error:', error);
    res.status(500).json({
      error: 'Failed to generate plan',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Build project endpoint
router.post('/build', async (req: Request, res: Response) => {
  try {
    const { planId } = req.body;
    
    if (!planId || typeof planId !== 'string') {
      return res.status(400).json({
        error: 'Plan ID is required and must be a string'
      });
    }

    console.log('?? Building project for plan:', planId);
    
    const result = await applicationBuilderService.buildProject(planId);
    
    res.json(result);
  } catch (error) {
    console.error('? Build error:', error);
    res.status(500).json({
      error: 'Failed to build project',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
