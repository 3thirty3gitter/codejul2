import { useState } from "react";

// Define the structure of a message
interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  isUser?: boolean; // Optional frontend-specific flag
}

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (userMessageContent: string) => {
    if (userMessageContent.trim() === "") return;

    const newUserMessage: Message = {
      role: "user",
      content: userMessageContent,
      isUser: true,
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Send only the messages array, as the backend expects
          messages: updatedMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponseContent = data.choices[0]?.message?.content;

      if (!aiResponseContent) {
        throw new Error("Invalid response structure from AI service.");
      }

      const aiMessage: Message = {
        role: "assistant",
        content: aiResponseContent,
        isUser: false,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
      console.error("Chat Error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, error, sendMessage };
}
