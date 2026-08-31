import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const pageTitles = {
  '/': 'Dashboard',
  '/generator': 'AI Question Generator',
  '/builder': 'Paper Builder',
  '/preview': 'Paper Preview',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] || 'AI Question Paper Generator';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 shrink-0 bg-surface-900/80 backdrop-blur border-b border-surface-800 flex items-center justify-between px-6 z-10">
      {/* Page title */}
      <div>
        <h1 className="text-base font-semibold text-surface-50">{title}</h1>
        <p className="text-xs text-surface-500 mt-0.5">AI-Based Question Paper Generator</p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'T'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-surface-200">{user?.name || 'Teacher'}</p>
            <p className="text-xs text-surface-500">{user?.email || ''}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          id="btn-logout"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-surface-400
                     hover:text-surface-200 hover:bg-surface-800 transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
