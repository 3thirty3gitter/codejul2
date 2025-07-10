import React, { useState, useEffect, useRef } from "react";
import { applicationBuilderAPI } from "../services/applicationBuilderAPI";

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant' | 'plan' | 'build' | 'error';
  timestamp: number;
  projectId?: string;
  files?: any[];
}

export default function ApplicationBuilderChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(0);

  // Generate truly unique message IDs
  const generateMessageId = () => {
    messageIdCounter.current += 1;
    return `msg-${Date.now()}-${messageIdCounter.current}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = {
      id: generateMessageId(),
      content: input.trim(),
      type: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    try {
      const response = await applicationBuilderAPI.generatePlan(input.trim());
      
      const planMessage: Message = {
        id: generateMessageId(),
        content: `?? **Plan Generated:** ${response.name}\n\n${response.description}`,
        type: 'plan',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, planMessage]);

    } catch (error) {
      const errorMessage: Message = {
        id: generateMessageId(),
        content: `? **Error:** ${error instanceof Error ? error.message : 'Something went wrong'}`,
        type: 'error',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.type === 'user';
    
    return (
      <div
        key={message.id} // Using unique ID generated above
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-[80%] rounded-lg px-4 py-3 ${
            isUser 
              ? 'bg-blue-600 text-white ml-auto' 
              : message.type === 'plan'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : message.type === 'build'
              ? 'bg-purple-50 border border-purple-200 text-purple-800'
              : message.type === 'error'
              ? 'bg-red-50 border border-red-200 text-red-800'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
          {message.files && message.files.length > 0 && (
            <div className="mt-2 text-xs opacity-75">
              ?? Files: {message.files.map(f => f.name).join(', ')}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full max-h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4" style={{ 
        maxHeight: '100%', 
        minHeight: 0, 
        overflowY: 'auto' 
      }}>
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <div className="text-4xl mb-4">??</div>
            <div className="text-lg font-semibold mb-2">AI Application Builder</div>
            <div className="text-sm">
              Describe what you want to build and I'll create it for you!
            </div>
          </div>
        )}
        
        {messages.map(renderMessage)}
        
        {isGenerating && (
          <div key="generating" className="flex justify-start mb-4">
            <div className="bg-gray-100 rounded-lg px-4 py-3 max-w-[80%]">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Building your application...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to build..."
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? 'Building...' : 'Build'}
          </button>
        </form>
      </div>
    </div>
  );
}

