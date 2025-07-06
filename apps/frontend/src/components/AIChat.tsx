import React, { useState, useEffect, useRef } from 'react';
import { useAIChat } from '@/hooks/useAIChat';
import { Send, Bot, User, Trash2, TestTubeDiagonal } from 'lucide-react';

export default function AIChat() {
  const { messages, isLoading, error, sendMessage } = useAIChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to the bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  // The clearChat function needs to be adapted or removed if not implemented in the hook
  // For now, we will comment it out to prevent errors.
  // const clearChat = () => {
  //   // Implement logic to clear messages, perhaps by calling a function from useAIChat
  // };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border">
      <div className="flex-shrink-0 p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center">
          <Bot className="mr-2" />
          CodePilot AI
        </h2>
        {/* <button onClick={clearChat} className="p-2 rounded-md hover:bg-gray-100">
          <Trash2 size={18} />
        </button> */}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex items-start gap-3 ${message.isUser ? 'justify-end' : ''}`}>
            {!message.isUser && <Bot className="w-6 h-6 text-gray-500" />}
            <div className={`px-4 py-2 rounded-lg max-w-md ${message.isUser ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
              <p style={{ whiteSpace: "pre-wrap" }}>{message.content}</p>
            </div>
            {message.isUser && <User className="w-6 h-6 text-blue-600" />}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <Bot className="w-6 h-6 text-gray-500" />
            <div className="px-4 py-2 rounded-lg bg-gray-100">
              <p className="animate-pulse">AI is thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && <div className="p-4 border-t text-red-600 bg-red-50">{error}</div>}

      <div className="p-4 border-t flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your AI agent to build..."
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
