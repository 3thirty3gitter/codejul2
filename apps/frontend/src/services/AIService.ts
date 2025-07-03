import axios from 'axios';

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
  private messages: ChatMessage[] = [];
  private apiKey: string;
  private agents: Map<string, Agent> = new Map();

  constructor() {
    this.apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY || '';
    this.initializeAgents();
  }

  private initializeAgents() {
    // Updated with current valid Perplexity model names
    this.agents.set('coder', {
      name: 'Elite Coder',
      model: 'sonar-pro', // Premium model for production code
      systemPrompt: 'You are an expert full-stack developer. Generate production-ready code, debug issues, and provide best practices. Always include working examples.',
      searchEnabled: true
    });

    this.agents.set('architect', {
      name: 'System Architect', 
      model: 'sonar-pro', // Premium model for comprehensive design
      systemPrompt: 'You are a senior system architect. Design scalable architectures, recommend technology stacks, and create implementation roadmaps.',
      searchEnabled: true
    });

    this.agents.set('researcher', {
      name: 'Tech Researcher',
      model: 'sonar-pro', // Premium model with web search
      systemPrompt: 'You are a technology research specialist. Find the latest documentation, compare solutions, and provide current best practices.',
      searchEnabled: true
    });

    this.agents.set('accelerator', {
      name: 'Speed Demon',
      model: 'sonar', // Faster basic model for quick responses
      systemPrompt: 'You are a rapid development specialist. Focus on creating quick prototypes and MVPs. Prioritize speed and functionality.',
      searchEnabled: false
    });

    this.agents.set('coordinator', {
      name: 'AI Coordinator',
      model: 'sonar', // Basic model for general coordination
      systemPrompt: 'You coordinate between specialists and provide general assistance. Route complex queries to appropriate agents.',
      searchEnabled: false
    });
  }

  private routeToAgent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('code') || lowerMessage.includes('debug') || lowerMessage.includes('function') || lowerMessage.includes('component')) {
      return 'coder';
    }
    
    if (lowerMessage.includes('architecture') || lowerMessage.includes('design') || lowerMessage.includes('system') || lowerMessage.includes('scale')) {
      return 'architect';
    }
    
    if (lowerMessage.includes('research') || lowerMessage.includes('latest') || lowerMessage.includes('compare') || lowerMessage.includes('documentation')) {
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

    // Route to appropriate agent
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
          content: `? Error connecting to Perplexity API: ${error.message}. Please check your API key configuration.`,
          timestamp: new Date(),
          agent: agentKey
        };
      }
    } else {
      response = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `?? **${agent.name} here!** I received your message: "${message}"\n\n?? **API Key Required**: To enable real AI responses with live web search, please:\n1. Get your Perplexity API key from [perplexity.ai](https://perplexity.ai)\n2. Add it to your \`.env.local\` file: \`VITE_PERPLEXITY_API_KEY=your_key_here\`\n3. Restart your dev server\n\nOnce configured, I'll provide intelligent responses with real-time web search and citations!`,
        timestamp: new Date(),
        agent: agentKey
      };
    }
    
    this.messages.push(response);
    return response;
  }

  private async callPerplexityAPI(message: string, agent: Agent): Promise<{content: string, citations: Citation[]}> {
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
        return_citations: agent.searchEnabled,
        search_domain_filter: agent.searchEnabled ? ['github.com', 'stackoverflow.com', 'developer.mozilla.org'] : undefined
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
      const response = await this.callPerplexityAPI('Say "Hello from Perplexity!" to test the connection.', agent);
      return response.content.toLowerCase().includes('hello');
    } catch (error) {
      console.error('Perplexity connection test failed:', error);
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
