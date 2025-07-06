import React, { useState } from 'react';
import { diffLines } from 'diff';

const mockHistory = [
  { id: 1, label: 'Initial version', date: '2025-07-02 10:00', content: '// Initial code' },
  { id: 2, label: 'Added feature X', date: '2025-07-02 11:15', content: '// Added feature X\nconsole.log("Feature X");' },
  { id: 3, label: 'Fixed bug', date: '2025-07-02 13:45', content: '// Fixed bug\nconsole.log("Bug fixed");' },
];

export default function FileHistoryPanel() {
  const [history] = useState(mockHistory);
  const [selected, setSelected] = useState<number | null>(null);
  const [compareWith, setCompareWith] = useState<number | null>(null);

  let diff = null;
  if (selected !== null && compareWith !== null && selected !== compareWith) {
    const oldContent = history.find(h => h.id === compareWith)?.content || '';
    const newContent = history.find(h => h.id === selected)?.content || '';
    diff = diffLines(oldContent, newContent);
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4">
      <div className="font-semibold text-white mb-2">File History</div>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {history.map((h) => (
          <div
            key={h.id}
            className={`p-2 rounded cursor-pointer ${selected === h.id ? 'bg-primary text-white' : 'bg-gray-950 text-gray-300'}`}
            onClick={() => setSelected(h.id)}
            onDoubleClick={() => setCompareWith(h.id)}
            title="Click to preview, double-click to compare"
          >
            <div className="font-mono text-primary">{h.label}</div>
            <div className="text-xs text-gray-400">{h.date}</div>
          </div>
        ))}
      </div>
      {selected !== null && (
        <div className="mt-4 bg-gray-950 rounded p-2 border border-gray-800 text-xs font-mono text-gray-300">
          <div className="mb-2 font-bold text-primary">Preview:</div>
          <pre>{history.find(h => h.id === selected)?.content}</pre>
          <button
            className="mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => alert('Restore not implemented in demo')}
          >
            Restore this version
          </button>
        </div>
      )}
      {diff && (
        <div className="mt-4 bg-gray-950 rounded p-2 border border-gray-800 text-xs font-mono text-gray-300">
          <div className="mb-2 font-bold text-primary">Diff:</div>
          <pre>
            {diff.map((part, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: part.added ? '#16a34a33' : part.removed ? '#dc262633' : 'transparent',
                  color: part.added ? '#16a34a' : part.removed ? '#dc2626' : undefined,
                  textDecoration: part.removed ? 'line-through' : undefined,
                }}
              >
                {part.value}
              </span>
            ))}
          </pre>
        </div>
      )}
      <div className="mt-2 text-xs text-gray-400">
        Tip: Double-click a version to compare with the selected version.
      </div>
    </div>
  );
}
