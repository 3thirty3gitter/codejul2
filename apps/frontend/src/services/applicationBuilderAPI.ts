class ApplicationBuilderAPI {
  private baseURL = 'http://localhost:5000/api/application-builder';
  private currentSessionId: string | null = null;

  async generatePlan(description: string) {
    try {
      const body = {
        description,
        ...(this.currentSessionId && { sessionId: this.currentSessionId })
      };

      console.log(`📝 Frontend request: ${description}${this.currentSessionId ? ` (Session: ${this.currentSessionId})` : ' (New Session)'}`);

      const response = await fetch(`${this.baseURL}/generate-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Store session ID for future requests (Replit-style persistence)
      this.updateSessionId(result);

      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  private updateSessionId(response: any) {
    if (response.sessionId) {
      this.currentSessionId = response.sessionId;
      console.log(`🧠 Session stored for persistent context: ${this.currentSessionId}`);
    }
  }

  // Get current session ID
  getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }

  // Reset session (for starting completely new projects)
  resetSession(): void {
    console.log(`🔄 Session reset: ${this.currentSessionId} → null`);
    this.currentSessionId = null;
  }

  // Get session details
  async getSessionDetails(sessionId?: string): Promise<any> {
    const id = sessionId || this.currentSessionId;
    if (!id) {
      throw new Error('No session ID available');
    }

    const response = await fetch(`${this.baseURL}/session/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to get session details: ${response.status}`);
    }

    return response.json();
  }
}

export const applicationBuilderAPI = new ApplicationBuilderAPI();
