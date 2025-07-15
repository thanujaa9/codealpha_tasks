import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav
      className={`w-full px-6 py-3 flex items-center justify-between border-b transition-colors duration-300
        bg-white dark:bg-neutral-800
        text-neutral-900 dark:text-neutral-50
        border-neutral-200 dark:border-neutral-700
        shadow-md`}
    >
      <div className="flex items-center space-x-6">
        <Link
          to="/dashboard"
          className={`text-2xl font-extrabold tracking-tight transition-colors duration-200
            text-primary-700 dark:text-primary-400
            hover:text-primary-500 dark:hover:text-primary-300`}
        >
          🏠 Dashboard
        </Link>
        <Link
          to="/projects"
          className={`text-lg font-semibold transition-colors duration-200
            text-neutral-700 dark:text-neutral-200
            hover:text-primary-500 dark:hover:text-primary-300`}
        >
          Projects
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200
            bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600
            text-neutral-800 dark:text-neutral-50
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900`}
        >
          {isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>

        {isAuthenticated && (
          <>
            <button
              onClick={() => navigate('/profile')}
              className={`flex items-center px-3 py-1 rounded-full font-medium text-sm shadow-md transition-all duration-200
                bg-primary-100 hover:bg-primary-200 dark:bg-primary-700 dark:hover:bg-primary-600
                text-primary-800 dark:text-primary-100
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900`}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold mr-2
                  bg-primary-500 dark:bg-primary-200
                  text-white dark:text-primary-900`}
              >
                {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>
              {user?.username || user?.email || 'User'}
            </button>

            <button
              onClick={handleLogout}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm shadow-md transition-all duration-200
                bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700
                text-white
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900`}
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
