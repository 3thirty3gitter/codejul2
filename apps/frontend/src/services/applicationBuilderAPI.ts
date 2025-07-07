const API_BASE_URL = 'http://localhost:5000';

interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApplicationBuilderAPI {
  private async makeRequest<T = any>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<T> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      const config: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      // Only add body for non-GET requests and ensure proper JSON stringification
      if (method !== 'GET' && data !== undefined) {
        if (typeof data === 'string') {
          // If data is already a string, wrap it in an object
          config.body = JSON.stringify({ content: data });
        } else {
          // Ensure the data is properly serialized
          config.body = JSON.stringify(data);
        }
      }

      console.log(`?? Making ${method} request to:`, url);
      console.log('?? Request body:', config.body);

      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`? HTTP ${response.status}:`, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      console.log('?? Response received:', responseData);
      
      return responseData;
    } catch (error) {
      console.error('? API Request failed:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend server. Is it running on port 5000?');
      }
      throw error;
    }
  }

  async generatePlan(description: string) {
    if (!description || typeof description !== 'string') {
      throw new Error('Description must be a non-empty string');
    }

    console.log('?? Generating plan for:', description);
    
    return this.makeRequest('/api/application-builder/generate-plan', 'POST', {
      description: description.trim()
    });
  }

  async buildProject(planId: string) {
    if (!planId || typeof planId !== 'string') {
      throw new Error('Plan ID must be a non-empty string');
    }

    console.log('?? Building project for plan:', planId);
    
    return this.makeRequest('/api/application-builder/build', 'POST', {
      planId: planId.trim()
    });
  }

  async getProject(projectId: string) {
    if (!projectId || typeof projectId !== 'string') {
      throw new Error('Project ID must be a non-empty string');
    }

    return this.makeRequest(`/api/application-builder/project/${projectId}`);
  }

  async listProjects() {
    return this.makeRequest('/api/application-builder/projects');
  }
}

export const applicationBuilderAPI = new ApplicationBuilderAPI();
