import { useState, useCallback, useRef, useEffect } from 'react';
import type { ChatMessage } from '../services/AIService';
import { AIService } from '../services/AIService';

export interface UseAIChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isConnected: boolean;
  sendMessage: (msg: string) => Promise<void>;
  clearChat: () => void;
  retryLastMessage: () => Promise<void>;
  testConnection: () => Promise<boolean>;
  memory: ReturnType<AIService['getMemory']>;
}

export function useAIChat(): UseAIChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const aiService = useRef(new AIService());
  const lastUserMessage = useRef<string>('');

  // On mount: test connection & send a welcome
  useEffect(() => {
    (async () => {
      const ok = await aiService.current.testConnection();
      setIsConnected(ok);

      const welcome: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: ok
          ? '? Connected! Ready for real AI responses.'
          : '?? Not connected. Please add your API key.',
        timestamp: new Date(),
        agent: 'coordinator',
      };
      setMessages([welcome]);
    })();
  }, []);

  const sendMessage = useCallback(
    async (msg: string) => {
      if (!msg.trim() || isLoading) return;
      setIsLoading(true);
      lastUserMessage.current = msg;

      try {
        await aiService.current.sendMessage(msg);
        setMessages(aiService.current.getConversationHistory());
      } catch (e: any) {
        console.error(e);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: `? Error: ${e?.message || 'Unknown'}`,
            timestamp: new Date(),
            agent: 'coordinator',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const retryLastMessage = useCallback(async () => {
    if (lastUserMessage.current) {
      await sendMessage(lastUserMessage.current);
    }
  }, [sendMessage]);

  const testConnection = useCallback(async () => {
    const ok = await aiService.current.testConnection();
    setIsConnected(ok);
    return ok;
  }, []);

  const clearChat = useCallback(() => {
    aiService.current.clearMemory();
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    isConnected,
    sendMessage,
    clearChat,
    retryLastMessage,
    testConnection,
    memory: aiService.current.getMemory(),
  };
}
