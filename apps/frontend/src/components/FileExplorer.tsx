import React, { useState } from 'react';

const initialFiles = [
  { name: 'index.tsx', type: 'file' },
  { name: 'App.tsx', type: 'file' },
  { name: 'components', type: 'folder', children: [
    { name: 'CodeEditor.tsx', type: 'file' },
    { name: 'AuthModal.tsx', type: 'file' },
  ]},
  { name: 'styles', type: 'folder', children: [
    { name: 'index.css', type: 'file' },
  ]},
];

function FileNode({ node, level = 0 }: { node: any, level?: number }) {
  const [open, setOpen] = useState(false);
  if (node.type === 'folder') {
    return (
      <div className="pl-2">
        <div
          className="flex items-center cursor-pointer select-none py-1"
          onClick={() => setOpen(o => !o)}
        >
          <span className="mr-1 text-gray-400">{open ? '?' : '?'}</span>
          <span className="font-medium text-gray-200">{node.name}</span>
        </div>
        {open && (
          <div className="pl-4">
            {node.children.map((child: any, idx: number) => (
              <FileNode key={idx} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="flex items-center py-1 pl-8 text-gray-300 cursor-pointer hover:bg-gray-800 rounded">
      <span className="mr-2">??</span>
      <span>{node.name}</span>
    </div>
  );
}

export default function FileExplorer() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-2 w-64 h-full">
      <div className="font-semibold text-gray-100 mb-2">Files</div>
      <div>
        {initialFiles.map((file, idx) => (
          <FileNode key={idx} node={file} />
        ))}
      </div>
    </div>
  );
}
