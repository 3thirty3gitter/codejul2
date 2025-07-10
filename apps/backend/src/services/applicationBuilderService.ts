import { v4 as uuidv4 } from "uuid";
import { AITeam } from "./AITeam";

interface Plan {
  id: string;
  name: string;
  description: string;
  type: string;
  techStack: string[];
  files: string[];
  created: Date;
}

interface ProjectSession {
  sessionId: string;
  projectName: string;
  projectDescription: string;
  currentPhase: 'planning' | 'designing' | 'building' | 'refining';
  plans: Plan[];
  currentPlanId: string | null;
  requirements: string[];
  completedSteps: string[];
  nextActions: string[];
  lastInteraction: Date;
}

class ApplicationBuilderService {
  private sessions = new Map<string, ProjectSession>();
  private aiTeam: AITeam;

  constructor() {
    this.aiTeam = new AITeam();
    console.log("✅ ApplicationBuilderService initialized with Replit-style persistent memory");
  }

  async generatePlan(description: string, sessionId?: string): Promise<Plan & { sessionId: string }> {
    let session: ProjectSession;

    if (!sessionId || !this.sessions.has(sessionId)) {
      // Create new session with persistent context
      sessionId = this.aiTeam.createSession();
      session = {
        sessionId,
        projectName: "",
        projectDescription: "",
        currentPhase: 'planning',
        plans: [],
        currentPlanId: null,
        requirements: [],
        completedSteps: [],
        nextActions: [],
        lastInteraction: new Date()
      };
      this.sessions.set(sessionId, session);
      console.log(`🧠 Created persistent session: ${sessionId} (Replit-style memory active)`);
    } else {
      session = this.sessions.get(sessionId)!;
      session.lastInteraction = new Date();
      console.log(`🧠 Continuing session: ${sessionId} for project: ${session.projectName}`);
    }

    // Determine if this is a new project or modification to existing project
    const isModification = session.projectName !== "" && this.isModificationRequest(description);

    let aiResponse: string;
    let projectName: string;

    if (isModification) {
      console.log(`📝 Enhancing existing project: ${session.projectName} (Phase: ${session.currentPhase})`);
      const contextPrompt = this.buildContextualPrompt(description, session);
      aiResponse = await this.aiTeam.routeQuery(contextPrompt, "Elite Coder Agent");
      projectName = session.projectName;
      
      // Track new requirements
      session.requirements.push(description);
      session.lastInteraction = new Date();
    } else {
      console.log("✨ Starting new project with persistent context");
      const engagementPrompt = `A user wants to start a new project: "${description}". 
      Start a creative, collaborative conversation. Propose a creative project name in the format "Project Name: [Name]" 
      and ask for input on design themes and requirements. Be engaging like the Replit agent.`;
      
      aiResponse = await this.aiTeam.routeQuery(engagementPrompt, "Master Coordinator Agent");
      projectName = this.extractProjectName(description, aiResponse);
      
      // Initialize new project in session (like Replit remembers "jacket teest")
      session.projectName = projectName;
      session.projectDescription = description;
      session.currentPhase = 'planning';
      session.requirements = [description];
      session.nextActions = ["Gather design requirements", "Define project scope"];
      session.lastInteraction = new Date();
    }

    const plan: Plan = {
      id: uuidv4(),
      name: projectName,
      description: aiResponse,
      type: this.detectProjectType(description),
      techStack: this.getTechStack(this.detectProjectType(description)),
      files: this.getProjectFiles(this.detectProjectType(description)),
      created: new Date()
    };

    session.plans.push(plan);
    session.currentPlanId = plan.id;
    this.sessions.set(sessionId, session);

    // Add to conversation memory for continuity
    this.aiTeam.conversationMemory.addTurn(sessionId, { 
      userMessage: description, 
      agentResponse: aiResponse 
    });

    console.log(`✅ Plan created: ${plan.name} - Session persisted with context`);
    
    return { ...plan, sessionId };
  }

  private buildContextualPrompt(description: string, session: ProjectSession): string {
    const context = `
Project: ${session.projectName}
Description: ${session.projectDescription}
Current Phase: ${session.currentPhase}
Requirements: ${session.requirements.join(', ')}
Completed Steps: ${session.completedSteps.join(', ')}
Next Actions: ${session.nextActions.join(', ')}
`;

    return `You are continuing work on an existing project. Context:
${context}

User's new request: "${description}"

Provide a detailed response that builds on the existing project context. 
Reference the project by name (${session.projectName}) and show how this request connects to previous work.
Be collaborative and specific like the Replit agent.`;
  }

