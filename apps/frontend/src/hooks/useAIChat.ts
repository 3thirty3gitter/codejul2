import { useState, useCallback, useRef, useEffect } from 'react';
import { AIService, ChatMessage } from '@/services/AIService';

export interface UseAIChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (message: string, context?: any) => Promise<void>;
  clearChat: () => void;
  memory: any;
  retryLastMessage: () => Promise<void>;
}

export function useAIChat(): UseAIChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const aiService = useRef(new AIService());
  const lastUserMessage = useRef<string>('');

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `?? Welcome to CodePilot AI! I'm your intelligent coding assistant powered by a team of specialized AI agents:

?? **Coder** - Writes, debugs, and optimizes code
??? **Architect** - Designs systems and plans projects  
?? **Reviewer** - Reviews code for quality and security
?? **Coordinator** - Routes tasks and manages context

I learn from our conversations and remember your preferences. What would you like to build today?`,
      timestamp: new Date(),
      agent: 'coordinator'
    };
    setMessages([welcomeMessage]);
  }, []);

  const sendMessage = useCallback(async (message: string, context?: any) => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    lastUserMessage.current = message;

    try {
      const response = await aiService.current.sendMessage(message, context);
      setMessages(aiService.current.getConversationHistory());
    } catch (error) {
      console.error('AI Chat Error:', error);
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '? Sorry, I encountered an error. Please try again or contact support if the issue persists.',
        timestamp: new Date(),
        agent: 'coordinator'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const retryLastMessage = useCallback(async () => {
    if (lastUserMessage.current) {
      await sendMessage(lastUserMessage.current);
    }
  }, [sendMessage]);

  const clearChat = useCallback(() => {
    aiService.current.clearMemory();
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    memory: aiService.current.getMemory(),
    retryLastMessage
  };
}
