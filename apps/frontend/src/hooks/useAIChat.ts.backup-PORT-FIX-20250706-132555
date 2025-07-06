import { useState } from "react";

interface DisplayMessage {
  role: "user" | "assistant";
  content: string;
}

export function useAIChat() {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (userMessageContent: string) => {
    if (userMessageContent.trim() === "" || isLoading) return;

    const newUserMessage: DisplayMessage = { role: "user", content: userMessageContent };
    const history = [...messages, newUserMessage];
    setMessages(history);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "An unknown server error occurred.");

      // The backend now sends a final, clean message object.
      if (data && data.content) {
        const aiMessage: DisplayMessage = {
          role: "assistant",
          content: data.content,
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error("Received an invalid response from the AI service.");
      }
    } catch (e: any) {
      console.error("Frontend Chat Error:", e);
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, error, sendMessage };
}
