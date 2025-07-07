import React, { useState } from "react";

interface File {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: File[];
}

interface FileExplorerProps {
  collapsed?: boolean;
  onToggle?: () => void;
  files?: File[];  // Make files optional with default
  selectedFileId?: string | null;
  onFileSelect?: (file: File) => void;
  onFileCreate?: (file: File) => void;
  onFileDelete?: (fileId: string) => void;
  onFileRename?: (fileId: string, newName: string) => void;
}

export default function FileExplorer({
  collapsed = false,
  onToggle,
  files = [], // Default to empty array
  selectedFileId = null,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename
}: FileExplorerProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'file' | 'folder'>('file');

  // Safe array access with fallback
  const safeFiles = Array.isArray(files) ? files : [];

  const handleCreateFile = () => {
    if (newFileName.trim() && onFileCreate) {
      const newFile: File = {
        id: Date.now().toString(),
        name: newFileName.trim(),
        type: newFileType,
        content: newFileType === 'file' ? '' : undefined,
        children: newFileType === 'folder' ? [] : undefined
      };
      onFileCreate(newFile);
      setNewFileName('');
      setShowCreateModal(false);
    }
  };

  const FileItem = ({ file }: { file: File }) => (
    <div 
      key={file.id}
      onClick={() => file.type === 'file' && onFileSelect?.(file)}
      style={{
        padding: '0.5rem',
        cursor: file.type === 'file' ? 'pointer' : 'default',
        background: selectedFileId === file.id ? '#007acc' : 'transparent',
        color: selectedFileId === file.id ? 'white' : '#cccccc',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.9rem'
      }}
    >
      <span>{file.type === 'folder' ? '??' : '??'}</span>
      <span style={{ flex: 1 }}>{file.name}</span>
      {file.type === 'file' && onFileDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFileDelete(file.id);
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#ff6b6b',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          ???
        </button>
      )}
    </div>
  );

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#252526'
    }}>
      {/* Header */}
      <div style={{
        padding: '0.75rem',
        borderBottom: '1px solid #454545',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#cccccc' }}>
          ?? Files ({safeFiles.length})
        </span>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {onFileCreate && (
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#007acc',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              ?
            </button>
          )}
          {onToggle && (
            <button
              onClick={onToggle}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#cccccc',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              {collapsed ? '?' : '?'}
            </button>
          )}
        </div>
      </div>

      {/* File List */}
      {!collapsed && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          {safeFiles.length === 0 ? (
            <div style={{
              padding: '1rem',
              color: '#888',
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              No files yet. Click ? to create one.
            </div>
          ) : (
            safeFiles.map(file => <FileItem key={file.id} file={file} />)
          )}
        </div>
      )}

      {/* Create File Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#2d2d30',
            padding: '1rem',
            borderRadius: '8px',
            minWidth: '300px'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: 'white' }}>Create New</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#cccccc', display: 'block', marginBottom: '0.5rem' }}>
                Type:
              </label>
              <select
                value={newFileType}
                onChange={(e) => setNewFileType(e.target.value as 'file' | 'folder')}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: '#1e1e1e',
                  border: '1px solid #454545',
                  color: 'white'
                }}
              >
                <option value="file">File</option>
                <option value="folder">Folder</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#cccccc', display: 'block', marginBottom: '0.5rem' }}>
                Name:
              </label>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder={newFileType === 'file' ? 'index.tsx' : 'components'}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: '#1e1e1e',
                  border: '1px solid #454545',
                  color: 'white'
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFile()}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid #454545',
                  color: '#cccccc',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFile}
                style={{
                  background: '#007acc',
                  border: 'none',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
