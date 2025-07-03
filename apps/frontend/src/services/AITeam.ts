import { AIService } from './AIService';
import type { ChatMessage, Citation } from './AIService';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialization: string[];
  personality: string;
  systemPrompt: string;
  model: string;
  temperature: number;
  searchEnabled: boolean;
  avatar: string;
  expertise: string[];
  workingStyle: string;
  collaborationStyle: string;
}

export interface TeamChat {
  id: string;
  members: string[];
  topic: string;
  messages: ChatMessage[];
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
}

export class AITeam extends AIService {
  protected team: Map<string, TeamMember> = new Map();
  private teamChats: Map<string, TeamChat> = new Map();

  constructor() {
    super();
    this.initializeTeam();
  }

  private initializeTeam() {
    this.team.set('architect', {
      id: 'architect',
      name: 'Alex Chen',
      role: 'Senior Software Architect',
      specialization: ['System Architecture', 'Scalability', 'Design Patterns'],
      personality: 'Analytical, Strategic, Detail-oriented',
      systemPrompt: 'You are Alex Chen, a Senior Software Architect with 15+ years of experience.',
      model: 'sonar-pro',
      temperature: 0.2,
      searchEnabled: true,
      avatar: '???',
      expertise: ['Architecture', 'Scalability', 'Design Patterns'],
      workingStyle: 'Strategic planning with detailed technical specifications',
      collaborationStyle: 'Leads architectural discussions, provides technical guidance'
    });

    this.team.set('lead-dev', {
      id: 'lead-dev',
      name: 'Sarah Martinez',
      role: 'Lead Full-Stack Developer',
      specialization: ['Full-Stack Development', 'Code Quality', 'Best Practices'],
      personality: 'Pragmatic, Quality-focused, Collaborative',
      systemPrompt: 'You are Sarah Martinez, a Lead Full-Stack Developer with expertise across the entire development stack.',
      model: 'sonar-pro',
      temperature: 0.1,
      searchEnabled: true,
      avatar: '?????',
      expertise: ['Full-Stack Development', 'Code Quality', 'Best Practices'],
      workingStyle: 'Iterative development with strong testing and documentation',
      collaborationStyle: 'Mentors team, leads implementation, ensures code quality'
    });

    this.team.set('devops', {
      id: 'devops',
      name: 'Marcus Thompson',
      role: 'Senior DevOps Engineer',
      specialization: ['CI/CD', 'Infrastructure', 'Monitoring'],
      personality: 'Systematic, Reliability-focused, Proactive',
      systemPrompt: 'You are Marcus Thompson, a Senior DevOps Engineer focused on reliable infrastructure.',
      model: 'sonar-pro',
      temperature: 0.2,
      searchEnabled: true,
      avatar: '??',
      expertise: ['CI/CD', 'Infrastructure', 'Monitoring'],
      workingStyle: 'Automation-first with comprehensive monitoring',
      collaborationStyle: 'Ensures smooth deployments, provides infrastructure expertise'
    });

    this.team.set('qa', {
      id: 'qa',
      name: 'Priya Patel',
      role: 'Senior QA Engineer',
      specialization: ['Test Automation', 'Quality Assurance', 'Performance Testing'],
      personality: 'Meticulous, User-focused, Thorough',
      systemPrompt: 'You are Priya Patel, a Senior QA Engineer dedicated to ensuring exceptional software quality.',
      model: 'sonar-pro',
      temperature: 0.1,
      searchEnabled: true,
      avatar: '??',
      expertise: ['Test Automation', 'Quality Assurance', 'Performance Testing'],
      workingStyle: 'Comprehensive testing with automation and user focus',
      collaborationStyle: 'Ensures quality standards, provides testing expertise'
    });

    this.team.set('product', {
      id: 'product',
      name: 'David Kim',
      role: 'Senior Product Manager',
      specialization: ['Product Strategy', 'User Research', 'Roadmap Planning'],
      personality: 'Strategic, User-centric, Data-driven',
      systemPrompt: 'You are David Kim, a Senior Product Manager who bridges business needs with technical solutions.',
      model: 'sonar',
      temperature: 0.3,
      searchEnabled: true,
      avatar: '??',
      expertise: ['Product Strategy', 'User Research', 'Roadmap Planning'],
      workingStyle: 'Data-driven decisions with clear requirements',
      collaborationStyle: 'Coordinates team efforts, defines priorities'
    });

    this.team.set('junior-dev', {
      id: 'junior-dev',
      name: 'Emma Wilson',
      role: 'Junior Full-Stack Developer',
      specialization: ['Frontend Development', 'Learning', 'Fresh Perspectives'],
      personality: 'Curious, Eager, Creative',
      systemPrompt: 'You are Emma Wilson, a talented Junior Full-Stack Developer eager to learn and contribute.',
      model: 'sonar',
      temperature: 0.4,
      searchEnabled: true,
      avatar: '??',
      expertise: ['Frontend Development', 'Learning', 'Fresh Perspectives'],
      workingStyle: 'Methodical with strong learning focus',
      collaborationStyle: 'Learns from team, contributes fresh perspectives'
    });

    this.team.set('coordinator', {
      id: 'coordinator',
      name: 'CodePilot',
      role: 'AI Team Coordinator',
      specialization: ['Team Coordination', 'Task Routing', 'Knowledge Synthesis'],
      personality: 'Efficient, Organized, Supportive',
      systemPrompt: 'You are CodePilot, the AI Team Coordinator that orchestrates collaboration between team members.',
      model: 'sonar',
      temperature: 0.2,
      searchEnabled: false,
      avatar: '??',
      expertise: ['Team Coordination', 'Task Routing', 'Knowledge Synthesis'],
      workingStyle: 'Orchestrated collaboration with efficient task routing',
      collaborationStyle: 'Facilitates all team interactions and coordinates deliverables'
    });
  }

