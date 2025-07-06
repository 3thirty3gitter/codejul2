import React, { createContext, useContext, useState } from "react";

interface Message {
  sender: "user" | "assistant" | "system";
  text: string;
  timestamp?: number;
}

interface ChatContextType {
  messages: Message[];
  addMessage: (msg: Message) => void;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "system", text: "Welcome to CodePilot Chat!", timestamp: Date.now() }
  ]);

  const addMessage = (msg: Message) => setMessages(prev => [...prev, { ...msg, timestamp: Date.now() }]);
  const clearChat = () => setMessages([]);

  return (
    <ChatContext.Provider value={{ messages, addMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
};
