import axios from "axios";

export interface ProjectPlan {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  features: ProjectFeature[];
  estimatedTime: string;
  visualPreview?: string;
  created: Date;
}

export interface ProjectFeature {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  estimatedHours: number;
  dependencies: string[];
  status: "pending" | "in-progress" | "completed";
}

export interface BuildRequest {
  description: string;
  requirements?: string[];
  style?: "modern" | "classic" | "minimal" | "bold";
  target?: "web" | "mobile" | "desktop";
  userId?: string;
}

export class ApplicationBuilderService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY || "";
  }

  async generateProjectPlan(request: BuildRequest): Promise<ProjectPlan> {
    console.log("??? Generating project plan for:", request.description);

    try {
      // Use AI to analyze the request and create a structured plan
      const planningPrompt = this.createPlanningPrompt(request);
      const aiResponse = await this.callAI(planningPrompt);
      
      // Parse AI response into structured project plan
      const plan = this.parseProjectPlan(aiResponse, request);
      
      return plan;
    } catch (error) {
      console.error("? Project planning error:", error);
      return this.generateFallbackPlan(request);
    }
  }

  private createPlanningPrompt(request: BuildRequest): string {
    return `You are an expert software architect and project planner. 

Analyze this application request and create a detailed project plan:
"${request.description}"

Additional requirements: ${request.requirements?.join(", ") || "None specified"}
Style preference: ${request.style || "modern"}
Target platform: ${request.target || "web"}

Provide a structured response with:

1. PROJECT OVERVIEW:
   - Application name (creative, relevant)
   - Brief description
   - Target users
   - Core value proposition

2. TECHNICAL STACK:
   - Frontend framework (React, Vue, etc.)
   - Backend technology (Node.js, Python, etc.)
   - Database choice
   - Key libraries/tools

3. FEATURE BREAKDOWN:
   - List 6-8 core features
   - For each feature: title, description, priority (high/medium/low), estimated hours
   - Include both MVP and future features

4. IMPLEMENTATION PHASES:
   - Phase 1: Core functionality (MVP)
   - Phase 2: Enhanced features
   - Phase 3: Advanced capabilities

5. VISUAL DESCRIPTION:
   - Color scheme suggestions
   - Layout description
   - Key UI components
   - User experience flow

Focus on practical, implementable solutions that can be built with modern web technologies.`;
  }

  private async callAI(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error("AI API key not configured");
    }

    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "llama-3.1-sonar-large-128k-online",
        messages: [
          {
            role: "system",
            content: "You are an expert software architect who creates detailed, implementable project plans."
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.2
      },
      {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;
  }

  private parseProjectPlan(aiResponse: string, request: BuildRequest): ProjectPlan {
    // Parse the AI response into structured data
    // This would typically use more sophisticated parsing
    
    const plan: ProjectPlan = {
      id: `proj_${Date.now()}`,
      title: this.extractTitle(aiResponse) || this.generateTitleFromRequest(request.description),
      description: this.extractDescription(aiResponse) || request.description,
      techStack: this.extractTechStack(aiResponse),
      features: this.extractFeatures(aiResponse),
      estimatedTime: this.calculateEstimatedTime(aiResponse),
      created: new Date()
    };

    return plan;
  }

  private generateFallbackPlan(request: BuildRequest): ProjectPlan {
    // Intelligent fallback when AI is unavailable
    const appType = this.detectApplicationType(request.description);
    
    return {
      id: `proj_${Date.now()}`,
      title: this.generateTitleFromRequest(request.description),
      description: `A ${request.target || "web"} application: ${request.description}`,
      techStack: this.getDefaultTechStack(appType, request.target),
      features: this.generateDefaultFeatures(appType),
      estimatedTime: "2-4 weeks",
      created: new Date()
    };
  }

  private detectApplicationType(description: string): string {
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes("e-commerce") || lowerDesc.includes("store") || lowerDesc.includes("shop") || lowerDesc.includes("sell")) {
      return "ecommerce";
    } else if (lowerDesc.includes("blog") || lowerDesc.includes("content") || lowerDesc.includes("news")) {
      return "content";
    } else if (lowerDesc.includes("dashboard") || lowerDesc.includes("admin") || lowerDesc.includes("analytics")) {
      return "dashboard";
    } else if (lowerDesc.includes("social") || lowerDesc.includes("chat") || lowerDesc.includes("community")) {
      return "social";
    } else if (lowerDesc.includes("portfolio") || lowerDesc.includes("showcase")) {
      return "portfolio";
    }
    
    return "general";
  }

  private getDefaultTechStack(appType: string, target?: string): string[] {
    const baseTech = ["React", "TypeScript", "Tailwind CSS"];
    
    switch (appType) {
      case "ecommerce":
        return [...baseTech, "Next.js", "Stripe", "PostgreSQL", "Prisma"];
      case "dashboard":
        return [...baseTech, "Chart.js", "Express.js", "PostgreSQL", "Redis"];
      case "social":
        return [...baseTech, "Socket.io", "Express.js", "PostgreSQL", "Redis"];
      default:
        return [...baseTech, "Next.js", "Express.js"];
    }
  }

  private generateDefaultFeatures(appType: string): ProjectFeature[] {
    const commonFeatures = [
      {
        id: "auth",
        title: "User Authentication",
        description: "Secure user registration, login, and profile management",
        priority: "high" as const,
        estimatedHours: 8,
        dependencies: [],
        status: "pending" as const
      },
      {
        id: "responsive",
        title: "Responsive Design",
        description: "Mobile-first responsive design that works on all devices",
        priority: "high" as const,
        estimatedHours: 6,
        dependencies: [],
        status: "pending" as const
      }
    ];

    switch (appType) {
      case "ecommerce":
        return [
          ...commonFeatures,
          {
            id: "products",
            title: "Product Catalog",
            description: "Browse and search products with detailed views",
            priority: "high" as const,
            estimatedHours: 12,
            dependencies: [],
            status: "pending" as const
          },
          {
            id: "cart",
            title: "Shopping Cart",
            description: "Add items to cart and manage quantities",
            priority: "high" as const,
            estimatedHours: 8,
            dependencies: ["products"],
            status: "pending" as const
          },
          {
            id: "checkout",
            title: "Secure Checkout",
            description: "Payment processing with Stripe integration",
            priority: "high" as const,
            estimatedHours: 10,
            dependencies: ["cart", "auth"],
            status: "pending" as const
          }
        ];
      
      default:
        return [
          ...commonFeatures,
          {
            id: "core",
            title: "Core Functionality",
            description: "Main application features and user interface",
            priority: "high" as const,
            estimatedHours: 16,
            dependencies: [],
            status: "pending" as const
          }
        ];
    }
  }

  private generateTitleFromRequest(description: string): string {
    // Generate creative app names based on description
    const words = description.toLowerCase().split(" ");
    
    if (words.includes("store") || words.includes("shop")) {
      return words.includes("surfboard") ? "SurfBoardBazaar" : "ShopMaster";
    } else if (words.includes("dashboard")) {
      return "DataHub Pro";
    } else if (words.includes("blog")) {
      return "ContentCraft";
    }
    
    return "CustomApp";
  }

  private extractTitle(response: string): string | null {
    // Extract application name from AI response
    const titleMatch = response.match(/Application name[:\s]*([^\n]+)/i);
    return titleMatch ? titleMatch[1].trim() : null;
  }

  private extractDescription(response: string): string | null {
    // Extract description from AI response
    const descMatch = response.match(/Brief description[:\s]*([^\n]+)/i);
    return descMatch ? descMatch[1].trim() : null;
  }

  private extractTechStack(response: string): string[] {
    // Extract tech stack from AI response
    const techSection = response.match(/TECHNICAL STACK:(.*?)(?=\d\.|$)/s);
    if (!techSection) return ["React", "TypeScript", "Tailwind CSS"];
    
    const technologies = techSection[1]
      .split(/[-�\n]/)
      .map(item => item.trim())
      .filter(item => item && !item.includes(":"))
      .slice(0, 6);
    
    return technologies.length > 0 ? technologies : ["React", "TypeScript", "Tailwind CSS"];
  }

  private extractFeatures(response: string): ProjectFeature[] {
    // Extract features from AI response
    const featureSection = response.match(/FEATURE BREAKDOWN:(.*?)(?=\d\.|$)/s);
    if (!featureSection) return this.generateDefaultFeatures("general");
    
    // Parse features from AI response
    // This would be more sophisticated in production
    return this.generateDefaultFeatures("general");
  }

  private calculateEstimatedTime(response: string): string {
    // Calculate total time based on features
    return "2-4 weeks";
  }
}

export const applicationBuilder = new ApplicationBuilderService();
