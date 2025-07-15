import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return null;
  }

  const initials = user.username
    ? user.username.split(' ').map(n => n[0]).join('').toUpperCase()
    : (user.email ? user.email[0].toUpperCase() : 'U');

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={() => navigate('/profile')}
        className="flex items-center space-x-2 p-2 rounded-full
                   bg-white dark:bg-neutral-700
                   border border-neutral-300 dark:border-neutral-600
                   shadow-md
                   hover:bg-neutral-100 dark:hover:bg-neutral-600
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900
                   transition-all duration-300 ease-in-out"
      >
        <div className="w-8 h-8 rounded-full bg-primary-200 dark:bg-primary-500 flex items-center justify-center text-primary-900 dark:text-white font-bold text-sm">
          {initials}
        </div>
        <span className="text-neutral-800 dark:text-neutral-200 text-sm font-medium hidden sm:block">
          {user.username || user.email}
        </span>
      </button>
    </div>
  );
}

export default UserProfile;
