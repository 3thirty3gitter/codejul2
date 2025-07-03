import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, User, FileText, Image, Link, Brain, Code, Search, Zap, Target, Shield, Play, Upload, Mic, MicOff } from 'lucide-react';

// Multi-Agent System Architecture
interface Agent {
  id: string;
  name: string;
  icon: React.ComponentType;
  specialization: string;
  color: string;
  systemPrompt: string;
  capabilities: string[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  agent?: Agent;
  attachments?: Attachment[];
  thinking?: string;
  codeBlocks?: CodeBlock[];
  confidence?: number;
  context?: MessageContext;
}

interface Attachment {
  id: string;
  name: string;
  type: 'file' | 'image' | 'url' | 'code';
  content?: string;
  url?: string;
  size?: number;
}

interface CodeBlock {
  id: string;
  language: string;
  code: string;
  filename?: string;
  editable: boolean;
}

interface MessageContext {
  projectFiles?: string[];
  currentFile?: string;
  technologies?: string[];
  complexity?: 'simple' | 'moderate' | 'complex';
  userIntent?: string;
}

interface ConversationMemory {
  userPreferences: {
    codingStyle: string;
    preferredLanguages: string[];
    complexity: string;
    communicationStyle: string;
  };
  projectContext: {
    currentProject: string;
    technologies: string[];
    recentFiles: string[];
    goals: string[];
  };
  conversationSummary: string;
  keyTopics: string[];
  learnedPatterns: {
    commonQuestions: string[];
    preferredSolutions: string[];
    avoidedApproaches: string[];
  };
}

export default function AIChat() {
  // Define our specialized AI agents (like Replit but better)
  const agents: Agent[] = [
    {
      id: 'coordinator',
      name: 'Master Coordinator',
      icon: Brain,
      specialization: 'Task routing, context management, learning coordination',
      color: 'blue',
      systemPrompt: `You are the Master Coordinator AI that orchestrates between specialized agents. You:
- Route complex queries to the most appropriate specialist
- Maintain conversation context and memory
- Learn from user interactions and preferences
- Synthesize responses from multiple agents
- Ensure consistency and quality across all interactions`,
      capabilities: ['Task Routing', 'Context Management', 'Learning', 'Quality Control']
    },
    {
      id: 'coder',
      name: 'Elite Coder',
      icon: Code,
      specialization: 'Full-stack development, debugging, optimization, code generation',
      color: 'green',
      systemPrompt: `You are an elite full-stack developer AI. You excel at:
- Writing production-ready code in any language/framework
- Debugging complex issues with systematic approaches
- Optimizing performance and following best practices
- Generating complete applications from descriptions
- Code reviews and refactoring with security focus`,
      capabilities: ['Code Generation', 'Debugging', 'Optimization', 'Full-Stack Dev', 'Security']
    },
    {
      id: 'architect',
      name: 'System Architect',
      icon: Target,
      specialization: 'System design, architecture planning, technology selection',
      color: 'purple',
      systemPrompt: `You are a senior system architect AI. You specialize in:
- Designing scalable, maintainable architectures
- Selecting optimal technology stacks
- Breaking down complex projects into phases
- Creating technical specifications and roadmaps
- Identifying and mitigating architectural risks`,
      capabilities: ['System Design', 'Tech Stack Selection', 'Project Planning', 'Risk Assessment']
    },
    {
      id: 'reviewer',
      name: 'Code Guardian',
      icon: Shield,
      specialization: 'Code review, security, performance, testing strategies',
      color: 'red',
      systemPrompt: `You are a code review and security expert AI. You focus on:
- Comprehensive code quality reviews
- Security vulnerability detection and fixes
- Performance optimization recommendations
- Testing strategy development
- Documentation and maintainability`,
      capabilities: ['Security Analysis', 'Performance Review', 'Testing Strategy', 'Quality Assurance']
    },
    {
      id: 'researcher',
      name: 'Tech Researcher',
      icon: Search,
      specialization: 'Technology research, documentation, latest trends',
      color: 'orange',
      systemPrompt: `You are a technology research specialist AI. You excel at:
- Researching latest technologies and best practices
- Finding relevant documentation and examples
- Comparing different solutions and trade-offs
- Staying current with industry trends
- Providing detailed technical explanations`,
      capabilities: ['Tech Research', 'Documentation', 'Trend Analysis', 'Solution Comparison']
    },
    {
      id: 'accelerator',
      name: 'Speed Demon',
      icon: Zap,
      specialization: 'Rapid prototyping, quick solutions, minimal viable products',
      color: 'yellow',
      systemPrompt: `You are a rapid development specialist AI. You focus on:
- Creating quick prototypes and MVPs
- Providing fast, working solutions
- Simplifying complex requirements
- Getting users to working code ASAP
- Iterative development approaches`,
      capabilities: ['Rapid Prototyping', 'MVP Development', 'Quick Solutions', 'Iterative Design']
    }
  ];

  // State management
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showAgentPanel, setShowAgentPanel] = useState(false);
  const [conversationMemory, setConversationMemory] = useState<ConversationMemory>({
    userPreferences: {
      codingStyle: 'clean',
      preferredLanguages: ['TypeScript', 'React'],
      complexity: 'moderate',
      communicationStyle: 'detailed'
    },
    projectContext: {
      currentProject: 'CodePilot AI Workspace',
      technologies: ['React', 'TypeScript', 'Tailwind'],
      recentFiles: ['WorkspaceLayout.tsx', 'AIChat.tsx'],
      goals: ['Build AI-powered development environment']
    },
    conversationSummary: '',
    keyTopics: [],
    learnedPatterns: {
      commonQuestions: [],
      preferredSolutions: [],
      avoidedApproaches: []
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with advanced welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `?? **Welcome to CodePilot AI - The World's Most Advanced Development Assistant!**

I'm powered by a **multi-agent architecture** with specialized AI experts:

?? **Master Coordinator** - Routes tasks and manages context
?? **Elite Coder** - Writes production-ready code in any language  
??? **System Architect** - Designs scalable architectures
??? **Code Guardian** - Reviews security and performance
?? **Tech Researcher** - Finds latest solutions and docs
? **Speed Demon** - Rapid prototyping and MVPs

**?? Advanced Capabilities:**
• **Multi-modal Input** - Text, files, images, URLs, voice
• **Context Learning** - I remember your preferences and project context
• **Progressive Enhancement** - I get smarter with each interaction
• **Real-time Collaboration** - Live code editing and debugging
• **Project Memory** - Full understanding of your codebase

**What would you like to build today?** I can help with anything from quick fixes to complex system architectures!`,
      timestamp: new Date(),
      agent: agents[0], // Coordinator
      confidence: 100
    };
    setMessages([welcomeMessage]);
  }, []);

