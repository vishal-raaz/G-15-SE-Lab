import { NavLink } from 'react-router-dom';
import { usePaper } from '../context/PaperContext';

const navItems = [
  {
    to: '/',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    label: 'Dashboard',
  },
  {
    to: '/generator',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    label: 'AI Generator',
  },
  {
    to: '/builder',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    label: 'Paper Builder',
    badge: true,
  },
  {
    to: '/preview',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    label: 'Paper Preview',
  },
];

export default function Sidebar() {
  const { selectedQuestions } = usePaper();

  return (
    <aside className="w-64 shrink-0 h-screen bg-surface-900 border-r border-surface-800 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-surface-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shrink-0">
            <span className="text-lg">📝</span>
          </div>
          <div>
            <p className="font-bold text-surface-50 text-sm leading-tight">AI Question</p>
            <p className="font-bold text-surface-50 text-sm leading-tight">Paper Generator</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider px-3 mb-3">Menu</p>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
               ${isActive
                ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'}`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`transition-colors ${isActive ? 'text-primary-400' : 'text-surface-500 group-hover:text-surface-300'}`}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge && selectedQuestions.length > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-primary-500 text-white">
                    {selectedQuestions.length}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-surface-800">
        <div className="px-3 py-2 rounded-xl bg-surface-800/50">
          <p className="text-xs text-surface-500">SE & Design Principles</p>
          <p className="text-xs font-medium text-surface-400 mt-0.5">College Project — 2025</p>
        </div>
      </div>
    </aside>
  );
}
