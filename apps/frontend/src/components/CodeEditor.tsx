import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { v4 as uuidv4 } from 'uuid';

interface CodeFile {
  id: string;
  name: string;
  content: string;
  language: string;
  path: string;
  isModified: boolean;
}

interface CodeEditorProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onRunCode: (file: CodeFile) => void;
}

export default function CodeEditor({ isCollapsed, onToggleCollapse, onRunCode }: CodeEditorProps) {
  const [files, setFiles] = useState<CodeFile[]>([
    {
      id: uuidv4(),
      name: 'App.tsx',
      content: `import React from 'react';

export default function App() {
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
}`,
      language: 'typescript',
      path: 'src/App.tsx',
      isModified: false
    },
    {
      id: uuidv4(),
      name: 'styles.css',
      content: `/* CodePilot Custom Styles */
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
}

.welcome-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 2rem;
  max-width: 400px;
  text-align: center;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1rem;
}

.description {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #2563eb;
}`,
      language: 'css',
      path: 'src/styles.css',
      isModified: false
    },
    {
      id: uuidv4(),
      name: 'utils.ts',
      content: `// CodePilot Utility Functions

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const getLanguageFromExtension = (extension: string): string => {
  const languageMap: Record<string, string> = {
    'ts': 'typescript',
    'tsx': 'typescript',
    'js': 'javascript',
    'jsx': 'javascript',
    'css': 'css',
    'scss': 'scss',
    'html': 'html',
    'json': 'json',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'php': 'php',
    'go': 'go',
    'rs': 'rust',
    'swift': 'swift',
    'kt': 'kotlin',
    'rb': 'ruby',
    'vue': 'vue',
    'md': 'markdown',
    'yml': 'yaml',
    'yaml': 'yaml',
    'xml': 'xml',
    'sql': 'sql'
  };
  
  return languageMap[extension] || 'plaintext';
};`,
      language: 'typescript',
      path: 'src/utils.ts',
      isModified: false
    }
  ]);

  const [activeFileId, setActiveFileId] = useState<string>(files[0]?.id || '');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [showMinimap, setShowMinimap] = useState(true);
  const [wordWrap, setWordWrap] = useState<'on' | 'off'>('on');

  const editorRef = useRef<any>(null);

  const activeFile = files.find(file => file.id === activeFileId);

  const updateFileContent = (content: string) => {
    if (!activeFile) return;
    
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === activeFileId 
          ? { ...file, content, isModified: file.content !== content }
          : file
      )
    );
  };

  const createNewFile = () => {
    const fileName = prompt('Enter file name (e.g., component.tsx, styles.css):');
    if (!fileName) return;

    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const language = getLanguageFromExtension(extension);

    const newFile: CodeFile = {
      id: uuidv4(),
      name: fileName,
      content: getTemplateForLanguage(language, fileName),
      language,
      path: `src/${fileName}`,
      isModified: false
    };

    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
  };

  const closeFile = (fileId: string) => {
    const fileToClose = files.find(f => f.id === fileId);
    if (fileToClose?.isModified) {
      if (!confirm(`"${fileToClose.name}" has unsaved changes. Close anyway?`)) {
        return;
      }
    }

    setFiles(prev => prev.filter(f => f.id !== fileId));
    
    if (fileId === activeFileId) {
      const remainingFiles = files.filter(f => f.id !== fileId);
      setActiveFileId(remainingFiles[0]?.id || '');
    }
  };

  const saveFile = () => {
    if (!activeFile) return;
    
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === activeFileId 
          ? { ...file, isModified: false }
          : file
      )
    );
    
    // Show save confirmation
    const notification = document.createElement('div');
    notification.textContent = `? Saved ${activeFile.name}`;
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  };

  const getLanguageFromExtension = (extension: string): string => {
    const languageMap: Record<string, string> = {
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'css': 'css',
      'scss': 'scss',
      'html': 'html',
      'json': 'json',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'php': 'php',
      'go': 'go',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin',
      'rb': 'ruby',
      'vue': 'vue',
      'md': 'markdown',
      'yml': 'yaml',
      'yaml': 'yaml',
      'xml': 'xml',
      'sql': 'sql'
    };
    
    return languageMap[extension] || 'plaintext';
  };

  const getTemplateForLanguage = (language: string, fileName: string): string => {
    const templates: Record<string, string> = {
      'typescript': `// ${fileName}
export default function Component() {
  return (
    <div>
      <h1>New Component</h1>
    </div>
  );
}`,
      'javascript': `// ${fileName}
export default function Component() {
  return (
    <div>
      <h1>New Component</h1>
    </div>
  );
}`,
      'css': `/* ${fileName} */
.container {
  padding: 1rem;
  margin: 0 auto;
  max-width: 1200px;
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
</html>`,
      'python': `# ${fileName}
def main():
    print("Hello, CodePilot!")

if __name__ == "__main__":
    main()`,
      'json': `{
  "name": "new-file",
  "version": "1.0.0",
  "description": ""
}`
    };

    return templates[language] || `// ${fileName}\n// New file created in CodePilot`;
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
          case 'n':
            e.preventDefault();
            createNewFile();
            break;
          case 'w':
            e.preventDefault();
            if (activeFileId) closeFile(activeFileId);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFileId, activeFile]);

  const getFileIcon = (language: string) => {
    const icons: Record<string, string> = {
      'typescript': '??',
      'javascript': '??',
      'css': '??',
      'html': '??',
      'json': '??',
      'python': '??',
      'java': '?',
      'cpp': '??',
      'markdown': '??'
    };
    return icons[language] || '??';
  };

  return (
    <div className={`bg-white border-t shadow-lg transition-all duration-300 ${isCollapsed ? 'h-12' : 'h-80'} flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="https://unpkg.com/lucide-static@latest/icons/code.svg" className="w-5 h-5 text-gray-600" alt="Code" />
            <span className="font-semibold text-gray-800">Code Editor</span>
          </div>
          
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <button
                onClick={createNewFile}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                title="New File (Ctrl+N)"
              >
                + New
              </button>
              <button
                onClick={saveFile}
                disabled={!activeFile?.isModified}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Save (Ctrl+S)"
              >
                ?? Save
              </button>
              <button
                onClick={() => activeFile && onRunCode(activeFile)}
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
                file.id === activeFileId
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'hover:bg-gray-200'
              }`}
              onClick={() => setActiveFileId(file.id)}
            >
              <span className="text-sm">{getFileIcon(file.language)}</span>
              <span className={`text-sm font-medium truncate ${file.isModified ? 'italic' : ''}`}>
                {file.name}{file.isModified ? ' •' : ''}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeFile(file.id);
                }}
                className="w-4 h-4 rounded hover:bg-gray-300 flex items-center justify-center text-xs"
                title="Close file"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Editor */}
      {!isCollapsed && activeFile && (
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language={activeFile.language}
            value={activeFile.content}
            onChange={(value) => updateFileContent(value || '')}
            onMount={(editor) => {
              editorRef.current = editor;
              
              // Add custom commands
              editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, saveFile);
              editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyN, createNewFile);
            }}
            theme={isDarkMode ? 'vs-dark' : 'light'}
            options={{
              fontSize,
              fontFamily: 'Fira Code, Monaco, Menlo, monospace',
              minimap: { enabled: showMinimap },
              wordWrap,
              lineNumbers: 'on',
              rulers: [80, 120],
              bracketPairColorization: { enabled: true },
              autoIndent: 'full',
              formatOnPaste: true,
              formatOnType: true,
              tabSize: 2,
              insertSpaces: true,
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              renderWhitespace: 'selection',
              showFoldingControls: 'always',
              folding: true,
              foldingStrategy: 'indentation',
              automaticLayout: true
            }}
          />
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
