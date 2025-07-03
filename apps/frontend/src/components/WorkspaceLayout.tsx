import React from "react";

export default function WorkspaceLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-200 font-inter flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-xl px-6 py-8 rounded-tr-3xl rounded-br-3xl">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 mb-12">
          <img
            src="https://unpkg.com/lucide-static@latest/icons/rocket.svg"
            alt="Logo"
            className="w-8 h-8"
          />
          <span className="text-xl font-bold tracking-wide text-blue-700">CodePilot</span>
        </div>
        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-2">
          <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-blue-600 bg-blue-100 font-semibold">
            <img src="https://unpkg.com/lucide-static@latest/icons/home.svg" className="w-5 h-5" alt="Home" />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 transition">
            <img src="https://unpkg.com/lucide-static@latest/icons/folder-open.svg" className="w-5 h-5" alt="Files" />
            Files
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 transition">
            <img src="https://unpkg.com/lucide-static@latest/icons/git-branch.svg" className="w-5 h-5" alt="Version Control" />
            Version Control
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 transition">
            <img src="https://unpkg.com/lucide-static@latest/icons/message-circle.svg" className="w-5 h-5" alt="Chat" />
            Chat
          </a>
        </nav>
        {/* Sidebar Footer */}
        <div className="mt-auto">
          <button className="w-full flex items-center gap-2 py-2 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all">
            <img src="https://unpkg.com/lucide-static@latest/icons/log-out.svg" className="w-5 h-5" alt="Logout" />
            Logout
          </button>
        </div>
      </aside>
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
          <div className="flex items-center gap-2">
            <img src="https://unpkg.com/lucide-static@latest/icons/layout-dashboard.svg" className="w-6 h-6 text-blue-600" alt="Dashboard" />
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-all">
              <img src="https://unpkg.com/lucide-static@latest/icons/plus.svg" className="w-5 h-5" alt="Add" />
              New
            </button>
            <img src="https://unpkg.com/lucide-static@latest/icons/user.svg" className="w-8 h-8 rounded-full bg-blue-100 p-1" alt="User" />
          </div>
        </header>
        {/* Workspace Panels */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
          {/* File Explorer */}
          <section className="col-span-1 bg-white rounded-2xl shadow p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <img src="https://unpkg.com/lucide-static@latest/icons/folder-open.svg" className="w-5 h-5" alt="Files" />
              Files
            </h2>
            <ul className="flex-1 space-y-2 text-sm text-gray-700">
              <li className="px-3 py-2 rounded-lg bg-blue-50 font-medium">src/App.tsx</li>
              <li className="px-3 py-2 rounded-lg hover:bg-blue-50">src/components/WorkspaceLayout.tsx</li>
              <li className="px-3 py-2 rounded-lg hover:bg-blue-50">src/styles/index.css</li>
            </ul>
          </section>
          {/* Code Editor */}
          <section className="col-span-2 bg-gray-900 rounded-2xl shadow flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
              <span className="text-white font-semibold">Code Editor</span>
              <button className="px-3 py-1 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">Run</button>
            </div>
            <div className="flex-1 p-4">
              <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                Your code editor here
              </div>
            </div>
          </section>
          {/* Live Preview */}
          <section className="col-span-1 bg-white rounded-2xl shadow p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <img src="https://unpkg.com/lucide-static@latest/icons/monitor.svg" className="w-5 h-5" alt="Preview" />
              Live Preview
            </h2>
            <div className="flex-1 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
              App preview here
            </div>
          </section>
        </div>
        {/* Footer */}
        <footer className="text-center text-gray-400 text-sm py-4 bg-transparent">
          &copy; {new Date().getFullYear()} CodePilot. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
