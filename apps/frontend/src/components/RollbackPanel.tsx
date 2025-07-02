import React, { useState } from 'react';

const mockCheckpoints = [
  { id: 1, label: 'Initial setup', date: '2025-07-02 09:00' },
  { id: 2, label: 'Added file search', date: '2025-07-02 10:15' },
  { id: 3, label: 'Fixed branch panel', date: '2025-07-02 11:20' },
  { id: 4, label: 'Current', date: '2025-07-02 12:00' }
];

export default function RollbackPanel() {
  const [selected, setSelected] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState('');

  const handleRollback = () => {
    setConfirming(false);
    setMessage('Rollback complete. Workspace restored to checkpoint.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4">
      <div className="font-semibold text-white mb-2">Rollback / Restore Checkpoint</div>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {mockCheckpoints.map(cp => (
          <div
            key={cp.id}
            className="p-2 rounded cursor-pointer font-mono text-xs"
            onClick={() => setSelected(cp.id)}
            title="Select checkpoint"
          >
            <div>{cp.label}</div>
            <div className="text-xs text-gray-400">{cp.date}</div>
          </div>
        ))}
      </div>
      {selected !== null && (
        <div className="mt-4">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => setConfirming(true)}
          >
            Rollback to this checkpoint
          </button>
        </div>
      )}
      {confirming && (
        <div className="mt-4 bg-gray-800 p-4 rounded">
          <div className="text-white mb-2">
            Are you sure you want to rollback? All changes after this checkpoint will be lost.
          </div>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded mr-2"
            onClick={handleRollback}
          >
            Confirm Rollback
          </button>
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded"
            onClick={() => setConfirming(false)}
          >
            Cancel
          </button>
        </div>
      )}
      {message && (
        <div className="mt-4 text-green-400 font-bold">{message}</div>
      )}
    </div>
  );
}
