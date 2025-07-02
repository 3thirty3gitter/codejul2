import React, { useState } from 'react';

const mockHistory = [
  { hash: 'a1b2c3d', message: 'Initial commit', date: '2025-07-01 10:00' },
  { hash: 'd4e5f6a', message: 'Add code editor', date: '2025-07-02 09:12' },
  { hash: 'b7c8d9e', message: 'Fix EditorTabs bug', date: '2025-07-02 15:10' },
];

export default function VersionControlPanel() {
  const [commitMsg, setCommitMsg] = useState('');
  const [history, setHistory] = useState(mockHistory);

  const handleCommit = (e) => {
    e.preventDefault();
    if (commitMsg.trim()) {
      setHistory([
        { hash: Math.random().toString(36).substring(2, 9), message: commitMsg, date: new Date().toLocaleString() },
        ...history,
      ]);
      setCommitMsg('');
    }
  };

  return (
    <div className='bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4'>
      <div className='font-semibold text-white mb-2'>Version Control</div>
      <form className='flex gap-2 mb-4' onSubmit={handleCommit}>
        <input
          type='text'
          className='flex-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none'
          placeholder='Commit message'
          value={commitMsg}
          onChange={e => setCommitMsg(e.target.value)}
        />
        <button
          type='submit'
          className='bg-primary text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition'
        >
          Commit
        </button>
      </form>
      <div className='text-xs text-gray-400 mb-1 font-mono'>History:</div>
      <div className='space-y-2 max-h-32 overflow-y-auto'>
        {history.map((h, idx) => (
          <div key={h.hash} className='bg-gray-950 rounded p-2 border border-gray-800 flex flex-col'>
            <span className='text-primary font-mono'>{h.hash}</span>
            <span className='text-white'>{h.message}</span>
            <span className='text-xs text-gray-500'>{h.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