  // Intelligent agent routing (like Replit but smarter)
  const routeToAgent = (message: string, context?: MessageContext): Agent => {
    const lowerMessage = message.toLowerCase();
    
    // Complex routing logic based on content analysis
    if (lowerMessage.includes('quick') || lowerMessage.includes('fast') || lowerMessage.includes('prototype')) {
      return agents.find(a => a.id === 'accelerator')!;
    }
    
    if (lowerMessage.includes('security') || lowerMessage.includes('review') || lowerMessage.includes('optimize')) {
      return agents.find(a => a.id === 'reviewer')!;
    }
    
    if (lowerMessage.includes('architecture') || lowerMessage.includes('design') || lowerMessage.includes('plan') || lowerMessage.includes('system')) {
      return agents.find(a => a.id === 'architect')!;
    }
    
    if (lowerMessage.includes('research') || lowerMessage.includes('compare') || lowerMessage.includes('latest') || lowerMessage.includes('best')) {
      return agents.find(a => a.id === 'researcher')!;
    }
    
    if (lowerMessage.includes('code') || lowerMessage.includes('function') || lowerMessage.includes('debug') || lowerMessage.includes('error')) {
      return agents.find(a => a.id === 'coder')!;
    }
    
    // Default to coordinator for general queries
    return agents[0];
  };

