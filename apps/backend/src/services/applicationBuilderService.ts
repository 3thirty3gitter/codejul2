export class ApplicationBuilderService {
  async generateProjectPlan(request: any) {
    // Generate a unique id for the plan
    const planId = `plan_${Date.now()}_${Math.floor(Math.random()*100000)}`;
    // Generate unique ids for each feature
    const features = Array.from({ length: 5 }).map((_, i) => ({
      id: `feature_${planId}_${i}_${Math.floor(Math.random()*100000)}`,
      title: `Feature ${i+1}`,
      description: `Description for feature ${i+1}`,
      priority: "medium",
      estimatedHours: i + 1,
      dependencies: [],
      status: "pending"
    }));
    return {
      id: planId,
      title: "Test Plan",
      description: request.description,
      techStack: ["Node.js", "Express"],
      features,
      estimatedTime: "1 week",
      created: new Date()
    }
  }
}
