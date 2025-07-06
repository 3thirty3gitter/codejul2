import axios from 'axios';

// Export all interfaces that need to be used by other modules
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  agent?: string;
  citations?: Citation[];
}

export interface Citation {
  title: string;
  url: string;
  snippet: string;
}

interface Agent {
  name: string;
  model: string;
  systemPrompt: string;
  searchEnabled: boolean;
}

export class AIService {
  protected messages: ChatMessage[] = [];
  protected apiKey: string;
  protected agents: Map<string, Agent> = new Map();

  constructor() {
    this.apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY || '';
    this.initializeAgents();
  }

  protected initializeAgents() {
    this.agents.set('coder', {
      name: 'Elite Coder',
      model: 'sonar-pro',
      systemPrompt: 'You are an expert full-stack developer. Generate production-ready code, debug issues, and provide best practices.',
      searchEnabled: true
    });

    this.agents.set('architect', {
      name: 'System Architect', 
      model: 'sonar-pro',
      systemPrompt: 'You are a senior system architect. Design scalable architectures and create implementation roadmaps.',
      searchEnabled: true
    });

    this.agents.set('researcher', {
      name: 'Tech Researcher',
      model: 'sonar-pro',
      systemPrompt: 'You are a technology research specialist. Find the latest documentation and best practices.',
      searchEnabled: true
    });

    this.agents.set('accelerator', {
      name: 'Speed Demon',
      model: 'sonar',
      systemPrompt: 'You are a rapid development specialist. Focus on creating quick prototypes and MVPs.',
      searchEnabled: false
    });

    this.agents.set('coordinator', {
      name: 'AI Coordinator',
      model: 'sonar',
      systemPrompt: 'You coordinate between specialists and provide general assistance.',
      searchEnabled: false
    });
  }

  protected routeToAgent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('code') || lowerMessage.includes('debug') || lowerMessage.includes('function')) {
      return 'coder';
    }
    
    if (lowerMessage.includes('architecture') || lowerMessage.includes('design') || lowerMessage.includes('system')) {
      return 'architect';
    }
    
    if (lowerMessage.includes('research') || lowerMessage.includes('latest') || lowerMessage.includes('documentation')) {
      return 'researcher';
    }
    
    if (lowerMessage.includes('quick') || lowerMessage.includes('fast') || lowerMessage.includes('prototype')) {
      return 'accelerator';
    }
    
    return 'coordinator';
  }

  async sendMessage(message: string): Promise<ChatMessage> {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    this.messages.push(userMessage);

    const agentKey = this.routeToAgent(message);
    const agent = this.agents.get(agentKey)!;

    let response: ChatMessage;

    if (this.apiKey) {
      try {
        const aiResponse = await this.callPerplexityAPI(message, agent);
        response = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: aiResponse.content,
          timestamp: new Date(),
          agent: agentKey,
          citations: aiResponse.citations
        };
      } catch (error) {
        response = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `? Error: ${error.message}`,
          timestamp: new Date(),
          agent: agentKey
        };
      }
    } else {
      response = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `?? **${agent.name}** received: "${message}"\n\n?? **API Key Required** - Add your Perplexity API key to enable real AI responses!`,
        timestamp: new Date(),
        agent: agentKey
      };
    }
    
    this.messages.push(response);
    return response;
  }

  protected async callPerplexityAPI(message: string, agent: Agent): Promise<{content: string, citations: Citation[]}> {
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: agent.model,
        messages: [
          {
            role: 'system',
            content: agent.systemPrompt + '\n\nProject Context: CodePilot AI Development using React, TypeScript, and Tailwind CSS.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.2,
        max_tokens: 2048,
        return_citations: agent.searchEnabled
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const content = response.data.choices[0].message.content;
    const citations = response.data.citations || [];

    return {
      content,
      citations: citations.map((citation: any) => ({
        title: citation.title || 'Source',
        url: citation.url || '#',
        snippet: citation.snippet || ''
      }))
    };
  }

  getConversationHistory(): ChatMessage[] {
    return this.messages;
  }

  clearMemory() {
    this.messages = [];
  }

  async testConnection(): Promise<boolean> {
    if (!this.apiKey) return false;
    
    try {
      const agent = this.agents.get('coordinator')!;
      const response = await this.callPerplexityAPI('Test connection', agent);
      return response.content.length > 0;
    } catch (error) {
      return false;
    }
  }

  getMemory() {
    return { 
      keyTopics: ['AI', 'CodePilot', 'Development'], 
      codeContext: { 
        currentProject: 'CodePilot AI Workspace', 
        technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Perplexity API'] 
      } 
    };
  }
}
