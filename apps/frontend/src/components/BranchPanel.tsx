import React, { useState } from 'react';

const mockBranches = [
  { name: 'main', current: true },
  { name: 'feature-ui', current: false },
  { name: 'bugfix-history', current: false }
];

export default function BranchPanel() {
  const [branches, setBranches] = useState(mockBranches);
  const [newBranch, setNewBranch] = useState('');

  const handleSwitch = (name: string) => {
    setBranches(branches.map(b => ({ ...b, current: b.name === name })));
  };

  const handleCreate = () => {
    if (newBranch && !branches.some(b => b.name === newBranch)) {
      setBranches([{ name: newBranch, current: false }, ...branches]);
      setNewBranch('');
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4">
      <div className="font-semibold text-white mb-2">Branch Management</div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          className="flex-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
          placeholder="New branch name"
          value={newBranch}
          onChange={e => setNewBranch(e.target.value)}
        />
        <button
          className="bg-primary text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
          onClick={handleCreate}
          disabled={!newBranch}
        >
          Create
        </button>
      </div>
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {branches.map(b => (
          <div
            key={b.name}
            className={`p-2 rounded cursor-pointer font-mono text-xs ${
              b.current
                ? 'bg-primary text-white font-bold'
                : 'bg-gray-950 text-gray-300'
            }`}
            onClick={() => handleSwitch(b.name)}
            title={b.current ? 'Current branch' : 'Switch to this branch'}
          >
            {b.name}
            {b.current && <span className="ml-2 text-xs">(current)</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
