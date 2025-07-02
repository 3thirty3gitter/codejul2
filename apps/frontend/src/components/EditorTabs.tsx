import React, { useState } from 'react';

const initialTabs = [
  { name: 'index.tsx', active: true },
  { name: 'App.tsx', active: false },
  { name: 'CodeEditor.tsx', active: false }
];

export default function EditorTabs() {
  const [tabs, setTabs] = useState(initialTabs);

  const setActive = (idx: number) => {
    setTabs(tabs.map((tab, i) => ({ ...tab, active: i === idx })));
  };

  return (
    <div className='flex gap-2 mb-2'>
      {tabs.map((tab, idx) => (
        <button
          key={tab.name}
          className={
            "px-4 py-1 rounded-t-lg font-mono text-sm border-b-2 " +
            (tab.active
              ? "bg-gray-900 text-primary border-primary"
              : "bg-gray-800 text-gray-400 border-transparent")
          }
          onClick={() => setActive(idx)}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
}
