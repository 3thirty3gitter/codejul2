import React, { useState, useRef, useEffect } from 'react';
import { useAIChat } from '@/hooks/useAIChat';

export default function AIChat() {
  const { messages, isLoading, isConnected, sendMessage, clearChat, memory, testConnection } = useAIChat();
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

  const handleTestConnection = async () => {
    const connected = await testConnection();
    alert(connected ? 'Connection successful!' : 'Connection failed. Check your API key.');
  };

  const getAgentColor = (agent?: string) => {
    const colors = {
      coder: 'text-green-600 bg-green-50',
      architect: 'text-purple-600 bg-purple-50',
      reviewer: 'text-red-600 bg-red-50',
      researcher: 'text-orange-600 bg-orange-50',
      accelerator: 'text-yellow-600 bg-yellow-50',
      coordinator: 'text-blue-600 bg-blue-50'
    };
    return colors[agent] || 'text-gray-600 bg-gray-50';
  };

  const getAgentIcon = (agent?: string) => {
    const icons = {
      coder: '??',
      architect: '???',
      reviewer: '???',
      researcher: '??',
      accelerator: '?',
      coordinator: '??'
    };
    return icons[agent] || '??';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Enhanced Header with Connection Status */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            {isConnected && <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>}
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CodePilot AI
            </h2>
            <p className="text-xs text-gray-500">
              {isConnected ? 'Powered by Perplexity • Real-time Search' : 'Disconnected • Check API Configuration'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleTestConnection}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              isConnected 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            {isConnected ? 'Connected' : 'Test API'}
          </button>
          
          <div className="text-xs text-gray-500">
            Context: {memory?.keyTopics?.slice(0, 2).join(', ') || 'None'}
          </div>
          
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
          <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg ${
              message.role === 'user' 
                ? 'bg-blue-500 text-white' 
                : getAgentColor(message.agent)
            }`}>
              {message.role === 'user' ? '??' : getAgentIcon(message.agent)}
            </div>

            {/* Message Content */}
            <div className={`flex-1 max-w-3xl ${message.role === 'user' ? 'text-right' : ''}`}>
              {/* Message Header */}
              {message.agent && message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-sm font-semibold ${getAgentColor(message.agent).split(' ')[0]}`}>
                    {getAgentIcon(message.agent)} {message.agent.charAt(0).toUpperCase() + message.agent.slice(1)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                  {isConnected && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Live AI
                    </span>
                  )}
                </div>
              )}

              {/* Message Bubble */}
              <div className={`rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white ml-12'
                  : `${getAgentColor(message.agent)} border border-gray-200`
              }`}>
                <div className="prose prose-sm max-w-none">
                  {message.content.split('\n').map((line, i) => (
                    <p key={i} className={`${i === 0 ? 'mt-0' : ''} ${message.role === 'user' ? 'text-white' : ''}`}>
                      {line}
                    </p>
                  ))}
                </div>

                {/* Citations */}
                {message.citations && message.citations.length > 0 && (
                  <div className="mt-3 border-t border-gray-200 pt-3">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Sources:</p>
                    <div className="space-y-1">
                      {message.citations.map((citation, index) => (
                        <div key={index} className="text-xs">
                          <a 
                            href={citation.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium"
                          >
                            {citation.title}
                          </a>
                          {citation.snippet && (
                            <p className="text-gray-600 mt-1">{citation.snippet}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Message Actions */}
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <button className="hover:text-blue-600">?? Helpful</button>
                  <button className="hover:text-red-600">?? Not helpful</button>
                  <button className="hover:text-green-600">?? Follow up</button>
                  {message.citations && message.citations.length > 0 && (
                    <span className="text-green-600">? Verified sources</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading State */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              ??
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-blue-600">
                  AI is thinking...
                </span>
                {isConnected && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    Searching web
                  </span>
                )}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-blue-600">
                    Processing with real-time AI intelligence...
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
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isConnected ? "Ask me anything... I have real-time access to the latest information!" : "Configure Perplexity API key to enable AI chat"}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading || !isConnected}
              />
              
              {/* Input Suggestions */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-2 text-xs text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200" onClick={() => setInput("What are the latest React 18 features?")}>
                    ?? "Latest React features"
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200" onClick={() => setInput("Design a scalable Node.js API architecture")}>
                    ??? "API architecture design"
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200" onClick={() => setInput("Create a TypeScript React component")}>
                    ? "Quick component"
                  </span>
                </div>
                
                <div className="text-xs text-gray-400">
                  {input.length}/1000 characters
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!input.trim() || isLoading || !isConnected}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>??</span>
              )}
              Send
            </button>
          </div>

          {/* Status Line */}
          <div className="text-xs text-gray-500 mt-3 flex items-center justify-between">
            <span>
              ?? <strong>Real-time AI:</strong> {isConnected ? 'Get the latest information with verified sources!' : 'Add your Perplexity API key to enable live AI features'}
            </span>
            <span>
              ?? Context: {memory?.codeContext?.currentProject || 'CodePilot Development'} | {memory?.codeContext?.technologies?.join(', ') || 'React, TypeScript'}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
