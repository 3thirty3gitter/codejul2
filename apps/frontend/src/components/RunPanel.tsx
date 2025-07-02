import React, { useState } from 'react';

export default function RunPanel() {
  const [output, setOutput] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const handleRun = () => {
    setRunning(true);
    setOutput(['Running user code...']);
    setTimeout(() => {
      setOutput([
        'Running user code...',
        'Hello, world!',
        'Process exited with code 0',
      ]);
      setRunning(false);
    }, 2000);
  };

  return (
    <div className='bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4'>
      <div className='flex items-center gap-4 mb-2'>
        <button
          className='px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50'
          onClick={handleRun}
          disabled={running}
        >
          {running ? 'Running...' : 'Run'}
        </button>
      </div>
      <div className='text-xs text-gray-400 mb-1 font-mono'>Output:</div>
      <div className='bg-gray-950 rounded p-2 h-24 overflow-y-auto text-xs font-mono text-gray-300 border border-gray-800'>
        {output.map((line, idx) => <div key={idx}>{line}</div>)}
      </div>
    </div>
  );
}
