import React, { useState } from "react";

const mockHistory = [
  { id: 1, title: "Onboarding Q&A", date: "2025-07-02" },
  { id: 2, title: "Bug report with Sam", date: "2025-07-01" },
  { id: 3, title: "Feature brainstorm", date: "2025-06-28" },
];

export default function ChatHistoryPanel({ onSelect }) {
  const [search, setSearch] = useState("");
  const filtered = mockHistory.filter(
    h => h.title.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="w-full max-w-xs bg-white rounded-2xl shadow-lg p-4">
      <div className="mb-3">
        <input
          className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search chat history…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        {filtered.map(h => (
          <button
            key={h.id}
            className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50 transition"
            onClick={() => onSelect && onSelect(h.id)}
          >
            <div className="font-semibold">{h.title}</div>
            <div className="text-xs text-gray-500">{h.date}</div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="text-sm text-gray-400 py-4 text-center">
            No conversations found.
          </div>
        )}
      </div>
    </div>
  );
}
