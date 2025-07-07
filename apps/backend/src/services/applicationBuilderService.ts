import { v4 as uuidv4 } from 'uuid';
import { AITeam } from './AITeam';

interface Plan {
  id: string;
  name: string;
  description: string;
  type: string;
  techStack: string[];
  files: string[];
  created: Date;
}

interface BuildResult {
  projectId: string;
  files: Array<{
    name: string;
    path: string;
    content: string;
    type: string;
  }>;
}

class ApplicationBuilderService {
  private plans = new Map<string, Plan>();
  private projects = new Map<string, BuildResult>();
  private aiTeam: AITeam;

  constructor() {
    this.aiTeam = new AITeam();
    console.log('ApplicationBuilderService initialized with AITeam integration');
  }

  async generatePlan(description: string): Promise<Plan> {
    try {
      console.log('USING AI TEAM FOR PLAN GENERATION');
      
      const planPrompt = 'Analyze this project: ' + description + '. Create a professional plan.';
      const aiResponse = await this.aiTeam.routeQuery(planPrompt, 'Elite Coder Agent');
      console.log('AI Response received for plan generation');
      
      const plan: Plan = {
        id: uuidv4(),
        name: this.extractAIProjectName(aiResponse, description),
        description: description.trim(),
        type: this.detectProjectType(description),
        techStack: this.getTechStack(this.detectProjectType(description)),
        files: this.getProjectFiles(this.detectProjectType(description)),
        created: new Date()
      };

      this.plans.set(plan.id, plan);
      console.log('AI-enhanced plan created:', plan.name);
      return plan;
    } catch (error) {
      console.error('AI plan generation failed:', error);
      return this.generateFallbackPlan(description);
    }
  }

  async buildProject(planId: string): Promise<BuildResult> {
    try {
      const plan = this.plans.get(planId);
      if (!plan) {
        throw new Error('Plan not found: ' + planId);
      }

      console.log('USING AI TEAM FOR CODE GENERATION');
      const files = await this.generateAIFiles(plan);

      const result: BuildResult = {
        projectId: 'proj_' + Date.now(),
        files
      };

      this.projects.set(result.projectId, result);
      console.log('AI-powered build completed:', result.projectId);
      return result;
    } catch (error) {
      console.error('AI build failed:', error);
      throw error;
    }
  }

  private async generateAIFiles(plan: Plan) {
    const files = [];
    try {
      const packageContent = await this.aiTeam.routeQuery('Generate package.json for ' + plan.name, 'System Architect Agent');
      files.push({
        name: 'package.json',
        path: 'package.json',
        content: this.cleanResponse(packageContent),
        type: 'json'
      });

      const appContent = await this.aiTeam.routeQuery('Create React component for ' + plan.name, 'Elite Coder Agent');
      files.push({
        name: 'App.tsx',
        path: 'src/App.tsx',
        content: this.cleanResponse(appContent),
        type: 'tsx'
      });

      return files;
    } catch (error) {
      console.error('AI file generation failed:', error);
      return this.generateBasicFiles(plan);
    }
  }

  private cleanResponse(response: string): string {
    let cleaned = response;
    const codeBlockMarker = '```';
    if (cleaned.indexOf(codeBlockMarker) !== -1) {
      const parts = cleaned.split(codeBlockMarker);
      if (parts.length >= 3) {
        cleaned = parts[1];
      }
    }
    return cleaned.trim();
  }

  private extractAIProjectName(aiResponse: string, description: string): string {
    // Try to extract project name from AI response
    const namePatterns = [
      /project\s+named?\s+["']([^"']+)["']/i,
      /call\s+it\s+["']([^"']+)["']/i,
      /name:\s*["']([^"']+)["']/i,
      /title:\s*["']([^"']+)["']/i
    ];
    
    for (const pattern of namePatterns) {
      const match = aiResponse.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    // Fallback to intelligent naming based on description
    return this.generateIntelligentName(description);
  }
  private generateIntelligentName(description: string): string {
    const lower = description.toLowerCase();
    if (lower.indexOf('task') !== -1) return 'TaskMaster Pro';
    if (lower.indexOf('crypto') !== -1) return 'CryptoTracker Pro';
    if (lower.indexOf('drone') !== -1) return 'DroneStore Pro';
    return 'SmartApp Pro';
  }

  private detectProjectType(description: string): string {
    const lower = description.toLowerCase();
    if (lower.indexOf('task') !== -1 || lower.indexOf('manage') !== -1) return 'productivity';
    if (lower.indexOf('crypto') !== -1) return 'dashboard';
    if (lower.indexOf('store') !== -1) return 'ecommerce';
    return 'application';
  }

  private getTechStack(appType: string): string[] {
    const base = ['React', 'TypeScript', 'Tailwind CSS', 'Vite'];
    switch (appType) {
      case 'productivity': return base.concat(['React DnD', 'Zustand']);
      case 'dashboard': return base.concat(['Chart.js', 'D3.js']);
      case 'ecommerce': return base.concat(['Stripe', 'Express']);
      default: return base;
    }
  }

  private getProjectFiles(appType: string): string[] {
    return ['package.json', 'src/App.tsx', 'index.html'];
  }

  private generateFallbackPlan(description: string): Plan {
    return {
      id: uuidv4(),
      name: this.extractAIProjectName(aiResponse, description),
      description: description.trim(),
      type: this.detectProjectType(description),
      techStack: this.getTechStack(this.detectProjectType(description)),
      files: this.getProjectFiles(this.detectProjectType(description)),
      created: new Date()
    };
  }

  private generateBasicFiles(plan: Plan) {
    return [{
      name: 'package.json',
      path: 'package.json',
      content: JSON.stringify({ name: plan.name, version: '1.0.0' }, null, 2),
      type: 'json'
    }];
  }

  async getProject(projectId: string): Promise<BuildResult | null> {
    return this.projects.get(projectId) || null;
  }

  async listProjects(): Promise<BuildResult[]> {
    return Array.from(this.projects.values());
  }
}

export const applicationBuilderService = new ApplicationBuilderService();


