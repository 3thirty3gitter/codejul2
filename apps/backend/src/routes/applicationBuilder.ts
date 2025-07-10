import { Router, Request, Response } from 'express';
import { applicationBuilderService } from '../services/applicationBuilderService';

const router = Router();

// Enhanced generate-plan endpoint with persistent sessions (Replit-style)
router.post('/generate-plan', async (req: Request, res: Response) => {
  try {
    const { description, sessionId } = req.body;
    if (!description) {
      return res.status(400).json({ error: 'Project description is required' });
    }

    console.log(`📝 Plan request: ${description}${sessionId ? ` (Session: ${sessionId})` : ' (New Session)'}`);
    const result = await applicationBuilderService.generatePlan(description, sessionId);
    
    console.log(`✅ Plan generated: ${result.name} - Session: ${result.sessionId} (Context preserved)`);
    res.json(result);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Plan generation error:', errorMessage);
    res.status(500).json({ error: 'Failed to generate plan', message: errorMessage });
  }
});

// Get session details (for debugging and monitoring)
router.get('/session/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = applicationBuilderService.getSession(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    console.log(`📊 Session details requested: ${session.projectName}`);
    res.json(session);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to get session', message: errorMessage });
  }
});

// Update session phase (for phase tracking)
router.post('/session/:sessionId/phase', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { phase } = req.body;
    
    applicationBuilderService.updateSessionPhase(sessionId, phase);
    console.log(`📋 Phase updated for session ${sessionId}: ${phase}`);
    res.json({ success: true, sessionId, phase });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to update session phase', message: errorMessage });
  }
});

// Add completed step (for progress tracking)
router.post('/session/:sessionId/step', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { step } = req.body;
    
    applicationBuilderService.addCompletedStep(sessionId, step);
    console.log(`✅ Step completed for session ${sessionId}: ${step}`);
    res.json({ success: true, sessionId, step });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to add completed step', message: errorMessage });
  }
});

// Get system statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = applicationBuilderService.getSessionStats();
    console.log(`📊 System stats requested: ${stats.totalSessions} sessions, ${stats.activeProjects.length} active projects`);
    res.json(stats);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to get stats', message: errorMessage });
  }
});

export default router;
