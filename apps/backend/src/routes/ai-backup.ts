import { Router, Request, Response } from 'express';
import { AITeam } from '../services/AITeam';

const router = Router();
const aiTeam = new AITeam();

// Main AI chat endpoint
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, agent } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string'
      });
    }

    console.log(`?? AI Chat request: ${message.substring(0, 100)}...`);
    
    // Get or create session
    let sessionId = req.body.sessionId;
    if (!sessionId) {
      sessionId = aiTeam.createSession(req.body.userId, req.body.projectId);
    }
    
    const result = await aiTeam.routeQueryWithMemory(
      message, 
      sessionId, 
      agent,
      req.body.context || {}
    );
    
    res.json({
      response: result.response,
      agent: result.agent,
      sessionId: result.sessionId,
      timestamp: new Date().toISOString(),
      aiActive: aiTeam.isAIActive()
    });
  } catch (error) {
    console.error('? AI Chat error:', error);
    res.status(500).json({
      error: 'AI processing failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get available agents
router.get('/agents', (req: Request, res: Response) => {
  res.json({
      response: result.response,
      agent: result.agent,
      sessionId: result.sessionId,
      timestamp: new Date().toISOString(),
      aiActive: aiTeam.isAIActive()
    });
});

// Health check for AI system
router.get('/status', (req: Request, res: Response) => {
  res.json({
      response: result.response,
      agent: result.agent,
      sessionId: result.sessionId,
      timestamp: new Date().toISOString(),
      aiActive: aiTeam.isAIActive()
    });
});

export default router;

// Get session history
router.get('/session/:sessionId', (req: Request, res: Response) => {
  try {
    const session = aiTeam.getSession(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
});

// List all sessions
router.get('/sessions', (req: Request, res: Response) => {
  try {
    const sessions = aiTeam.getAllSessions();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list sessions' });
  }
});

// Get agent specializations
router.get('/agents/specializations', (req: Request, res: Response) => {
  res.json(aiTeam.getAgentSpecializations());
});
