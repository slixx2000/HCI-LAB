import { Link, useLocation } from 'react-router-dom';

export default function SideNavBar() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/event/')
    }

    if (path === '/feedback') {
      return location.pathname === '/feedback' || location.pathname.startsWith('/feedback/')
    }

    return location.pathname === path
  }
  
  return (
    <aside className="hidden lg:flex flex-col gap-4 p-6 w-64 fixed top-20 h-[calc(100vh-5rem)] bg-slate-50 dark:bg-slate-950 border-r-0 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-blue-800 dark:text-blue-300">University Events</h2>
        <p className="text-xs text-on-surface-variant/70 font-medium">The Digital Curator</p>
      </div>
      
      <div className="space-y-1">
        <Link 
          to="/" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-transform duration-200 ${
            isActive('/') 
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-semibold' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-x-1'
          }`}
        >
          <span className="material-symbols-outlined">home</span>
          <span>Home</span>
        </Link>
        
        <Link 
          to="/calendar" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-transform duration-200 ${
            isActive('/calendar')
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-x-1'
          }`}
        >
          <span className="material-symbols-outlined">calendar_today</span>
          <span>Calendar</span>
        </Link>
        
        <Link 
          to="/registered" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-transform duration-200 ${
            isActive('/registered')
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-x-1'
          }`}
        >
          <span className="material-symbols-outlined">event_available</span>
          <span>Registered</span>
        </Link>
        
        <Link 
          to="/feedback" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-transform duration-200 ${
            isActive('/feedback')
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-semibold' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-x-1'
          }`}
        >
          <span className="material-symbols-outlined">rate_review</span>
          <span>Feedback</span>
        </Link>
      </div>
      
      <div className="mt-auto pt-6">
        <Link
          to="/profile"
          className="w-full inline-flex items-center justify-center py-3 rounded-xl bg-surface-container-high text-on-surface-variant font-semibold transition-colors hover:bg-surface-container-highest"
        >
          Profile
        </Link>
      </div>
    </aside>
  );
}
