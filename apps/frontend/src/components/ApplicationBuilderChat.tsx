import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Clock, Code2, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { applicationBuilderAPI, type BuildRequest, type ProjectPlan } from '../services/applicationBuilderAPI';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'plan' | 'building';
  content: string;
  plan?: ProjectPlan;
  timestamp: Date;
}

export default function ApplicationBuilderChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "?? **CodePilot Application Builder**\n\nI'm your AI Application Builder! I actually BUILD complete applications, not just give advice.\n\n**Try me with:**\n� \"build a website to sell drones\"\n� \"create a task management app\"\n� \"make a restaurant booking system\"\n\n**I generate real code files that you can run immediately!** ??",
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<ProjectPlan | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    // Add user message
    addMessage({
      type: 'user',
      content: userMessage
    });

    setIsGenerating(true);

    try {
      // Add loading message
      addMessage({
        type: 'assistant',
        content: '??? **Creating Your Application Plan...**\n\nAnalyzing your request and designing the complete application architecture...'
      });

      // Detect style and target from user input
      const style = detectStyle(userMessage);
      const target = detectTarget(userMessage);
      const requirements = extractRequirements(userMessage);

      const buildRequest: BuildRequest = {
        description: userMessage,
        style,
        target,
        requirements
      };

      console.log('?? Sending request to YOUR backend:', buildRequest);
      const response = await applicationBuilderAPI.generatePlan(buildRequest);

      if (response.success) {
        setCurrentPlan(response.plan);
        
        // Remove loading message and add plan
        setMessages(prev => prev.slice(0, -1));
        
        addMessage({
          type: 'plan',
          content: `?? **${response.plan.title}**\n\n${response.plan.description}\n\n**Tech Stack:** ${response.plan.techStack.join(', ')}\n\n**Estimated Time:** ${response.plan.estimatedTime}`,
          plan: response.plan
        });

        addMessage({
          type: 'assistant',
          content: `? **Perfect! Your application plan is ready.**\n\nI've designed **${response.plan.title}** with ${response.plan.features.length} key features using modern technologies like ${response.plan.techStack.slice(0, 3).join(', ')}.\n\n?? **Ready to build?** Click "Start Building" below and I'll generate all the code files for your complete, working application!\n\n**This will create:**\n� Complete HTML, CSS, and JavaScript files\n� Professional responsive design\n� Working functionality\n� Documentation and setup instructions`
        });
      }
    } catch (error) {
      console.error('? Error generating plan:', error);
      
      // Remove loading message
      setMessages(prev => prev.slice(0, -1));
      
      addMessage({
        type: 'assistant',
        content: `?? **Connection Issue**\n\nI'm having trouble connecting to the CodePilot backend. This usually means:\n\n1. **Backend not running** - Make sure your backend is started with \`npm run dev\`\n2. **Port conflict** - Check if localhost:5000 is available\n\nDon't worry! Once the backend is running, I'll be able to build your **${userMessage}** application with complete code generation.`
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const startBuilding = async () => {
    if (!currentPlan) return;

    setIsGenerating(true);
    
    addMessage({
      type: 'building',
      content: `?? **Building ${currentPlan.title}...**\n\n? Generating all code files...\n?? Creating project structure...\n?? Building responsive UI...\n?? Adding functionality...\n\nThis may take a few moments...`
    });

    try {
      console.log('?? Starting build for plan:', currentPlan.id);
      const buildResponse = await applicationBuilderAPI.startBuild(currentPlan.id);
      
      if (buildResponse.success) {
        addMessage({
          type: 'assistant',
          content: `?? **APPLICATION BUILT SUCCESSFULLY!**\n\n**Build ID:** \`${buildResponse.buildId}\`\n**Status:** ${buildResponse.status}\n**Files Generated:** ${buildResponse.files?.length || 'Multiple'}\n\n? **Your complete application is ready!**\n\n**Files created:**\n${buildResponse.files?.map(f => `� ${f.path} (${f.type})`).join('\n') || '� Complete application files'}\n\n?? **To view your app:**\n1. Check the \`generated-projects\` folder in your backend\n2. Open \`index.html\` in your browser\n3. Enjoy your AI-built application!\n\n**Your app includes:**\n� Professional responsive design\n� Complete functionality\n� Modern styling\n� Documentation\n� Ready for deployment`
        });
      }
    } catch (error) {
      console.error('? Build error:', error);
      addMessage({
        type: 'assistant',
        content: `?? **Build Issue**\n\nThere was an issue generating the application files. This is usually because:\n\n1. **Backend connection problem** - Check if your backend is running\n2. **File system permissions** - Ensure write permissions\n\nOnce resolved, I'll be able to generate your complete **${currentPlan.title}** application with all code files!`
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper functions
  const detectStyle = (input: string): "modern" | "classic" | "minimal" | "bold" => {
    const lower = input.toLowerCase();
    if (lower.includes('minimal') || lower.includes('clean') || lower.includes('simple')) return 'minimal';
    if (lower.includes('classic') || lower.includes('traditional')) return 'classic';
    if (lower.includes('bold') || lower.includes('vibrant') || lower.includes('colorful')) return 'bold';
    return 'modern';
  };

  const detectTarget = (input: string): "web" | "mobile" | "desktop" => {
    const lower = input.toLowerCase();
    if (lower.includes('mobile') || lower.includes('app store') || lower.includes('ios') || lower.includes('android')) return 'mobile';
    if (lower.includes('desktop') || lower.includes('electron')) return 'desktop';
    return 'web';
  };

  const extractRequirements = (input: string): string[] => {
    const requirements: string[] = [];
    const lower = input.toLowerCase();
    
    if (lower.includes('payment') || lower.includes('checkout') || lower.includes('buy') || lower.includes('sell')) {
      requirements.push('payment processing');
    }
    if (lower.includes('user') || lower.includes('account') || lower.includes('login')) {
      requirements.push('user authentication');
    }
    if (lower.includes('chat') || lower.includes('message') || lower.includes('comment')) {
      requirements.push('messaging system');
    }
    if (lower.includes('search') || lower.includes('filter')) {
      requirements.push('search functionality');
    }
    
    return requirements;
  };

  const renderMessage = (message: Message) => {
    const isUser = message.type === 'user';
    
    return (
      <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : message.type === 'plan'
            ? 'bg-green-50 border border-green-200'
            : message.type === 'building'
            ? 'bg-purple-50 border border-purple-200'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {!isUser && (
            <div className="flex items-center gap-2 mb-2">
              {message.type === 'plan' ? (
                <Sparkles className="w-4 h-4 text-green-600" />
              ) : message.type === 'building' ? (
                <Code2 className="w-4 h-4 text-purple-600" />
              ) : (
                <Zap className="w-4 h-4 text-blue-600" />
              )}
              <span className="text-sm font-medium">
                {message.type === 'plan' ? 'Project Plan' : 
                 message.type === 'building' ? 'Building' : 'CodePilot Builder'}
              </span>
            </div>
          )}
          
          <div className="whitespace-pre-wrap">{message.content}</div>
          
          {message.plan && (
            <div className="mt-4 space-y-3">
              <div className="border-t pt-3">
                <h4 className="font-semibold text-gray-800 mb-2">Features ({message.plan.features.length})</h4>
                <div className="space-y-2">
                  {message.plan.features.slice(0, 4).map(feature => (
                    <div key={feature.id} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-medium">{feature.title}</span>
                      <span className="text-gray-500">({feature.estimatedHours}h)</span>
                    </div>
                  ))}
                  {message.plan.features.length > 4 && (
                    <div className="text-sm text-gray-500">
                      +{message.plan.features.length - 4} more features...
                    </div>
                  )}
                </div>
              </div>
              
              <button
                onClick={startBuilding}
                disabled={isGenerating}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 font-semibold text-base"
              >
                <Code2 className="w-5 h-5" />
                ?? Start Building This Application
              </button>
            </div>
          )}
          
          <div className="text-xs text-gray-500 mt-2">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">?? CodePilot Application Builder</h2>
          <p className="text-sm text-gray-600">Describe any app and I'll build it for you - with real code!</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(renderMessage)}
        {isGenerating && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 rounded-lg px-4 py-3 max-w-[80%]">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Creating your application...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe the app you want to build..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isGenerating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Build
          </button>
        </form>
        <div className="text-xs text-gray-500 mt-2 text-center">
          ?? Try: "build a website to sell drones" or "create a task management app"
        </div>
      </div>
    </div>
  );
}