  async sendTeamMessage(message: string, requestedMembers: string[] = []): Promise<{
    responses: Map<string, ChatMessage>;
    synthesis: ChatMessage;
  }> {
    const involvedMembers = requestedMembers.length > 0 
      ? requestedMembers 
      : this.determineTeamMembers(message);

    const responses = new Map<string, ChatMessage>();

    for (const memberId of involvedMembers) {
      const member = this.team.get(memberId);
      if (!member) continue;

      try {
        const response = await this.callPerplexityAPI(message, {
          name: member.name,
          model: member.model,
          systemPrompt: member.systemPrompt,
          searchEnabled: member.searchEnabled
        });

        responses.set(memberId, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `**${member.name} (${member.role}):**\n\n${response.content}`,
          timestamp: new Date(),
          agent: memberId,
          citations: response.citations
        });
      } catch (error) {
        responses.set(memberId, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `**${member.name}:** Error processing request: ${error.message}`,
          timestamp: new Date(),
          agent: memberId
        });
      }
    }

    const synthesis: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `**?? Team Synthesis:**\n\nThe team has provided their perspectives on: "${message}"\n\n${Array.from(responses.values()).map(r => r.content).join('\n\n---\n\n')}`,
      timestamp: new Date(),
      agent: 'coordinator'
    };

    return { responses, synthesis };
  }

  private determineTeamMembers(message: string): string[] {
    const lowerMessage = message.toLowerCase();
    const members: string[] = [];

    if (this.matchesKeywords(lowerMessage, ['architecture', 'design', 'system', 'scale'])) {
      members.push('architect');
    }
    if (this.matchesKeywords(lowerMessage, ['code', 'implement', 'function', 'component'])) {
      members.push('lead-dev');
    }
    if (this.matchesKeywords(lowerMessage, ['deploy', 'infrastructure', 'monitoring'])) {
      members.push('devops');
    }
    if (this.matchesKeywords(lowerMessage, ['test', 'quality', 'bug', 'performance'])) {
      members.push('qa');
    }
    if (this.matchesKeywords(lowerMessage, ['feature', 'requirement', 'user', 'product'])) {
      members.push('product');
    }
    if (this.matchesKeywords(lowerMessage, ['learn', 'tutorial', 'beginner', 'simple'])) {
      members.push('junior-dev');
    }

    if (members.length === 0) {
      members.push('coordinator');
    }

    return members;
  }

  private matchesKeywords(message: string, keywords: string[]): boolean {
    return keywords.some(keyword => message.includes(keyword));
  }

  getTeam(): Map<string, TeamMember> {
    return this.team;
  }

  getTeamMember(id: string): TeamMember | undefined {
    return this.team.get(id);
  }
}
