// src/components/Sidebar.tsx
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { 
  LayoutDashboard, 
  Utensils, 
  Dumbbell, 
  User, 
  Activity, 
  LogOut,
  Scale 
} from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/meal-planner', icon: Utensils, label: 'Meal Planner' },
    { path: '/workout-tracker', icon: Dumbbell, label: 'Workout' },
    { path: '/progress', icon: Activity, label: 'Progress' },
    { path: '/bmi', icon: Scale, label: 'BMI' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b dark:border-gray-700">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">FitAI</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}