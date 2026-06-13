import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, Clock, Users, Bell, BarChart3 } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/record/new', icon: PlusCircle, label: '记录' },
  { path: '/timeline', icon: Clock, label: '时间轴' },
  { path: '/members', icon: Users, label: '成员' },
  { path: '/reminders', icon: Bell, label: '提醒' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-primary bg-primary bg-opacity-10'
                  : 'text-muted hover:text-text'
              }`
            }
          >
            <Icon className="w-6 h-6 mb-1" strokeWidth={2} />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
