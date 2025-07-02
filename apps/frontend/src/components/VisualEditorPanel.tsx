import React, { useState } from 'react';

export default function VisualEditorPanel() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4 h-full">
      <div className="font-semibold text-white mb-2">Visual Editor (Beta)</div>
      <div className="flex flex-col gap-2">
        <button
          className={`px-3 py-2 rounded ${selected === 'button' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-300'}`}
          onClick={() => setSelected('button')}
        >
          Button Element
        </button>
        <button
          className={`px-3 py-2 rounded ${selected === 'input' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-300'}`}
          onClick={() => setSelected('input')}
        >
          Input Element
        </button>
        <button
          className={`px-3 py-2 rounded ${selected === 'card' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-300'}`}
          onClick={() => setSelected('card')}
        >
          Card Element
        </button>
      </div>
      <div className="mt-4 text-gray-400 text-sm">
        {selected
          ? `Selected: ${selected.charAt(0).toUpperCase() + selected.slice(1)}`
          : 'Select an element to edit.'}
      </div>
    </div>
  );
}
