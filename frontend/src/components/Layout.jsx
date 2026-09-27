import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router";
import {
  Home,
  Clock,
  Info,
  Moon,
  Sun,
  UserCircle,
  Menu,
  X,
} from "lucide-react";

export default function Layout() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("newsly_theme") === "dark";
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("newsly_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("newsly_theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#08090C] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 p-0 md:p-3">
      {/* Outer Framing Container without green glow */}
      <div className="flex-1 flex h-full w-full rounded-none md:rounded-3xl border border-slate-200/80 dark:border-white/5 overflow-hidden bg-white dark:bg-[#0D0E12] transition-colors">
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-30 lg:hidden transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-50/90 dark:bg-[#12141A] backdrop-blur-md border-r border-slate-200/80 dark:border-white/5 flex flex-col transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
        >
          {/* Brand Header */}
          <div className="p-6 pb-4 flex justify-between items-center border-b border-slate-200/50 dark:border-white/5">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">
                Newsly
              </h1>
            </div>
            <button
              className="lg:hidden p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Sections */}
          <nav className="flex-1 px-4 space-y-6 mt-4 overflow-y-auto">
            <div>
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                General
              </div>
              <div className="space-y-1">
                <NavItem
                  to="/classify"
                  icon={<Home className="w-4 h-4" />}
                  label="Classify"
                  onNavigate={() => setIsMobileMenuOpen(false)}
                />
                <NavItem
                  to="/history"
                  icon={<Clock className="w-4 h-4" />}
                  label="History"
                  onNavigate={() => setIsMobileMenuOpen(false)}
                />
                <NavItem
                  to="/about"
                  icon={<Info className="w-4 h-4" />}
                  label="About"
                  onNavigate={() => setIsMobileMenuOpen(false)}
                />
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col overflow-hidden relative bg-white dark:bg-[#0D0E12]">
          {/* Topbar Header */}
          <header className="px-6 py-2.5 flex justify-between items-center bg-white/80 dark:bg-[#0D0E12]/80 backdrop-blur-md z-10">
            {/* Left side: Mobile menu toggle only */}
            <div>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-[#181A22] text-slate-600 dark:text-slate-300"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Right Tools: Profile & Theme Toggle */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-[#161821] border border-slate-200/80 dark:border-white/5 hover:bg-slate-200/70 dark:hover:bg-[#1F222E] transition-all text-slate-700 dark:text-slate-300 cursor-pointer"
                title="Toggle Theme"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )}
              </button>

              <button
                className="p-2 rounded-xl bg-slate-100 dark:bg-[#161821] border border-slate-200/80 dark:border-white/5 hover:bg-slate-200/70 dark:hover:bg-[#1F222E] transition-all text-slate-700 dark:text-slate-300 cursor-pointer"
                title="Profile"
              >
                <UserCircle className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Viewport Content */}
          <main className="flex-1 overflow-y-auto px-4 py-3 md:px-8 md:py-4 bg-white dark:bg-[#0D0E12] w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
          isActive
            ? "bg-slate-100 dark:bg-[#1B1E28] text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 dark:border-emerald-500/40 font-semibold shadow-xs"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-[#161821] hover:text-slate-900 dark:hover:text-slate-200"
        }`
      }
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
    </NavLink>
  );
}
