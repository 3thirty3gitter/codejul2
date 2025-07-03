import React, { useState } from "react";

// Sidebar navigation items
const navItems = [
  { label: "Dashboard", icon: "layout-dashboard" },
  { label: "Projects", icon: "folder-open" },
  { label: "Team", icon: "users" },
  { label: "Reports", icon: "bar-chart-2" },
  { label: "Settings", icon: "settings" },
];

// Sample dashboard cards
const cards = [
  {
    title: "Active Users",
    value: "1,245",
    icon: "users",
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Tasks Completed",
    value: "3,870",
    icon: "check-circle",
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Open Projects",
    value: "12",
    icon: "folder-open",
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "System Health",
    value: "Good",
    icon: "activity",
    color: "bg-teal-100 text-teal-600",
  },
];

export default function BeautifulFrontendUI() {
  const [selectedNav, setSelectedNav] = useState("Dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 font-inter flex">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 bg-white shadow-xl flex flex-col items-center md:items-stretch py-6 px-2 md:px-0 transition-all duration-300">
        <div className="mb-8 flex flex-col items-center">
          <img
            src="https://unpkg.com/lucide-static@latest/icons/rocket.svg"
            alt="Logo"
            className="w-10 h-10 mb-2"
          />
          <span className="text-lg font-bold tracking-wide hidden md:block">CodePilot</span>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map(item => (
            <button
              key={item.label}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium group
                ${selectedNav === item.label
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"}
              `}
              onClick={() => setSelectedNav(item.label)}
            >
              <img
                src={`https://unpkg.com/lucide-static@latest/icons/${item.icon}.svg`}
                alt={item.label}
                className="w-6 h-6"
              />
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-8">
          <button className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all">
            <img
              src="https://unpkg.com/lucide-static@latest/icons/log-out.svg"
              alt="Logout"
              className="w-5 h-5"
            />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col px-4 md:px-12 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{selectedNav}</h1>
            <p className="text-gray-500 mt-1">Welcome back, Developer! Here’s your latest overview.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-all">
            <img
              src="https://unpkg.com/lucide-static@latest/icons/plus.svg"
              alt="Add"
              className="w-5 h-5"
            />
            <span>New</span>
          </button>
        </header>
        {/* Dashboard Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {cards.map(card => (
            <div
              key={card.title}
              className={`rounded-xl shadow-lg p-6 flex items-center gap-4 bg-white hover:scale-105 transition-transform duration-200 group`}
            >
              <div className={`rounded-full p-3 ${card.color} shadow`}>
                <img
                  src={`https://unpkg.com/lucide-static@latest/icons/${card.icon}.svg`}
                  alt={card.title}
                  className="w-7 h-7"
                />
              </div>
              <div>
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="text-gray-500">{card.title}</div>
              </div>
            </div>
          ))}
        </section>
        {/* Quick Actions */}
        <section className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row items-center gap-4">
          <h2 className="text-xl font-semibold text-slate-800 flex-1">Quick Actions</h2>
          <div className="flex gap-3 flex-wrap">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow hover:bg-blue-600 transition-all">
              <img
                src="https://unpkg.com/lucide-static@latest/icons/user-plus.svg"
                alt="Add User"
                className="w-5 h-5"
              />
              Add User
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold shadow hover:bg-green-600 transition-all">
              <img
                src="https://unpkg.com/lucide-static@latest/icons/file-bar-chart-2.svg"
                alt="Report"
                className="w-5 h-5"
              />
              Generate Report
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold shadow hover:bg-gray-300 transition-all">
              <img
                src="https://unpkg.com/lucide-static@latest/icons/settings.svg"
                alt="Settings"
                className="w-5 h-5"
              />
              Settings
            </button>
          </div>
        </section>
        {/* Footer */}
        <footer className="mt-12 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} CodePilot. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
