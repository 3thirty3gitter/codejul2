import React, { useState } from 'react';

export default function DeploymentControls({ onDeploy }: { onDeploy?: () => void }) {
  const [status, setStatus] = useState<'idle' | 'deploying' | 'deployed' | 'error'>('idle');
  const [logs, setLogs] = useState<string[]>([]);

  const handleDeploy = () => {
    setStatus('deploying');
    setLogs(logs => [...logs, 'Starting deployment...']);
    if (onDeploy) onDeploy();
    setTimeout(() => {
      setStatus('deployed');
      setLogs(logs => [...logs, 'Deployment successful! App is live.']);
    }, 2000);
  };

  const handleStop = () => {
    setStatus('idle');
    setLogs(logs => [...logs, 'App stopped.']);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-4 mb-2">
        <button
          className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          onClick={handleDeploy}
          disabled={status === 'deploying' || status === 'deployed'}
        >
          {status === 'deploying' ? 'Deploying...' : status === 'deployed' ? 'Deployed' : 'Deploy'}
        </button>
        <button
          className="px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition disabled:opacity-50"
          onClick={handleStop}
          disabled={status !== 'deployed'}
        >
          Stop
        </button>
      </div>
      <div className="text-xs text-gray-400 mb-1 font-mono">Logs:</div>
      <div className="bg-gray-950 rounded p-2 h-32 overflow-y-auto text-xs font-mono text-gray-300 border border-gray-800">
        {logs.length === 0 ? <span>No logs yet.</span> : logs.map((log, idx) => <div key={idx}>{log}</div>)}
      </div>
    </div>
  );
}