  private isModificationRequest(description: string): boolean {
    const modificationKeywords = [
      "add", "change", "fix", "update", "modify", "improve", 
      "show me", "what about", "can you", "let's", "now",
      "also", "next", "then", "and", "use", "make it"
    ];
    
    const lower = description.toLowerCase();
    return modificationKeywords.some(keyword => 
      lower.startsWith(keyword) || lower.includes(` ${keyword} `)
    );
  }

  private extractProjectName(description: string, aiResponse: string): string {
    // Extract from AI response first
    const nameMatch = aiResponse.match(/Project Name:\s*["']?([^"'\n\r]+)/i);
    if (nameMatch && nameMatch[1]) {
      return nameMatch[1].replace(/\*/g, '').trim();
    }

    // Context-aware naming (no more generic names)
    const lower = description.toLowerCase();
    
    if (lower.includes("drone")) {
      const names = ["SkyVenture", "AeroCommerce", "DroneHub Pro", "Flight Market", "Aerial Solutions"];
      return names[Math.floor(Math.random() * names.length)];
    }
    
    if (lower.includes("shoe")) {
      const names = ["StepForward", "SoleStyle", "FootwearCentral", "StrideStore", "ShoeSpace"];
      return names[Math.floor(Math.random() * names.length)];
    }
    
    if (lower.includes("cookie")) {
      const names = ["SweetSpot", "CookieHaven", "BakeHouse", "SugarCraft", "TreatStreet"];
      return names[Math.floor(Math.random() * names.length)];
    }

    // Fallback names
    const names = ["InnovatePro", "SmartSolution", "TechVenture", "DigitalCraft", "ModernApp"];
    return names[Math.floor(Math.random() * names.length)];
  }

  private detectProjectType(description: string): string {
    const lower = description.toLowerCase();
    if (lower.includes("sell") || lower.includes("store") || lower.includes("shop")) return "ecommerce";
    if (lower.includes("task") || lower.includes("manage") || lower.includes("todo")) return "productivity";
    if (lower.includes("social") || lower.includes("chat") || lower.includes("community")) return "social";
    return "application";
  }

  private getTechStack(appType: string): string[] {
    const base = ["React", "TypeScript", "Vite"];
    switch (appType) {
      case "ecommerce": return [...base, "Stripe", "Express", "MongoDB"];
      case "productivity": return [...base, "Zustand", "React DnD", "IndexedDB"];
      case "social": return [...base, "Socket.IO", "Express", "PostgreSQL"];
      default: return base;
    }
  }

  private getProjectFiles(appType: string): string[] {
    const base = ["package.json", "src/App.tsx", "index.html"];
    switch (appType) {
      case "ecommerce": return [...base, "src/components/ProductCard.tsx", "src/pages/Checkout.tsx"];
      case "productivity": return [...base, "src/components/TaskBoard.tsx", "src/stores/taskStore.ts"];
      case "social": return [...base, "src/components/ChatWindow.tsx", "src/services/socketService.ts"];
      default: return base;
    }
  }

  // Session management methods for API access
  getSession(sessionId: string): ProjectSession | undefined {
    return this.sessions.get(sessionId);
  }

  updateSessionPhase(sessionId: string, phase: ProjectSession['currentPhase']): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.currentPhase = phase;
      session.lastInteraction = new Date();
      this.sessions.set(sessionId, session);
      console.log(`📋 Updated ${session.projectName} to phase: ${phase}`);
    }
  }

  addCompletedStep(sessionId: string, step: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.completedSteps.push(step);
      session.lastInteraction = new Date();
      this.sessions.set(sessionId, session);
      console.log(`✅ ${session.projectName}: ${step}`);
    }
  }

  // Get session statistics (for debugging/monitoring)
  getSessionStats(): { totalSessions: number; activeProjects: string[] } {
    const activeProjects = Array.from(this.sessions.values())
      .filter(s => s.projectName)
      .map(s => s.projectName);
    
    return {
      totalSessions: this.sessions.size,
      activeProjects
    };
  }
}

export const applicationBuilderService = new ApplicationBuilderService();

