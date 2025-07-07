interface ConversationTurn {
  id: string;
  timestamp: Date;
  userMessage: string;
  agentResponse: string;
  agentUsed: string;
  context: Record<string, any>;
}

interface ConversationSession {
  sessionId: string;
  userId?: string;
  projectId?: string;
  turns: ConversationTurn[];
  context: Record<string, any>;
  created: Date;
  lastActivity: Date;
}

export class ConversationMemory {
  private sessions: Map<string, ConversationSession> = new Map();
  private maxTurnsPerSession = 50;
  private sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours

  createSession(userId?: string, projectId?: string): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: ConversationSession = {
      sessionId,
      userId,
      projectId,
      turns: [],
      context: {},
      created: new Date(),
      lastActivity: new Date()
    };

    this.sessions.set(sessionId, session);
    console.log(`?? Created conversation session: ${sessionId}`);
    return sessionId;
  }

  addTurn(sessionId: string, userMessage: string, agentResponse: string, agentUsed: string, context: Record<string, any> = {}): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.warn(`?? Session not found: ${sessionId}`);
      return;
    }

    const turn: ConversationTurn = {
      id: `turn_${Date.now()}`,
      timestamp: new Date(),
      userMessage,
      agentResponse,
      agentUsed,
      context
    };

    session.turns.push(turn);
    session.lastActivity = new Date();
    
    // Merge context
    session.context = { ...session.context, ...context };

    // Limit turns to prevent memory bloat
    if (session.turns.length > this.maxTurnsPerSession) {
      session.turns = session.turns.slice(-this.maxTurnsPerSession);
    }

    console.log(`?? Added turn to session ${sessionId}: ${agentUsed}`);
  }

  getSessionContext(sessionId: string): string {
    const session = this.sessions.get(sessionId);
    if (!session || session.turns.length === 0) {
      return '';
    }

    // Build context from recent turns
    const recentTurns = session.turns.slice(-5); // Last 5 turns
    const contextBuilder = [];

    contextBuilder.push('Previous conversation context:');
    
    recentTurns.forEach((turn, index) => {
      contextBuilder.push(`Turn ${index + 1}:`);
      contextBuilder.push(`User: ${turn.userMessage}`);
      contextBuilder.push(`${turn.agentUsed}: ${turn.agentResponse.substring(0, 200)}...`);
      contextBuilder.push('');
    });

    if (session.context && Object.keys(session.context).length > 0) {
      contextBuilder.push('Session context:');
      contextBuilder.push(JSON.stringify(session.context, null, 2));
    }

    return contextBuilder.join('\n');
  }

  getSession(sessionId: string): ConversationSession | null {
    return this.sessions.get(sessionId) || null;
  }

  cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastActivity.getTime() > this.sessionTimeout) {
        this.sessions.delete(sessionId);
        console.log(`?? Cleaned up expired session: ${sessionId}`);
      }
    }
  }

  getAllSessions(): ConversationSession[] {
    return Array.from(this.sessions.values());
  }
}
