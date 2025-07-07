import { ConversationMemory } from './ConversationMemory';

interface Agent {
  name: string;
  model: string;
  temperature: number;
  systemPrompt: string;
  keywords: string[];
  specialization: string;
}

export class AITeam {
  private perplexityApiKey: string | null;
  private apiBaseUrl = 'https://api.perplexity.ai/chat/completions';
  private conversationMemory: ConversationMemory;

  private agents: Agent[] = [
    {
      name: 'Elite Coder Agent',
      model: 'sonar',
      temperature: 0.7,
      systemPrompt: 'You are an elite software developer with expertise in React, TypeScript, Node.js, and modern web development. Generate clean, production-ready code with best practices. You have access to conversation history to maintain context.',
      keywords: ['code', 'react', 'typescript', 'component', 'function', 'class', 'api', 'frontend', 'backend'],
      specialization: 'code_generation'
    },
    {
      name: 'System Architect Agent',
      model: 'sonar',
      temperature: 0.6,
      systemPrompt: 'You are a senior system architect specializing in scalable application design, tech stack selection, and project structure. You maintain context across conversations to ensure consistent architectural decisions.',
      keywords: ['architecture', 'design', 'structure', 'scalable', 'database', 'deployment', 'infrastructure', 'tech stack'],
      specialization: 'architecture'
    },
    {
      name: 'Code Guardian Agent',
      model: 'sonar',
      temperature: 0.4,
      systemPrompt: 'You are a security and performance expert. Focus on code security, optimization, best practices, and identifying potential vulnerabilities. You remember previous security recommendations.',
      keywords: ['security', 'performance', 'optimization', 'vulnerability', 'best practices', 'audit', 'review'],
      specialization: 'security_performance'
    }
  ];

  constructor() {
    // Ensure environment variables are loaded
    require('dotenv').config();
    this.perplexityApiKey = process.env.PERPLEXITY_API_KEY || null;
    this.conversationMemory = new ConversationMemory();
    
    if (!this.perplexityApiKey) {
      console.warn('?? PERPLEXITY_API_KEY not set - AI agents will use fallback responses');
    } else {
      console.log('? AITeam initialized with Perplexity integration and conversation memory');
    }

    // Start cleanup interval for expired sessions
    setInterval(() => this.conversationMemory.cleanupExpiredSessions(), 60 * 60 * 1000); // Every hour
  }

  createSession(userId?: string, projectId?: string): string {
    return this.conversationMemory.createSession(userId, projectId);
  }

  async routeQueryWithMemory(
    query: string, 
    sessionId: string, 
    preferredAgent?: string, 
    context: Record<string, any> = {}
  ): Promise<{ response: string; agent: string; sessionId: string }> {
    try {
      const agent = this.selectAgent(query, preferredAgent);
      console.log(`?? Routing to: ${agent.name} with memory context`);
      
      // Get conversation context
      const conversationContext = this.conversationMemory.getSessionContext(sessionId);
      
      // Build enhanced prompt with memory
      const enhancedQuery = this.buildContextualPrompt(query, conversationContext, agent, context);
      
      let response: string;
      if (this.perplexityApiKey) {
        response = await this.callPerplexityAPI(enhancedQuery, agent);
      } else {
        response = this.generateFallbackResponse(query, agent);
      }
      
      // Store the interaction in memory
      this.conversationMemory.addTurn(sessionId, query, response, agent.name, context);
      
      return {
        response,
        agent: agent.name,
        sessionId
      };
    } catch (error) {
      console.error('? AI Team routing failed:', error);
      return {
        response: this.generateErrorResponse(query),
        agent: 'Error Handler',
        sessionId
      };
    }
  }

  // Legacy method for backward compatibility
  async routeQuery(query: string, preferredAgent?: string): Promise<string> {
    const tempSessionId = this.createSession();
    const result = await this.routeQueryWithMemory(query, tempSessionId, preferredAgent);
    return result.response;
  }

  private buildContextualPrompt(
    query: string, 
    conversationContext: string, 
    agent: Agent, 
    context: Record<string, any>
  ): string {
    const parts = [];
    
    // Add agent's system prompt
    parts.push(agent.systemPrompt);
    
    // Add conversation context if available
    if (conversationContext) {
      parts.push('\n--- Conversation Context ---');
      parts.push(conversationContext);
      parts.push('--- End Context ---\n');
    }
    
    // Add additional context if provided
    if (context && Object.keys(context).length > 0) {
      parts.push('\n--- Additional Context ---');
      parts.push(JSON.stringify(context, null, 2));
      parts.push('--- End Additional Context ---\n');
    }
    
    // Add current query
    parts.push('\nCurrent Request:');
    parts.push(query);
    
    return parts.join('\n');
  }

  private selectAgent(query: string, preferredAgent?: string): Agent {
    if (preferredAgent) {
      const agent = this.agents.find(a => a.name === preferredAgent);
      if (agent) return agent;
    }

    const queryLower = query.toLowerCase();
    
    for (const agent of this.agents) {
      if (agent.keywords.some(keyword => queryLower.includes(keyword))) {
        return agent;
      }
    }

    return this.agents[0];
  }

  private async callPerplexityAPI(query: string, agent: Agent): Promise<string> {
    const response = await fetch(this.apiBaseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.perplexityApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: agent.model,
        messages: [
          {
            role: 'user',
            content: query
          }
        ],
        temperature: agent.temperature,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || 'No response generated';
    
    console.log(`? ${agent.name} response with context: ${content.substring(0, 100)}...`);
    return content;
  }

  private generateFallbackResponse(query: string, agent: Agent): string {
    console.log(`? Using fallback response for ${agent.name}`);
    return `// Fallback response from ${agent.name}\n// Query: ${query}\n// Please configure Perplexity API integration`;
  }

  private generateErrorResponse(query: string): string {
    return `# Error Response\n\nAn error occurred while processing: "${query}"\n\nPlease check API configuration and connectivity.`;
  }

  getSession(sessionId: string) {
    return this.conversationMemory.getSession(sessionId);
  }

  getAllSessions() {
    return this.conversationMemory.getAllSessions();
  }

  isAIActive(): boolean {
    return !!this.perplexityApiKey;
  }

  getAvailableAgents(): string[] {
    return this.agents.map(agent => agent.name);
  }

  getAgentSpecializations(): Record<string, string> {
    return this.agents.reduce((acc, agent) => {
      acc[agent.name] = agent.specialization;
      return acc;
    }, {} as Record<string, string>);
  }
}

