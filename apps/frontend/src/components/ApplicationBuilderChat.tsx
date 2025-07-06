import React, { useState } from "react";

// Initial messages for demonstration
const initialMessages = [
  { id: "msg-1", text: "User message.", isUser: true, type: "user" },
  { id: "msg-2", text: "AI plan.", isUser: false, type: "plan" },
  { id: "msg-3", text: "AI response.", isUser: false, type: "response" }
];

export default function ApplicationBuilderChat() {
  // State for managing the list of messages
  const [messages, setMessages] = useState(initialMessages);
  // State for managing the text in the input field
  const [input, setInput] = useState("");

  // Function to handle sending a new message
  const handleSendMessage = () => {
    const trimmedInput = input.trim();
    if (trimmedInput === "") {
      return; // Do not send empty messages
    }

    const newMessage = {
      id: "msg-" + Date.now(), // Simple unique ID
      text: trimmedInput,
      isUser: true,
      type: "user",
    };

    // Add the new message to the list and clear the input field
    setMessages([...messages, newMessage]);
    setInput("");
  };

  // Handler for pressing Enter in the input field
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => {
          const isUser = message.isUser;
          const containerClasses = "flex mb-4 " + (isUser ? "justify-end" : "justify-start");
          const bubbleClasses = "max-w-lg rounded-lg px-4 py-3 " +
            (isUser
              ? "bg-blue-600 text-white"
              : message.type === "plan"
                ? "bg-green-50 border border-green-200"
                : "bg-gray-100");

          return (
            <div key={message.id + "-" + index} className={containerClasses}>
              <div className={bubbleClasses}>
                {message.text}
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t p-4 flex gap-2">
        <input
          className="w-full border rounded px-2 py-1"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
