import React, { useState } from "react";
import AIChat from "./AIChat";

export default function WorkspaceLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [codeEditorCollapsed, setCodeEditorCollapsed] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [chatWidth, setChatWidth] = useState(66.67);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    
    const container = e.currentTarget.parentElement;
    const containerRect = container.getBoundingClientRect();
    const newChatWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    if (newChatWidth >= 30 && newChatWidth <= 80) {
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
            <a 
              href="#" 
              className={`flex items-center py-3 rounded-lg hover:bg-blue-50 transition ${
                sidebarCollapsed 
                  ? 'justify-center px-2' 
                  : 'gap-3 px-4'
              }`}
              title="Files"
            >
              <img 
                src="https://unpkg.com/lucide-static@latest/icons/folder-open.svg" 
                className="w-5 h-5 flex-shrink-0" 
                alt="Files" 
              />
              {!sidebarCollapsed && <span>Files</span>}
            </a>
            
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
            
            <a 
              href="#" 
              className={`flex items-center py-3 rounded-lg text-blue-600 bg-blue-100 font-semibold ${
                sidebarCollapsed 
                  ? 'justify-center px-2' 
                  : 'gap-3 px-4'
              }`}
              title="Chat"
            >
              <img 
                src="https://unpkg.com/lucide-static@latest/icons/message-circle.svg" 
                className="w-5 h-5 flex-shrink-0" 
                alt="Chat" 
              />
              {!sidebarCollapsed && <span>Chat</span>}
            </a>
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
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-800">CodePilot AI Workspace</h1>
            </div>
            <div className="flex items-center gap-4">
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
                    <a href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition">
                      <img src="https://unpkg.com/lucide-static@latest/icons/settings.svg" className="w-4 h-4" alt="Settings" />
                      Settings
                    </a>
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

          <div 
            className={`flex-1 flex gap-6 p-6 ${codeEditorCollapsed ? 'h-auto' : 'h-96'}`} 
            onMouseMove={handleMouseMove}
          >
            {/* Enhanced AI Chat Interface */}
            <section 
              className={`bg-white rounded-2xl shadow flex flex-col ${codeEditorCollapsed ? 'min-h-[600px]' : 'h-full'}`}
              style={{ width: `${chatWidth}%` }}
            >
              <AIChat />
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
              className={`bg-white rounded-2xl shadow p-4 flex flex-col ${codeEditorCollapsed ? 'min-h-[600px]' : 'h-full'}`}
              style={{ width: `${100 - chatWidth - 1}%` }}
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <img src="https://unpkg.com/lucide-static@latest/icons/monitor.svg" className="w-5 h-5" alt="Preview" />
                Live Preview
              </h2>
              <div className="flex-1 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                App preview here
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Collapsible Code Editor */}
      <div className={`bg-white border-t shadow-lg transition-all duration-300 ${codeEditorCollapsed ? 'h-12' : 'h-80'}`}>
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <img src="https://unpkg.com/lucide-static@latest/icons/code.svg" className="w-5 h-5 text-gray-600" alt="Code" />
            <span className="font-semibold text-gray-800">Code Editor</span>
            <span className="text-sm text-gray-500">- src/App.tsx</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">
              Run
            </button>
            <button 
              onClick={() => setCodeEditorCollapsed(!codeEditorCollapsed)}
              className="p-1 hover:bg-gray-200 rounded"
              title={codeEditorCollapsed ? "Expand Editor" : "Collapse Editor"}
            >
              <img 
                src={`https://unpkg.com/lucide-static@latest/icons/${codeEditorCollapsed ? 'chevron-up' : 'chevron-down'}.svg`} 
                className="w-4 h-4 text-gray-600" 
                alt="Toggle" 
              />
            </button>
          </div>
        </div>
        
        {!codeEditorCollapsed && (
          <div className="flex-1 p-4 bg-gray-900 text-white font-mono text-sm overflow-auto">
            <div className="text-gray-400">
              {`// Your code editor here
import React from "react";

export default function App() {
  return (
    <div className="min-h-screen bg-blue-500 p-8">
      <h1 className="text-white text-4xl font-bold">
        Welcome to CodePilot AI!
      </h1>
    </div>
  );
}`}
            </div>
          </div>
        )}
      </div>

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
