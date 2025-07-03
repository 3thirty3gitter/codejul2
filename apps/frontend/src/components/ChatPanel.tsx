import React, { useState, useRef, useEffect } from "react";

const initialMessages = [
  { sender: "system", text: "Welcome to CodePilot Chat! How can I help you today?" },
];

export default function ChatPanel() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
    // Simulate assistant reply
    setTimeout(() => {
      setMessages(msgs => [
        ...msgs,
        {
          sender: "assistant",
          text: "This is a sample response. Integrate your backend to enable real chat.",
        },
      ]);
    }, 700);
  };

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 text-xl font-semibold">
        ?? CodePilot Chat
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-slate-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-2xl shadow
                ${msg.sender === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : msg.sender === "assistant"
                  ? "bg-slate-200 text-slate-800 rounded-bl-none"
                  : "bg-gray-200 text-gray-700 rounded-bl-none"}
              `}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        className="flex items-center gap-2 border-t px-4 py-3 bg-white"
        onSubmit={e => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <textarea
          className="flex-1 resize-none rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          rows={1}
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition-all"
        >
          Send
        </button>
      </form>
    </div>
  );
}
