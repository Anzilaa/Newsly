import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import { Home, Clock, Info, Moon, Sun, UserCircle, Menu, X } from 'lucide-react';

export default function Layout() {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/40 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-100/95 dark:bg-slate-950/95 backdrop-blur-md border-r border-slate-200 dark:border-slate-800 flex flex-col transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900 dark:text-indigo-400 font-serif">Newsly</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">News Categorizer</p>
          </div>
          <button 
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto">
          <NavItem to="/classify" icon={<Home className="w-5 h-5" />} label="Classify" />
          <NavItem to="/history" icon={<Clock className="w-5 h-5" />} label="History" />
          <NavItem to="/about" icon={<Info className="w-5 h-5" />} label="About" />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Topbar */}
        <header className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-10 pointer-events-none">
          {/* Left side: Hamburger menu (only visible on mobile) */}
          <div className="pointer-events-auto">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Right side: Tools */}
          <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              className="p-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
              title="Profile"
            >
              <UserCircle className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 pt-20 md:p-8 md:pt-10 bg-slate-50 dark:bg-slate-900 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          isActive
            ? 'bg-indigo-100/70 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 font-medium'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
