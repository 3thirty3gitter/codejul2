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
    
    const response = await aiTeam.routeQuery(message, agent);
    
    res.json({
      response,
      agent: agent || 'Auto-selected',
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
    agents: aiTeam.getAvailableAgents(),
    aiActive: aiTeam.isAIActive()
  });
});

// Health check for AI system
router.get('/status', (req: Request, res: Response) => {
  res.json({
    status: 'ready',
    aiActive: aiTeam.isAIActive(),
    agents: aiTeam.getAvailableAgents().length,
    timestamp: new Date().toISOString()
  });
});

export default router;
