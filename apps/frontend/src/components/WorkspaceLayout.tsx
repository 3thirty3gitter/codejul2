import React, { useState, useRef } from "react";
import ApplicationBuilderChat from "./ApplicationBuilderChat";
import Settings from "./Settings";
import CodeEditor from "./CodeEditor";
import FileExplorer from "./FileExplorer";
import ProjectTemplates from "./ProjectTemplates";
import LivePreview from "./LivePreview";

import { AITeam } from "../services/AITeam";

export default function WorkspaceLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filesCollapsed, setFilesCollapsed] = useState(false);
  const [codeEditorCollapsed, setCodeEditorCollapsed] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [chatWidth, setChatWidth] = useState(40);
  const [isResizing, setIsResizing] = useState(false);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [activeChat, setActiveChat] = useState('individual'); // 'individual' or 'team'
  const [teamMessages, setTeamMessages] = useState([]);
  
  const aiTeam = useRef(new AITeam());

  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    
    const container = e.currentTarget.parentElement;
    const containerRect = container.getBoundingClientRect();
    const newChatWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    if (newChatWidth >= 25 && newChatWidth <= 60) {
      setChatWidth(newChatWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  const openSettings = () => {
    setShowSettings(true);
    setShowUserDropdown(false);
  };

  const handleFileSelect = (file) => {
    setSelectedFileId(file.id);
    const existingFile = currentFiles.find(f => f.id === file.id);
    if (!existingFile) {
      setCurrentFiles(prev => [...prev, file]);
    }
  };

  const handleFileCreate = (file) => {
    setCurrentFiles(prev => [...prev, file]);
    setSelectedFileId(file.id);
  };

  const handleFileDelete = (fileId) => {
    setCurrentFiles(prev => prev.filter(f => f.id !== fileId));
    if (selectedFileId === fileId) {
      setSelectedFileId(null);
    }
  };

  const handleFileRename = (fileId, newName) => {
    setCurrentFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, name: newName } : f
    ));
  };

  const handleTemplateSelect = (template) => {
    const templateFiles = template.files.map(file => ({
      id: crypto.randomUUID(),
      name: file.path.split('/').pop(),
      type: 'file',
      path: file.path,
      content: file.content,
      lastModified: new Date(),
      size: file.content.length
    }));
    
    setCurrentFiles(templateFiles);
    setSelectedFileId(templateFiles[0]?.id);
    setShowTemplates(false);
    
    const notification = document.createElement('div');
    notification.textContent = `? ${template.name} template loaded - Live Preview ready!`;
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const handleRunCode = (file) => {
    const notification = document.createElement('div');
    notification.textContent = `?? Running ${file.name} - Check Live Preview!`;
    notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
    
    console.log('Running code:', file);
  };

  const toggleFilesPanel = () => {
    setFilesCollapsed(!filesCollapsed);
    
    const notification = document.createElement('div');
    notification.textContent = filesCollapsed ? '?? Files panel expanded' : '?? Files panel collapsed';
    notification.className = 'fixed top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  };

  const handleTeamMessage = async (message, selectedMembers) => {
    try {
      const { responses, synthesis } = await aiTeam.current.sendTeamMessage(message, selectedMembers);
      
      // Add user message
      const userMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
        timestamp: new Date()
      };
      
      setTeamMessages(prev => [
        ...prev,
        userMessage,
        ...Array.from(responses.values()),
        synthesis
      ]);
    } catch (error) {
      console.error('Team message error:', error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-200 font-inter flex flex-col">
      <div className="flex flex-1">
        {/* Collapsible Sidebar */}
        <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-xl transition-all duration-300 flex flex-col ${sidebarCollapsed ? 'px-2' : 'px-6'} py-8 rounded-tr-3xl rounded-br-3xl`}>
          <div className={`flex items-center mb-12 ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
            <img
              src="https://unpkg.com/lucide-static@latest/icons/rocket.svg"
              alt="Logo"
              className="w-8 h-8 flex-shrink-0"
            />
            {!sidebarCollapsed && (
              <span className="text-xl font-bold tracking-wide text-blue-700">CodePilot</span>
            )}
          </div>
          
          <nav className="flex-1 flex flex-col gap-2">
            <button 
              onClick={toggleFilesPanel}
              className={`flex items-center py-3 rounded-lg font-semibold transition ${
                !filesCollapsed 
                  ? 'text-green-600 bg-green-100' 
                  : 'text-gray-600 hover:bg-blue-50'
              } ${
                sidebarCollapsed 
                  ? 'justify-center px-2' 
                  : 'gap-3 px-4'
              }`}
              title="Toggle Files Panel"
            >
              <img 
                src="https://unpkg.com/lucide-static@latest/icons/folder-open.svg" 
                className="w-5 h-5 flex-shrink-0" 
                alt="Files" 
              />
              {!sidebarCollapsed && (
                <span>Files {filesCollapsed ? '(Hidden)' : ''}</span>
              )}
            </button>
            
            <a 
              href="#" 
              className={`flex items-center py-3 rounded-lg hover:bg-blue-50 transition ${
                sidebarCollapsed 
                  ? 'justify-center px-2' 
                  : 'gap-3 px-4'
              }`}
              title="Version Control"
            >
              <img 
                src="https://unpkg.com/lucide-static@latest/icons/git-branch.svg" 
                className="w-5 h-5 flex-shrink-0" 
                alt="Version Control" 
              />
              {!sidebarCollapsed && <span>Version Control</span>}
            </a>
            
            <button 
              onClick={() => setActiveChat('individual')}
              className={`flex items-center py-3 rounded-lg font-semibold transition ${
                activeChat === 'individual'
                  ? 'text-blue-600 bg-blue-100' 
                  : 'text-gray-600 hover:bg-blue-50'
              } ${
                sidebarCollapsed 
                  ? 'justify-center px-2' 
                  : 'gap-3 px-4'
              }`}
              title="Individual AI Chat"
            >
              <img 
                src="https://unpkg.com/lucide-static@latest/icons/message-circle.svg" 
                className="w-5 h-5 flex-shrink-0" 
                alt="Chat" 
              />
              {!sidebarCollapsed && <span>AI Chat</span>}
            </button>

            <button 
              onClick={() => setActiveChat('team')}
              className={`flex items-center py-3 rounded-lg font-semibold transition ${
                activeChat === 'team'
                  ? 'text-purple-600 bg-purple-100' 
                  : 'text-gray-600 hover:bg-purple-50'
              } ${
                sidebarCollapsed 
                  ? 'justify-center px-2' 
                  : 'gap-3 px-4'
              }`}
              title="AI Development Team"
            >
              <img 
                src="https://unpkg.com/lucide-static@latest/icons/users.svg" 
                className="w-5 h-5 flex-shrink-0" 
                alt="Team" 
              />
              {!sidebarCollapsed && <span>AI Team</span>}
            </button>
          </nav>
          
          <div className="mt-auto">
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`w-full flex items-center py-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all ${
                sidebarCollapsed 
                  ? 'justify-center px-2' 
                  : 'justify-center gap-2 px-4'
              }`}
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <img 
                src={`https://unpkg.com/lucide-static@latest/icons/${sidebarCollapsed ? 'chevron-right' : 'chevron-left'}.svg`} 
                className="w-5 h-5 flex-shrink-0" 
                alt="Toggle" 
              />
              {!sidebarCollapsed && <span>Collapse</span>}
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col">
          <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-slate-800">CodePilot AI Workspace</h1>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filesCollapsed 
                    ? 'bg-gray-100 text-gray-600' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {filesCollapsed ? '?? Files Hidden' : '??? File Management Active'}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activeChat === 'team'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {activeChat === 'team' ? '?? Team Mode' : '?? Individual AI'}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  ?? Live Preview Active
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowTemplates(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold shadow hover:bg-purple-700 transition-all"
              >
                <img src="https://unpkg.com/lucide-static@latest/icons/layout-template.svg" className="w-5 h-5" alt="Template" />
                Templates
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-all">
                <img src="https://unpkg.com/lucide-static@latest/icons/plus.svg" className="w-5 h-5" alt="Add" />
                New Project
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="w-8 h-8 rounded-full bg-blue-100 p-1 hover:bg-blue-200 transition-all"
                >
                  <img src="https://unpkg.com/lucide-static@latest/icons/user.svg" className="w-full h-full" alt="User" />
                </button>
                
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <button 
                      onClick={openSettings}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition text-left"
                    >
                      <img src="https://unpkg.com/lucide-static@latest/icons/settings.svg" className="w-4 h-4" alt="Settings" />
                      Settings
                    </button>
                    <a href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition">
                      <img src="https://unpkg.com/lucide-static@latest/icons/user-circle.svg" className="w-4 h-4" alt="Profile" />
                      Profile
                    </a>
                    <hr className="my-2 border-gray-200" />
                    <a href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-red-600 transition">
                      <img src="https://unpkg.com/lucide-static@latest/icons/log-out.svg" className="w-4 h-4" alt="Logout" />
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="flex-1 flex gap-6 p-6">
            {/* Collapsible File Explorer */}
            {!filesCollapsed && (
              <section className="w-80 bg-white rounded-2xl shadow transition-all duration-300">
                <FileExplorer
                  onFileSelect={handleFileSelect}
                  onFileCreate={handleFileCreate}
                  onFileDelete={handleFileDelete}
                  onFileRename={handleFileRename}
                  selectedFileId={selectedFileId}
                />
              </section>
            )}

            {/* Collapsed Files Button */}
            {filesCollapsed && (
              <button
                onClick={toggleFilesPanel}
                className="w-12 bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-300 flex items-center justify-center group"
                title="Expand Files Panel"
              >
                <div className="flex flex-col items-center gap-2 py-4">
                  <img 
                    src="https://unpkg.com/lucide-static@latest/icons/folder-open.svg" 
                    className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" 
                    alt="Files" 
                  />
                  <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors transform -rotate-90">
                    FILES
                  </span>
                </div>
              </button>
            )}

            {/* Three-Panel Layout: Chat | Live Preview */}
            <div 
              className="flex-1 flex gap-6" 
              onMouseMove={handleMouseMove}
            >
              {/* AI Chat / Team Chat */}
              <section 
                className={`bg-white rounded-2xl shadow flex flex-col ${codeEditorCollapsed ? 'min-h-[600px]' : 'h-full'}`}
                style={{ width: `${chatWidth}%` }}
              >
                {activeChat === 'individual' ? (
                  <ApplicationBuilderChat />
                ) : (
                  <ApplicationBuilderChat 
                    aiTeam={aiTeam.current}
                    onMessageSend={handleTeamMessage}
                  />
                )}
              </section>

              {/* Resize Handle */}
              <div 
                className="w-2 cursor-col-resize bg-gray-300 hover:bg-blue-400 rounded-full transition-colors flex items-center justify-center"
                onMouseDown={handleMouseDown}
                title="Drag to resize panels"
              >
                <div className="w-1 h-8 bg-white rounded-full opacity-50"></div>
              </div>

              {/* Live Preview */}
              <section 
                className={`bg-white rounded-2xl shadow flex flex-col ${codeEditorCollapsed ? 'min-h-[600px]' : 'h-full'}`}
                style={{ width: `${100 - chatWidth - 1}%` }}
              >
                <LivePreview 
                  files={currentFiles || []}
                  selectedFileId={selectedFileId}
                />
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* Enhanced Code Editor */}
      <CodeEditor 
        isCollapsed={codeEditorCollapsed}
        onToggleCollapse={() => setCodeEditorCollapsed(!codeEditorCollapsed)}
        onRunCode={handleRunCode}
        files={currentFiles || []}
        selectedFileId={selectedFileId}
        onFileSelect={setSelectedFileId}
        onFileUpdate={(fileId, content) => {
          setCurrentFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, content, lastModified: new Date() } : f
          ));
        }}
      />

      {/* Project Templates Modal */}
      {showTemplates && (
        <ProjectTemplates 
          onTemplateSelect={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}

      {showUserDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserDropdown(false)}
        />
      )}

      <footer className="text-center text-gray-400 text-sm py-2 bg-white">
        &copy; {new Date().getFullYear()} CodePilot AI. All rights reserved.
      </footer>
    </div>
  );
}


