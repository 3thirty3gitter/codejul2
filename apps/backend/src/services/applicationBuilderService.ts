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

interface BuildResult {
  projectId: string;
  files: Array<{name: string; path: string; content: string; type: string;}>;
}

class ApplicationBuilderService {
  private plans = new Map<string, Plan>();
  private projects = new Map<string, BuildResult>();
  private aiTeam: AITeam;

  constructor() {
    this.aiTeam = new AITeam();
    console.log("ApplicationBuilderService initialized");
  }

  async generatePlan(description: string): Promise<Plan> {
    try {
      console.log("USING AI TEAM FOR PLAN GENERATION");
      const aiResponse = await this.aiTeam.routeQuery("Analyze: " + description, "Elite Coder Agent");
      
      const plan: Plan = {
        id: uuidv4(),
        name: this.generateName(description),
        description: description.trim(),
        type: this.detectType(description),
        techStack: ["React", "TypeScript", "Tailwind CSS"],
        files: ["package.json", "src/App.tsx"],
        created: new Date()
      };

      this.plans.set(plan.id, plan);
      return plan;
    } catch (error) {
      console.error("Plan generation failed:", error);
      return this.createFallback(description);
    }
  }

  async buildProject(planId: string): Promise<BuildResult> {
    const plan = this.plans.get(planId);
    if (!plan) throw new Error("Plan not found");
    
    const result: BuildResult = {
      projectId: "proj_" + Date.now(),
      files: [{name: "package.json", path: "package.json", content: "{}", type: "json"}]
    };
    
    this.projects.set(result.projectId, result);
    return result;
  }

  private generateName(desc: string): string {
    if (desc.toLowerCase().includes("task")) return "TaskMaster Pro";
    if (desc.toLowerCase().includes("crypto")) return "CryptoTracker Pro";
    return "SmartApp Pro";
  }

  private detectType(desc: string): string {
    if (desc.toLowerCase().includes("task")) return "productivity";
    if (desc.toLowerCase().includes("crypto")) return "dashboard";
    return "application";
  }

  private createFallback(description: string): Plan {
    return {
      id: uuidv4(),
      name: this.generateName(description),
      description: description.trim(),
      type: this.detectType(description),
      techStack: ["React", "TypeScript"],
      files: ["package.json"],
      created: new Date()
    };
  }

  async getProject(projectId: string) { return this.projects.get(projectId) || null; }
  async listProjects() { return Array.from(this.projects.values()); }
}

export const applicationBuilderService = new ApplicationBuilderService();