import React, { useState } from 'react';

const files = [
  { name: 'index.tsx', content: '// Initial code' },
  { name: 'App.tsx', content: '// App main file' },
  { name: 'CodeEditor.tsx', content: '// Monaco code editor' },
  { name: 'FileExplorer.tsx', content: '// File explorer logic' },
  { name: 'VisualEditorPanel.tsx', content: '// Visual editor UI' },
];

export default function FileSearchPanel() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(files);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    setResults(
      files.filter(
        f =>
          f.name.toLowerCase().includes(value.toLowerCase()) ||
          f.content.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4">
      <div className="font-semibold text-white mb-2">File Search</div>
      <input
        type="text"
        className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 mb-2 focus:outline-none"
        placeholder="Search files by name or content..."
        value={query}
        onChange={handleSearch}
      />
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {results.length === 0 ? (
          <div className="text-gray-400 text-xs">No files found.</div>
        ) : (
          results.map((f, idx) => (
            <div
              key={f.name}
              className="p-2 rounded bg-gray-950 text-gray-300 font-mono text-xs cursor-pointer hover:bg-primary hover:text-white"
              title={f.content}
            >
              {f.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
