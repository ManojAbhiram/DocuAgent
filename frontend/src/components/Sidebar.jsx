import { NavLink } from 'react-router-dom';
import { Home, FileText, Briefcase, Receipt, Moon, Sun, ShieldCheck, LineChart, LogOut, User as UserIcon } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ toggleTheme, theme }) {
  const { user, logout } = useAuth();
  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Documents', icon: FileText, path: '/documents' },
    { name: 'Contract Analyzer', icon: Briefcase, path: '/contracts' },
    { name: 'Invoice Auditor', icon: Receipt, path: '/invoices' },
    { name: 'Financial Analyzer', icon: LineChart, path: '/financial' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-dark-800 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-sm transition-colors duration-200">
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <ShieldCheck className="w-8 h-8 text-primary-600 dark:text-primary-500 mr-3" />
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
          DocuAgent
        </span>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
              isActive 
                ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400" 
                : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-dark-700 dark:hover:text-slate-200"
            )}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        {user && (
          <div className="flex items-center px-4 py-3 mb-2 bg-slate-100 dark:bg-dark-700/50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mr-3 font-bold">
              {user.email ? user.email[0].toUpperCase() : <UserIcon className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.email}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role} Role</p>
            </div>
          </div>
        )}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-dark-900 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-700 transition-colors"
        >
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors group"
        >
          <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