  // Advanced message processing
  const processMessage = async (message: string): Promise<ChatMessage> => {
    const selectedAgent = routeToAgent(message);
    setActiveAgent(selectedAgent);

    // Simulate AI processing with realistic responses
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const responses = {
      coordinator: `?? **Analyzing your request...**

I've routed this to our **${selectedAgent.name}** specialist. Based on your message about "${message.slice(0, 50)}...", this appears to be a ${selectedAgent.specialization} task.

**Context Analysis:**
• Project: ${conversationMemory.projectContext.currentProject}
• Technologies: ${conversationMemory.projectContext.technologies.join(', ')}
• Complexity: Moderate to High
• User Preference: ${conversationMemory.userPreferences.communicationStyle} explanations

I'm coordinating with the specialist team to provide you with the best solution. One moment...`,

      coder: `?? **Elite Coder here!** I'm analyzing your code request...

Based on your message, I can help you with:
• **Code Generation** - Creating production-ready components
• **Debugging** - Systematic issue resolution  
• **Optimization** - Performance improvements
• **Best Practices** - Clean, maintainable code

I see you're working with **${conversationMemory.projectContext.technologies.join(', ')}**. I'll provide solutions that match your preferred **${conversationMemory.userPreferences.codingStyle}** coding style.

**Would you like me to:**
1. Generate complete code solutions
2. Debug existing code issues  
3. Optimize performance bottlenecks
4. Review and improve code quality

Please share more details or paste your code, and I'll provide expert assistance!`,

      architect: `??? **System Architect reporting!** 

I specialize in designing scalable, maintainable architectures. For your request about "${message.slice(0, 40)}...", I can help with:

**Architecture Planning:**
• System design and component relationships
• Technology stack recommendations
• Scalability and performance considerations  
• Security and compliance requirements

**Current Project Analysis:**
• Project: ${conversationMemory.projectContext.currentProject}
• Tech Stack: ${conversationMemory.projectContext.technologies.join(', ')}
• Goals: ${conversationMemory.projectContext.goals.join(', ')}

**Next Steps:**
1. Requirements gathering and analysis
2. Architecture design and documentation
3. Implementation roadmap
4. Risk assessment and mitigation

What specific architectural challenge can I help you solve?`,

      reviewer: `??? **Code Guardian activated!** 

I'm your security and quality specialist. I can help with:

**Security Analysis:**
• Vulnerability scanning and fixes
• Authentication and authorization
• Data protection and encryption
• Secure coding practices

**Performance Review:**
• Code optimization opportunities
• Performance bottleneck identification  
• Scalability improvements
• Resource usage optimization

**Quality Assurance:**
• Code review and standards compliance
• Testing strategy development
• Documentation improvements
• Maintainability enhancements

Share your code and I'll provide a comprehensive security and performance review!`,

      researcher: `?? **Tech Researcher ready!**

I can help you discover the best solutions for your needs:

**Research Services:**
• Latest technology trends and comparisons
• Framework and library recommendations
• Best practices and industry standards
• Documentation and tutorial discovery

**Current Query Analysis:**
Your request about "${message.slice(0, 40)}..." suggests you need research on modern development approaches.

**I'll investigate:**
1. Latest solutions and alternatives
2. Community recommendations and reviews
3. Performance comparisons and benchmarks
4. Implementation examples and tutorials

What specific technology or approach would you like me to research?`,

      accelerator: `? **Speed Demon here!** 

Ready for rapid development! I specialize in:

**Quick Solutions:**
• MVP and prototype development
• Fast working implementations
• Minimal complexity approaches
• Rapid iteration cycles

**Current Sprint Analysis:**
• Target: Quick solution for "${message.slice(0, 30)}..."
• Technologies: ${conversationMemory.projectContext.technologies.join(', ')}
• Approach: Minimal viable solution first

**Delivery Timeline:**
1. **5 minutes:** Basic working solution
2. **15 minutes:** Enhanced with key features  
3. **30 minutes:** Production-ready code
4. **Follow-up:** Iterative improvements

Let's get you a working solution FAST! What's the core functionality you need?`
    };

    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: responses[selectedAgent.id] || responses.coordinator,
      timestamp: new Date(),
      agent: selectedAgent,
      confidence: 85 + Math.random() * 15,
      context: {
        complexity: 'moderate',
        userIntent: message,
        currentFile: 'AIChat.tsx',
        technologies: conversationMemory.projectContext.technologies
      }
    };
  };

  // Handle message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachments([]);
    setIsLoading(true);

    try {
      const aiResponse = await processMessage(userMessage.content);
      setMessages(prev => [...prev, aiResponse]);
      
      // Update conversation memory (learning)
      setConversationMemory(prev => ({
        ...prev,
        keyTopics: [...new Set([...prev.keyTopics, userMessage.content.split(' ')[0]])].slice(-10),
        conversationSummary: `User working on ${prev.projectContext.currentProject} with ${prev.projectContext.technologies.join(', ')}`
      }));
      
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '? I encountered an issue processing your request. Please try again or contact support.',
        timestamp: new Date(),
        agent: agents[0]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setActiveAgent(null);
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const attachment: Attachment = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        size: file.size
      };
      
      // Read file content
      const reader = new FileReader();
      reader.onload = (e) => {
        attachment.content = e.target?.result as string;
        setAttachments(prev => [...prev, attachment]);
      };
      reader.readAsText(file);
    });
  };

  // Handle voice recording
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording logic would go here
      setTimeout(() => {
        setIsRecording(false);
        setInput('Voice input: "Create a React component for user authentication"');
      }, 3000);
    }
  };

  // Get agent styling
  const getAgentStyling = (agent?: Agent) => {
    if (!agent) return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
    
    const styles = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
      red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
      yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200' }
    };
    
    return styles[agent.color] || styles.blue;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CodePilot AI
            </h2>
            <p className="text-xs text-gray-500">Multi-Agent • Learning • Context-Aware</p>
          </div>
          {activeAgent && (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getAgentStyling(activeAgent).bg} ${getAgentStyling(activeAgent).border} border`}>
              <activeAgent.icon className={`w-4 h-4 ${getAgentStyling(activeAgent).text}`} />
              <span className={`text-sm font-medium ${getAgentStyling(activeAgent).text}`}>
                {activeAgent.name} Active
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAgentPanel(!showAgentPanel)}
            className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Brain className="w-4 h-4" />
            <span className="text-sm">Agents</span>
          </button>
          
          <div className="text-xs text-gray-500">
            Memory: {conversationMemory.keyTopics.slice(0, 3).join(', ')}
          </div>
          
          <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg text-sm transition-colors">
            Clear
          </button>
        </div>
      </div>

      {/* Agent Panel */}
      {showAgentPanel && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {agents.map(agent => (
              <div key={agent.id} className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all ${getAgentStyling(agent).bg} ${getAgentStyling(agent).border}`}>
                <div className="flex items-center gap-2 mb-2">
                  <agent.icon className={`w-5 h-5 ${getAgentStyling(agent).text}`} />
                  <span className={`font-semibold text-sm ${getAgentStyling(agent).text}`}>{agent.name}</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{agent.specialization}</p>
                <div className="flex flex-wrap gap-1">
                  {agent.capabilities.slice(0, 2).map(cap => (
                    <span key={cap} className="px-2 py-1 bg-white rounded text-xs font-medium">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              message.role === 'user' 
                ? 'bg-blue-500 text-white' 
                : message.agent 
                  ? `${getAgentStyling(message.agent).bg} ${getAgentStyling(message.agent).text}`
                  : 'bg-gray-100 text-gray-600'
            }`}>
              {message.role === 'user' ? (
                <User className="w-5 h-5" />
              ) : message.agent ? (
                <message.agent.icon className="w-5 h-5" />
              ) : (
                <Bot className="w-5 h-5" />
              )}
            </div>

            {/* Message Content */}
            <div className={`flex-1 max-w-3xl ${message.role === 'user' ? 'text-right' : ''}`}>
              {/* Message Header */}
              {message.agent && message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-sm font-semibold ${getAgentStyling(message.agent).text}`}>
                    {message.agent.name}
                  </span>
                  {message.confidence && (
                    <span className="text-xs text-gray-500">
                      Confidence: {Math.round(message.confidence)}%
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              )}

              {/* Message Bubble */}
              <div className={`rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white ml-12'
                  : message.agent
                    ? `${getAgentStyling(message.agent).bg} border ${getAgentStyling(message.agent).border}`
                    : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className="prose prose-sm max-w-none">
                  {message.content.split('\n').map((line, i) => (
                    <p key={i} className={`${i === 0 ? 'mt-0' : ''} ${message.role === 'user' ? 'text-white' : ''}`}>
                      {line}
                    </p>
                  ))}
                </div>

                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.attachments.map(attachment => (
                      <div key={attachment.id} className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg border">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">{attachment.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Message Actions */}
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <button className="hover:text-blue-600">?? Helpful</button>
                  <button className="hover:text-red-600">?? Not helpful</button>
                  <button className="hover:text-green-600">?? Follow up</button>
                  <button className="hover:text-purple-600">?? Regenerate</button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading State */}
        {isLoading && (
          <div className="flex gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              activeAgent ? `${getAgentStyling(activeAgent).bg} ${getAgentStyling(activeAgent).text}` : 'bg-gray-100'
            }`}>
              {activeAgent ? <activeAgent.icon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-gray-600">
                  {activeAgent ? activeAgent.name : 'AI'} is thinking...
                </span>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    Processing with {activeAgent ? activeAgent.specialization : 'AI intelligence'}...
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <div className="border-t border-gray-200 bg-white">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="px-6 py-3 border-b border-gray-100">
            <div className="flex flex-wrap gap-2">
              {attachments.map(attachment => (
                <div key={attachment.id} className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg border border-blue-200">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800">{attachment.name}</span>
                  <button 
                    onClick={() => setAttachments(prev => prev.filter(a => a.id !== attachment.id))}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-end gap-3">
            {/* Multi-modal Input Controls */}
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Upload files"
              >
                <Upload className="w-5 h-5" />
              </button>
              
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2 rounded-lg transition-colors ${
                  isRecording 
                    ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                title={isRecording ? 'Stop recording' : 'Voice input'}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>

            {/* Main Input */}
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask me anything... I can help with code, architecture, debugging, research, and more! (Shift+Enter for new line)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={input.split('\n').length}
                disabled={isLoading}
              />
              
              {/* Input Suggestions */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-2 text-xs text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200">
                    ?? "Debug my React component"
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200">
                    ??? "Design a scalable architecture"
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200">
                    ? "Quick prototype for..."
                  </span>
                </div>
                
                <div className="text-xs text-gray-400">
                  {input.length}/4000 characters
                </div>
              </div>
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              Send
            </button>
          </div>

          {/* Advanced Features Hint */}
          <div className="text-xs text-gray-500 mt-3 flex items-center justify-between">
            <span>
              ?? <strong>Pro tip:</strong> I learn from our conversations and remember your preferences!
            </span>
            <span>
              ?? Context: {conversationMemory.projectContext.currentProject} | {conversationMemory.projectContext.technologies.join(', ')}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
