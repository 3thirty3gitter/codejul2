import React from 'react';
import MonacoEditor from '@monaco-editor/react';

export default function CodeEditor() {
  return (
    <div className="flex flex-col h-full w-full bg-gray-900 rounded-lg border border-gray-800">
      <div className="px-4 py-2 bg-gray-800 text-white font-semibold rounded-t-lg">
        Code Editor
      </div>
      <div className="flex-1">
        <MonacoEditor
          height="400px"
          defaultLanguage="javascript"
          defaultValue={'// Start coding!'}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
}
