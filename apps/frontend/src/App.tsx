import React from 'react';

const recentApps = [
  {
    name: 'PrintPilotManager',
    status: 'Deployed',
    time: '11 minutes ago',
    icon: 'printer',
    private: false,
  },
  {
    name: 'SwagPortal',
    status: 'Private',
    time: '1 month ago',
    icon: 'user',
    private: true,
  },
  {
    name: 'RepAI',
    status: 'Deployed',
    time: '1 week ago',
    icon: 'cpu',
    private: false,
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-[#23252b] flex flex-col">
      {/* Top Bar */}
      <header className="w-full flex items-center h-12 px-4 border-b border-[#35373e]">
        <img
          src="https://unpkg.com/lucide-static@latest/icons/rocket.svg"
          alt="CodePilot Logo"
          className="h-6 w-6 mr-2"
        />
        <span className="text-white font-semibold text-lg tracking-tight">CodePilot</span>
        <div className="flex-1" />
        <button className="rounded-full bg-[#2c2e34] p-2 hover:bg-[#35373e] transition">
          <img
            src="https://unpkg.com/lucide-static@latest/icons/bell.svg"
            alt="Notifications"
            className="h-5 w-5"
          />
        </button>
        <button className="rounded-full bg-[#2c2e34] p-2 ml-2 hover:bg-[#35373e] transition">
          <img
            src="https://unpkg.com/lucide-static@latest/icons/user.svg"
            alt="User"
            className="h-5 w-5"
          />
        </button>
      </header>

      <main className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-[#23252b] border-r border-[#35373e] flex flex-col py-4 px-2">
          <button className="w-full flex items-center px-3 py-2 mb-2 bg-[#2c2e34] hover:bg-[#35373e] rounded-lg text-white font-medium gap-2">
            <img src="https://unpkg.com/lucide-static@latest/icons/plus.svg" className="h-5 w-5" alt="Create App" />
            Create App
          </button>
          <button className="w-full flex items-center px-3 py-2 mb-6 bg-[#2c2e34] hover:bg-[#35373e] rounded-lg text-white font-medium gap-2">
            <img src="https://unpkg.com/lucide-static@latest/icons/import.svg" className="h-5 w-5" alt="Import" />
            Import code or design
          </button>
          <nav className="flex flex-col gap-1">
            <a href="#" className="flex items-center px-3 py-2 rounded-lg bg-[#282a31] text-white font-medium gap-2">
              <img src="https://unpkg.com/lucide-static@latest/icons/home.svg" className="h-5 w-5" alt="Home" />
              Home
            </a>
            <a href="#" className="flex items-center px-3 py-2 rounded-lg text-gray-400 hover:bg-[#282a31] gap-2">
              <img src="https://unpkg.com/lucide-static@latest/icons/grid.svg" className="h-5 w-5" alt="Apps" />
              Apps
            </a>
            <a href="#" className="flex items-center px-3 py-2 rounded-lg text-gray-400 hover:bg-[#282a31] gap-2">
              <img src="https://unpkg.com/lucide-static@latest/icons/server.svg" className="h-5 w-5" alt="Deployments" />
              Deployments
            </a>
            <a href="#" className="flex items-center px-3 py-2 rounded-lg text-gray-400 hover:bg-[#282a31] gap-2">
              <img src="https://unpkg.com/lucide-static@latest/icons/bar-chart-2.svg" className="h-5 w-5" alt="Usage" />
              Usage
            </a>
            <a href="#" className="flex items-center px-3 py-2 rounded-lg text-gray-400 hover:bg-[#282a31] gap-2">
              <img src="https://unpkg.com/lucide-static@latest/icons/users.svg" className="h-5 w-5" alt="Teams" />
              Teams
            </a>
          </nav>
          <div className="mt-8 px-2">
            <div className="text-xs uppercase text-[#7c7f8a] font-semibold mb-2">Explore CodePilot</div>
            <a href="#" className="flex items-center px-3 py-2 rounded-lg text-gray-400 hover:bg-[#282a31] gap-2">
              <img src="https://unpkg.com/lucide-static@latest/icons/target.svg" className="h-5 w-5" alt="Bounties" />
              Bounties
            </a>
            <a href="#" className="flex items-center px-3 py-2 rounded-lg text-gray-400 hover:bg-[#282a31] gap-2">
              <img src="https://unpkg.com/lucide-static@latest/icons/layers.svg" className="h-5 w-5" alt="Templates" />
              Templates
            </a>
            <a href="#" className="flex items-center px-3 py-2 rounded-lg text-gray-400 hover:bg-[#282a31] gap-2">
              <img src="https://unpkg.com/lucide-static@latest/icons/book.svg" className="h-5 w-5" alt="Learn" />
              Learn
            </a>
            <a href="#" className="flex items-center px-3 py-2 rounded-lg text-gray-400 hover:bg-[#282a31] gap-2">
              <img src="https://unpkg.com/lucide-static@latest/icons/file-text.svg" className="h-5 w-5" alt="Documentation" />
              Documentation
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-xl flex flex-col items-center mt-20">
            <h1 className="text-2xl font-bold text-white mb-2">Hi Trent, what do you want to make?</h1>
            <div className="w-full flex flex-col items-center">
              <input
                className="w-full px-4 py-3 rounded-lg bg-[#2c2e34] text-white text-lg placeholder-[#7c7f8a] border border-[#35373e] focus:outline-none focus:border-[#4f8cff] transition"
                placeholder="Describe an app or site you want to create..."
              />
              <div className="flex flex-row items-center gap-2 mt-3 w-full justify-end">
                <select className="bg-[#23252b] text-gray-400 border border-[#35373e] rounded-lg px-3 py-2 text-sm">
                  <option>App type: Auto</option>
                  <option>Web App</option>
                  <option>API</option>
                  <option>Mobile</option>
                </select>
                <button className="ml-2 px-4 py-2 rounded-lg bg-[#4f8cff] text-white font-semibold hover:bg-[#357ae8] transition">
                  Start creating
                </button>
              </div>
              <div className="flex flex-row gap-2 mt-4">
                <button className="px-3 py-1 rounded-full bg-[#282a31] text-gray-400 text-xs font-medium hover:bg-[#35373e] transition">Book scanner</button>
                <button className="px-3 py-1 rounded-full bg-[#282a31] text-gray-400 text-xs font-medium hover:bg-[#35373e] transition">Link in bio</button>
                <button className="px-3 py-1 rounded-full bg-[#282a31] text-gray-400 text-xs font-medium hover:bg-[#35373e] transition">Local landmarks map</button>
              </div>
            </div>
          </div>

          {/* Recent Apps */}
          <div className="w-full max-w-xl mt-16">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white font-semibold text-lg">Your recent Apps</div>
              <a href="#" className="text-[#4f8cff] text-sm font-medium hover:underline">View All</a>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {recentApps.map((app, idx) => (
                <div key={idx} className="bg-[#2c2e34] rounded-lg p-4 flex flex-col items-start border border-[#35373e]">
                  <div className="flex items-center mb-2">
                    <img
                      src={`https://unpkg.com/lucide-static@latest/icons/${app.icon}.svg`}
                      alt={app.name}
                      className="h-5 w-5 mr-2"
                    />
                    <span className="text-white font-medium">{app.name}</span>
                    {app.private && (
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-[#35373e] text-xs text-gray-400">Private</span>
                    )}
                  </div>
                  <div className="text-xs text-[#7c7f8a]">{app.time}</div>
                  <div className="mt-2">
                    <span className={`text-xs font-medium ${app.status === "Deployed" ? "text-green-400" : "text-gray-400"}`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
