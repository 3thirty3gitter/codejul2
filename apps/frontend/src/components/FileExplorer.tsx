import React, { useState, useRef, useEffect } from 'react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  content?: string;
  children?: FileNode[];
  isOpen?: boolean;
  isSelected?: boolean;
  lastModified: Date;
  size?: number;
}

interface FileExplorerProps {
  onFileSelect: (file: FileNode) => void;
  onFileCreate: (file: FileNode) => void;
  onFileDelete: (fileId: string) => void;
  onFileRename: (fileId: string, newName: string) => void;
  selectedFileId?: string;
}

export default function FileExplorer({ 
  onFileSelect, 
  onFileCreate, 
  onFileDelete, 
  onFileRename,
  selectedFileId 
}: FileExplorerProps) {
  const [fileTree, setFileTree] = useState<FileNode[]>([
    {
      id: 'src',
      name: 'src',
      type: 'folder',
      path: 'src',
      isOpen: true,
      lastModified: new Date(),
      children: [
        {
          id: 'app-tsx',
          name: 'App.tsx',
          type: 'file',
          path: 'src/App.tsx',
          lastModified: new Date(),
          size: 1247,
          content: `import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          ?? Welcome to CodePilot!
        </h1>
        <p className="text-gray-600 mb-6">
          Your AI-powered development workspace is ready!
        </p>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
          onClick={() => alert('Hello from CodePilot!')}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default App;`
        },
        {
          id: 'components',
          name: 'components',
          type: 'folder',
          path: 'src/components',
          isOpen: true,
          lastModified: new Date(),
          children: [
            {
              id: 'header-tsx',
              name: 'Header.tsx',
              type: 'file',
              path: 'src/components/Header.tsx',
              lastModified: new Date(),
              size: 856,
              content: `import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <span className="ml-3 text-lg text-gray-600">{subtitle}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}`
            }
          ]
        }
      ]
    },
    {
      id: 'package-json',
      name: 'package.json',
      type: 'file',
      path: 'package.json',
      lastModified: new Date(),
      size: 892,
      content: `{
  "name": "codepilot-workspace",
  "version": "1.0.0",
  "description": "Professional AI-powered development workspace",
  "main": "index.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.2.2",
    "vite": "^5.3.4"
  }
}`
    }
  ]);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    targetId: string;
    targetType: 'file' | 'folder';
  } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const findNodeById = (nodes: FileNode[], id: string): FileNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const updateNodeInTree = (nodes: FileNode[], id: string, updates: Partial<FileNode>): FileNode[] => {
    return nodes.map(node => {
      if (node.id === id) {
        return { ...node, ...updates };
      }
      if (node.children) {
        return {
          ...node,
          children: updateNodeInTree(node.children, id, updates)
        };
      }
      return node;
    });
  };

  const removeNodeFromTree = (nodes: FileNode[], id: string): FileNode[] => {
    return nodes.filter(node => {
      if (node.id === id) return false;
      if (node.children) {
        node.children = removeNodeFromTree(node.children, id);
      }
      return true;
    });
  };

  const addNodeToTree = (nodes: FileNode[], parentId: string, newNode: FileNode): FileNode[] => {
    return nodes.map(node => {
      if (node.id === parentId && node.type === 'folder') {
        const updatedChildren = [...(node.children || []), newNode];
        return {
          ...node,
          children: updatedChildren,
          isOpen: true
        };
      }
      if (node.children) {
        return {
          ...node,
          children: addNodeToTree(node.children, parentId, newNode)
        };
      }
      return node;
    });
  };

  const toggleFolder = (folderId: string) => {
    setFileTree(prev => updateNodeInTree(prev, folderId, { 
      isOpen: !findNodeById(prev, folderId)?.isOpen 
    }));
  };

  const handleFileClick = (file: FileNode) => {
    if (file.type === 'folder') {
      toggleFolder(file.id);
    } else {
      onFileSelect(file);
    }
  };

  const handleRightClick = (e: React.MouseEvent, node: FileNode) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      targetId: node.id,
      targetType: node.type
    });
  };

  const handleContextMenuAction = (action: string) => {
    if (!contextMenu) return;

    switch (action) {
      case 'rename':
        const node = findNodeById(fileTree, contextMenu.targetId);
        if (node) {
          setEditingId(node.id);
          setEditingName(node.name);
        }
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this item?')) {
          setFileTree(prev => removeNodeFromTree(prev, contextMenu.targetId));
          onFileDelete(contextMenu.targetId);
        }
        break;
      case 'new-file':
        createNewFile(contextMenu.targetId);
        break;
      case 'new-folder':
        createNewFolder(contextMenu.targetId);
        break;
    }
    setContextMenu(null);
  };

  const createNewFile = (parentId?: string) => {
    const fileName = prompt('Enter file name:');
    if (!fileName) return;

    const newFile: FileNode = {
      id: crypto.randomUUID(),
      name: fileName,
      type: 'file',
      path: parentId ? `${findNodeById(fileTree, parentId)?.path}/${fileName}` : fileName,
      content: getTemplateContent(fileName),
      lastModified: new Date(),
      size: 0
    };

    if (parentId) {
      setFileTree(prev => addNodeToTree(prev, parentId, newFile));
    } else {
      setFileTree(prev => [...prev, newFile]);
    }

    onFileCreate(newFile);
  };

  const createNewFolder = (parentId?: string) => {
    const folderName = prompt('Enter folder name:');
    if (!folderName) return;

    const newFolder: FileNode = {
      id: crypto.randomUUID(),
      name: folderName,
      type: 'folder',
      path: parentId ? `${findNodeById(fileTree, parentId)?.path}/${folderName}` : folderName,
      children: [],
      isOpen: false,
      lastModified: new Date()
    };

    if (parentId) {
      setFileTree(prev => addNodeToTree(prev, parentId, newFolder));
    } else {
      setFileTree(prev => [...prev, newFolder]);
    }
  };

  const handleRename = () => {
    if (!editingId || !editingName.trim()) return;

    const node = findNodeById(fileTree, editingId);
    if (!node) return;

    const newPath = node.path.replace(node.name, editingName);
    setFileTree(prev => updateNodeInTree(prev, editingId, { 
      name: editingName,
      path: newPath,
      lastModified: new Date()
    }));

    onFileRename(editingId, editingName);
    setEditingId(null);
    setEditingName('');
  };

  const getTemplateContent = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    const templates: Record<string, string> = {
      'tsx': `import React from 'react';

export default function ${fileName.replace('.tsx', '')}() {
  return (
    <div>
      <h1>${fileName.replace('.tsx', '')} Component</h1>
    </div>
  );
}`,
      'ts': `// ${fileName}

export const example = () => {
  console.log('Hello from ${fileName}');
};`,
      'css': `/* ${fileName} */

.container {
  /* Add styles here */
}`,
      'html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`
    };

    return templates[extension] || `// ${fileName}\n// New file created in CodePilot`;
  };

  const getFileIcon = (node: FileNode): string => {
    if (node.type === 'folder') {
      return node.isOpen ? '??' : '??';
    }
    
    const extension = node.name.split('.').pop()?.toLowerCase();
    const icons: Record<string, string> = {
      'tsx': '??',
      'ts': '??',
      'js': '??',
      'jsx': '??',
      'css': '??',
      'html': '??',
      'json': '??',
      'md': '??'
    };
    
    return icons[extension] || '??';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const renderFileNode = (node: FileNode, depth: number = 0): React.ReactNode => {
    const isSelected = node.id === selectedFileId;
    const paddingLeft = depth * 20 + 8;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100 ${
            isSelected ? 'bg-blue-100 border-r-2 border-blue-500' : ''
          }`}
          style={{ paddingLeft }}
          onClick={() => handleFileClick(node)}
          onContextMenu={(e) => handleRightClick(e, node)}
        >
          <span className="mr-2 text-sm">{getFileIcon(node)}</span>
          {editingId === node.id ? (
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={handleRename}
              onKeyPress={(e) => e.key === 'Enter' && handleRename()}
              className="flex-1 text-sm bg-white border border-blue-500 rounded px-1"
              autoFocus
            />
          ) : (
            <span className={`text-sm flex-1 ${isSelected ? 'font-semibold text-blue-700' : 'text-gray-700'}`}>
              {node.name}
            </span>
          )}
          {node.type === 'file' && node.size !== undefined && (
            <span className="text-xs text-gray-400 ml-2">
              {formatFileSize(node.size)}
            </span>
          )}
        </div>
        {node.type === 'folder' && node.isOpen && node.children && (
          <div>
            {node.children.map(child => renderFileNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-800">Files</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => createNewFile()}
            className="p-1 hover:bg-gray-200 rounded"
            title="New File"
          >
            ??
          </button>
          <button
            onClick={() => createNewFolder()}
            className="p-1 hover:bg-gray-200 rounded"
            title="New Folder"
          >
            ??
          </button>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto">
        {fileTree.map(node => renderFileNode(node))}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {contextMenu.targetType === 'folder' && (
            <>
              <button
                onClick={() => handleContextMenuAction('new-file')}
                className="w-full text-left px-3 py-1 hover:bg-gray-100 text-sm"
              >
                ?? New File
              </button>
              <button
                onClick={() => handleContextMenuAction('new-folder')}
                className="w-full text-left px-3 py-1 hover:bg-gray-100 text-sm"
              >
                ?? New Folder
              </button>
              <hr className="my-1" />
            </>
          )}
          <button
            onClick={() => handleContextMenuAction('rename')}
            className="w-full text-left px-3 py-1 hover:bg-gray-100 text-sm"
          >
            ?? Rename
          </button>
          <hr className="my-1" />
          <button
            onClick={() => handleContextMenuAction('delete')}
            className="w-full text-left px-3 py-1 hover:bg-gray-100 text-sm text-red-600"
          >
            ??? Delete
          </button>
        </div>
      )}
    </div>
  );
}
