import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    } else if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [isAuthenticated, loading, navigate, user]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50">
        <p>Loading profile...</p>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      console.log("Simulating saving profile:", formData);
      setMessage("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error saving profile:", error.response?.data || error.message);
      setMessage(error.response?.data?.msg || "Failed to update profile.");
    }
  };

  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-10 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl shadow-xl font-sans text-neutral-800 dark:text-neutral-50">
      <h2 className="text-4xl font-semibold text-center text-primary-700 dark:text-primary-400 mb-8 tracking-tight">Your Profile</h2>

      <div className="flex flex-col items-center mb-8">
        <div className="w-28 h-28 rounded-full bg-primary-200 dark:bg-primary-500 flex items-center justify-center text-primary-900 dark:text-white font-bold text-5xl mb-4 shadow-inner">
          {user?.username ? user.username[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'U')}
        </div>
        <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{user?.username || 'N/A'}</p>
        <p className="text-neutral-600 dark:text-neutral-200 text-md">{user?.email || 'N/A'}</p>
      </div>

      {message && <p className={`mb-4 text-center text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}

      {!editMode ? (
        <div className="space-y-4">
          <p className="text-lg"><span className="font-semibold text-neutral-700 dark:text-neutral-100">Username:</span> {user?.username || 'Not set'}</p>
          <p className="text-lg"><span className="font-semibold text-neutral-700 dark:text-neutral-100">Email:</span> {user?.email || 'Not set'}</p>
          <p className="text-lg break-all"><span className="font-semibold text-neutral-700 dark:text-neutral-100">User ID:</span> {user?.userId}</p>
          <p className="text-lg"><span className="font-semibold text-neutral-700 dark:text-neutral-100">Account Created:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>

          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
            <button
              onClick={handleReturnToDashboard}
              className="w-full sm:w-1/2 bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 font-bold py-3 px-6 rounded-lg shadow-md transition-colors duration-300"
            >
              Return to Dashboard
            </button>
            <button
              onClick={() => setEditMode(true)}
              className="w-full sm:w-1/2 bg-accent-600 hover:bg-accent-700 dark:bg-accent-500 dark:hover:bg-accent-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors duration-300"
            >
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div>
            <label className="block text-left text-neutral-800 dark:text-neutral-100 text-sm font-medium mb-2" htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              className="shadow-sm appearance-none border border-neutral-300 dark:border-neutral-600 rounded-lg w-full py-2.5 px-4 text-neutral-900 dark:text-neutral-50 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition-all duration-200 ease-in-out"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-left text-neutral-800 dark:text-neutral-100 text-sm font-medium mb-2" htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              className="shadow-sm appearance-none border border-neutral-300 dark:border-neutral-600 rounded-lg w-full py-2.5 px-4 text-neutral-900 dark:text-neutral-50 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition-all duration-200 ease-in-out"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="w-full sm:w-auto bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold py-2.5 px-6 rounded-lg shadow-md transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition-colors duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ProfilePage;
