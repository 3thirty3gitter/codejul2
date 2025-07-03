import React, { useState, useRef, useEffect } from 'react';
import { useAIChat } from '@/hooks/useAIChat';

export default function AIChat() {
  const { messages, isLoading, sendMessage, clearChat, memory } = useAIChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const getAgentColor = (agent?: string) => {
    switch (agent) {
      case 'coder': return 'text-green-600';
      case 'architect': return 'text-blue-600';
      case 'reviewer': return 'text-purple-600';
      case 'coordinator': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getAgentIcon = (agent?: string) => {
    switch (agent) {
      case 'coder': return '??';
      case 'architect': return '???';
      case 'reviewer': return '??';
      case 'coordinator': return '??';
      default: return '??';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h2 className="text-lg font-semibold">CodePilot AI</h2>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
            Multi-Agent
          </span>
        </div>
        <div className="flex items-center gap-2">
          {memory?.keyTopics?.length > 0 && (
            <div className="text-xs text-gray-500">
              Context: {memory.keyTopics.slice(0, 3).join(', ')}
            </div>
          )}
          <button
            onClick={clearChat}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg text-sm transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg ${
              message.role === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100'
            }`}>
              {message.role === 'user' ? '??' : getAgentIcon(message.agent)}
            </div>
            <div className={`max-w-md rounded-lg p-3 ${
              message.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-200'
            }`}>
              {message.agent && message.role === 'assistant' && (
                <div className={`text-xs font-medium mb-1 ${getAgentColor(message.agent)}`}>
                  {getAgentIcon(message.agent)} {message.agent.charAt(0).toUpperCase() + message.agent.slice(1)}
                </div>
              )}
              <div className="whitespace-pre-wrap text-sm">
                {message.content}
              </div>
              <div className={`text-xs mt-2 opacity-60 ${
                message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center animate-pulse">
              ??
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-500">AI thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything... (e.g., 'Create a React component for user authentication')"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Send
          </button>
        </form>
        <div className="text-xs text-gray-500 mt-2">
          ?? Tip: I remember our conversation context and learn your preferences over time
        </div>
      </div>
    </div>
  );
}
