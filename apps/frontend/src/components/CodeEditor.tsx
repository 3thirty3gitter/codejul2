import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

interface CodeFile {
  id: string;
  name: string;
  content: string;
  path: string;
  lastModified: Date;
  size?: number;
}

interface CodeEditorProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onRunCode: (file: CodeFile) => void;
  files?: CodeFile[];
  selectedFileId?: string;
  onFileSelect?: (fileId: string) => void;
  onFileUpdate?: (fileId: string, content: string) => void;
}

export default function CodeEditor({ 
  isCollapsed, 
  onToggleCollapse, 
  onRunCode,
  files = [],
  selectedFileId,
  onFileSelect,
  onFileUpdate
}: CodeEditorProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const editorRef = useRef<any>(null);

  const activeFile = files.find(file => file.id === selectedFileId);

  const updateFileContent = (content: string) => {
    if (!activeFile || !onFileUpdate) return;
    onFileUpdate(activeFile.id, content);
  };

  const saveFile = () => {
    if (!activeFile) return;
    
    // Show save confirmation
    const notification = document.createElement('div');
    notification.textContent = `? Saved ${activeFile.name}`;
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  };

  const getLanguageFromExtension = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'css': 'css',
      'html': 'html',
      'json': 'json',
      'md': 'markdown'
    };
    
    return languageMap[extension] || 'plaintext';
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            saveFile();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFile]);

  return (
    <div className={`bg-white border-t shadow-lg transition-all duration-300 ${isCollapsed ? 'h-12' : 'h-80'} flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="https://unpkg.com/lucide-static@latest/icons/code.svg" className="w-5 h-5 text-gray-600" alt="Code" />
            <span className="font-semibold text-gray-800">Code Editor</span>
          </div>
          
          {!isCollapsed && activeFile && (
            <div className="flex items-center gap-2">
              <button
                onClick={saveFile}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                title="Save (Ctrl+S)"
              >
                ?? Save
              </button>
              <button
                onClick={() => onRunCode(activeFile)}
                className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                title="Run Code"
              >
                ?? Run
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="text-xs border border-gray-300 rounded px-2 py-1"
              >
                <option value={12}>12px</option>
                <option value={14}>14px</option>
                <option value={16}>16px</option>
                <option value={18}>18px</option>
              </select>
              
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs transition-colors"
                title="Toggle Theme"
              >
                {isDarkMode ? '??' : '??'}
              </button>
            </>
          )}
          
          <button 
            onClick={onToggleCollapse}
            className="p-1 hover:bg-gray-200 rounded"
            title={isCollapsed ? "Expand Editor" : "Collapse Editor"}
          >
            <img 
              src={`https://unpkg.com/lucide-static@latest/icons/${isCollapsed ? 'chevron-up' : 'chevron-down'}.svg`} 
              className="w-4 h-4 text-gray-600" 
              alt="Toggle" 
            />
          </button>
        </div>
      </div>

      {/* File Tabs */}
      {!isCollapsed && files.length > 0 && (
        <div className="flex items-center bg-gray-100 border-b border-gray-200 overflow-x-auto">
          {files.map((file) => (
            <div
              key={file.id}
              className={`flex items-center gap-2 px-4 py-2 border-r border-gray-200 cursor-pointer min-w-0 ${
                file.id === selectedFileId
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'hover:bg-gray-200'
              }`}
              onClick={() => onFileSelect && onFileSelect(file.id)}
            >
              <span className="text-sm">{getFileIcon(file.name)}</span>
              <span className="text-sm font-medium truncate">
                {file.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Editor */}
      {!isCollapsed && activeFile && (
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language={getLanguageFromExtension(activeFile.name)}
            value={activeFile.content}
            onChange={(value) => updateFileContent(value || '')}
            onMount={(editor) => {
              editorRef.current = editor;
              editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, saveFile);
            }}
            theme={isDarkMode ? 'vs-dark' : 'light'}
            options={{
              fontSize,
              fontFamily: 'Fira Code, Monaco, Menlo, monospace',
              minimap: { enabled: true },
              wordWrap: 'on',
              lineNumbers: 'on',
              automaticLayout: true,
              scrollBeyondLastLine: false,
              smoothScrolling: true
            }}
          />
        </div>
      )}

      {/* No File Selected */}
      {!isCollapsed && !activeFile && (
        <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
          <div className="text-center">
            <div className="text-4xl mb-4">??</div>
            <div className="text-lg font-semibold mb-2">No File Selected</div>
            <div className="text-sm">Select a file from the explorer to start editing</div>
          </div>
        </div>
      )}

      {/* Collapsed State */}
      {isCollapsed && (
        <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
          <span className="text-sm">Code Editor Collapsed - Click to expand</span>
        </div>
      )}
    </div>
  );
}
