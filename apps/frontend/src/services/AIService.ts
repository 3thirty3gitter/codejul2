export interface Agent {
  name: string;
  specialization: string;
  systemPrompt: string;
  model: string;
  temperature: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  agent?: string;
  context?: {
    files?: string[];
    codeBlocks?: string[];
    projects?: string[];
  };
}

export interface ConversationMemory {
  summary: string;
  keyTopics: string[];
  userPreferences: Record<string, any>;
  codeContext: {
    currentProject: string;
    recentFiles: string[];
    technologies: string[];
  };
}

export class AIService {
  private agents: Map<string, Agent> = new Map();
  private conversationHistory: ChatMessage[] = [];
  private memory: ConversationMemory = {
    summary: '',
    keyTopics: [],
    userPreferences: {},
    codeContext: {
      currentProject: '',
      recentFiles: [],
      technologies: []
    }
  };

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents() {
    // Code Specialist Agent (like Replit Agent)
    this.agents.set('coder', {
      name: 'CodePilot Coder',
      specialization: 'Full-stack development, debugging, code generation',
      systemPrompt: `You are an expert full-stack developer. You can:
- Generate complete applications from descriptions
- Debug complex issues
- Refactor and optimize code
- Follow best practices and modern patterns
- Work with any technology stack`,
      model: 'gpt-4',
      temperature: 0.1
    });

    // Architecture Agent
    this.agents.set('architect', {
      name: 'CodePilot Architect', 
      specialization: 'System design, project planning, technology selection',
      systemPrompt: `You are a senior software architect. You excel at:
- Designing scalable system architectures
- Selecting appropriate technologies
- Breaking down complex projects into manageable tasks
- Creating implementation roadmaps
- Identifying potential issues early`,
      model: 'gpt-4',
      temperature: 0.2
    });

    // Code Reviewer Agent
    this.agents.set('reviewer', {
      name: 'CodePilot Reviewer',
      specialization: 'Code review, security, performance optimization',
      systemPrompt: `You are an expert code reviewer focused on:
- Security vulnerabilities and best practices
- Performance optimization opportunities
- Code quality and maintainability
- Testing strategies and coverage
- Documentation completeness`,
      model: 'gpt-4',
      temperature: 0.1
    });

    // Learning Coordinator Agent
    this.agents.set('coordinator', {
      name: 'CodePilot Coordinator',
      specialization: 'Task routing, context management, learning',
      systemPrompt: `You coordinate between specialists and manage context. You:
- Route queries to the most appropriate agent
- Maintain conversation context and memory
- Learn from user interactions and preferences
- Synthesize responses from multiple agents
- Ensure consistency across the conversation`,
      model: 'gpt-3.5-turbo',
      temperature: 0.3
    });
  }

  async sendMessage(message: string, context?: any): Promise<ChatMessage> {
    // 1. Add user message to history
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date(),
      context
    };
    this.conversationHistory.push(userMessage);

    // 2. Determine which agent(s) should handle this
    const targetAgent = await this.routeToAgent(message, context);
    
    // 3. Generate response with context
    const response = await this.generateResponse(message, targetAgent, context);
    
    // 4. Update memory and learning
    await this.updateMemory(userMessage, response);
    
    this.conversationHistory.push(response);
    return response;
  }

  private async routeToAgent(message: string, context?: any): Promise<string> {
    // Intelligent routing based on message content and context
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('debug') || lowerMessage.includes('error') || lowerMessage.includes('fix')) {
      return 'coder';
    }
    
    if (lowerMessage.includes('architecture') || lowerMessage.includes('design') || lowerMessage.includes('plan')) {
      return 'architect';
    }
    
    if (lowerMessage.includes('review') || lowerMessage.includes('security') || lowerMessage.includes('optimize')) {
      return 'reviewer';
    }
    
    // Default to coordinator for general queries
    return 'coordinator';
  }

  private async generateResponse(message: string, agentKey: string, context?: any): Promise<ChatMessage> {
    const agent = this.agents.get(agentKey)!;
    
    // Build context-aware prompt
    const contextualPrompt = this.buildContextualPrompt(message, agent, context);
    
    // Simulate AI API call (replace with actual API)
    const aiResponse = await this.callAIAPI(contextualPrompt, agent);
    
    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
      agent: agentKey,
      context
    };
  }

  private buildContextualPrompt(message: string, agent: Agent, context?: any): string {
    let prompt = agent.systemPrompt + '\n\n';
    
    // Add conversation context
    if (this.conversationHistory.length > 0) {
      prompt += 'Recent conversation:\n';
      const recentMessages = this.conversationHistory.slice(-5);
      recentMessages.forEach(msg => {
        prompt += `${msg.role}: ${msg.content}\n`;
      });
      prompt += '\n';
    }
    
    // Add memory context
    if (this.memory.summary) {
      prompt += `Conversation summary: ${this.memory.summary}\n`;
    }
    
    if (this.memory.keyTopics.length > 0) {
      prompt += `Key topics discussed: ${this.memory.keyTopics.join(', ')}\n`;
    }
    
    // Add code context
    if (context?.files?.length > 0) {
      prompt += `Current files: ${context.files.join(', ')}\n`;
    }
    
    if (this.memory.codeContext.technologies.length > 0) {
      prompt += `Technologies in use: ${this.memory.codeContext.technologies.join(', ')}\n`;
    }
    
    prompt += `\nUser query: ${message}\n\nResponse:`;
    
    return prompt;
  }

  private async callAIAPI(prompt: string, agent: Agent): Promise<string> {
    // This would integrate with your preferred AI API (OpenAI, Anthropic, etc.)
    // For now, return a placeholder that shows the agent working
    return `[${agent.name}] I'm processing your request with my specialized knowledge in ${agent.specialization}. 

Based on the context and my expertise, here's my response...

(This will be replaced with actual AI API integration)`;
  }

  private async updateMemory(userMessage: ChatMessage, response: ChatMessage) {
    // Extract key topics and update memory
    const topics = this.extractTopics(userMessage.content + ' ' + response.content);
    this.memory.keyTopics = [...new Set([...this.memory.keyTopics, ...topics])].slice(-10);
    
    // Update code context if relevant
    if (userMessage.context?.files) {
      this.memory.codeContext.recentFiles = [
        ...new Set([...this.memory.codeContext.recentFiles, ...userMessage.context.files])
      ].slice(-20);
    }
    
    // Generate conversation summary periodically
    if (this.conversationHistory.length % 10 === 0) {
      this.memory.summary = await this.generateSummary();
    }
  }

  private extractTopics(text: string): string[] {
    // Simple topic extraction (could be enhanced with NLP)
    const keywords = text.toLowerCase().match(/\b(react|typescript|node|python|api|database|frontend|backend|testing|deployment|security|performance)\b/g);
    return keywords || [];
  }

  private async generateSummary(): Promise<string> {
    // Generate a summary of the conversation for memory
    const recentMessages = this.conversationHistory.slice(-20);
    return `User is working on a project involving ${this.memory.codeContext.technologies.join(', ')}. Key topics discussed include ${this.memory.keyTopics.join(', ')}.`;
  }

  getConversationHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  getMemory(): ConversationMemory {
    return this.memory;
  }

  clearMemory() {
    this.conversationHistory = [];
    this.memory = {
      summary: '',
      keyTopics: [],
      userPreferences: {},
      codeContext: {
        currentProject: '',
        recentFiles: [],
        technologies: []
      }
    };
  }
}
