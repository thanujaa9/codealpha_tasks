import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function DashboardPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading, user } = useAuth();

  const [totalProjects, setTotalProjects] = useState(0);
  const [userTaskCount, setUserTaskCount] = useState(0);
  const [quote, setQuote] = useState('');
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem('token');

        const [projectsRes, userTasksRes] = await Promise.all([
          axios.get('http://localhost:5174/api/projects/count', {
            headers: { 'x-auth-token': token },
          }),
          axios.get('http://localhost:5174/api/tasks/count/user', {
            headers: { 'x-auth-token': token },
          }),
        ]);

        setTotalProjects(projectsRes.data.totalProjects);
        setUserTaskCount(userTasksRes.data.totalTasks);
      } catch (error) {
        console.error('Error fetching dashboard counts:', error);
      }
    };

    if (isAuthenticated) {
      fetchCounts();
    }

    const quotes = [
      "Success is the sum of small efforts, repeated day in and day out.",
      "Focus on being productive instead of busy.",
      "Don’t watch the clock; do what it does. Keep going.",
      "Small progress is still progress.",
      "You don’t need a new plan. You need to commit to the one you have.",
      "The secret of getting ahead is getting started.",
      "Start where you are. Use what you have. Do what you can.",
      "Discipline is the bridge between goals and accomplishment.",
      "Don’t wait for opportunity. Create it.",
      "Done is better than perfect.",
      "You don’t have to be great to start, but you have to start to be great.",
      "It always seems impossible until it’s done.",
      "Action is the foundational key to all success.",
      "Push yourself, because no one else is going to do it for you.",
      "Wake up with determination. Go to bed with satisfaction.",
      "Motivation gets you going, but discipline keeps you growing.",
      "A year from now you’ll wish you had started today.",
      "Work hard in silence. Let success make the noise.",
      "The future depends on what you do today.",
      "If you get tired, learn to rest — not to quit."
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, [isAuthenticated]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 p-6 sm:p-10">

      {/* Welcome Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-gray-200 mb-4">
          Welcome back, {user?.username || user?.email || 'Project Hero'}!
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
          Manage your tasks and track all your projects in one place.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
        {/* Your Tasks */}
        <div
          onClick={() => navigate('/my-tasks')}
          className="cursor-pointer bg-white dark:bg-neutral-800 p-6 sm:p-8 rounded-xl shadow-md hover:shadow-lg transition duration-200 text-center border-l-4 border-purple-600"
        >
          <h2 className="text-3xl font-bold text-purple-700 dark:text-purple-400 mb-2">{userTaskCount}</h2>
          <p className="text-gray-700 dark:text-gray-300">Your Tasks</p>
        </div>

        {/* Total Projects */}
        <div
          onClick={() => navigate('/projects')}
          className="cursor-pointer bg-white dark:bg-neutral-800 p-6 sm:p-8 rounded-xl shadow-md hover:shadow-lg transition duration-200 text-center border-l-4 border-blue-600"
        >
          <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-2">{totalProjects}</h2>
          <p className="text-gray-700 dark:text-gray-300">Total Projects</p>
        </div>

        {/* View All Projects */}
        <div
          onClick={() => navigate('/projects')}
          className="cursor-pointer bg-white dark:bg-neutral-800 p-6 sm:p-8 rounded-xl shadow-md hover:shadow-lg transition duration-200 text-center border-l-4 border-cyan-600"
        >
          <h2 className="text-3xl font-bold text-cyan-700 dark:text-cyan-400 mb-2">📁 View Projects</h2>
          <p className="text-gray-700 dark:text-gray-300">Browse all your active projects</p>
        </div>
      </div>

      {/* Tip + Buttons (left) and Calendar (right) */}
      <div className="flex flex-col lg:flex-row justify-center gap-8 max-w-6xl mx-auto mb-16">
        {}
        <div className="flex-1 space-y-6">
          {}
          <div className="bg-white dark:bg-neutral-800 border-l-4 border-blue-500 dark:border-blue-400 shadow-md rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-blue-600 dark:text-blue-400 text-2xl">💡</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Tip of the Day
              </h3>
            </div>
            <p className="text-base italic text-gray-700 dark:text-gray-300 leading-relaxed">
              "{quote}"
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/tasks/due-today')}
              className="w-full sm:w-auto px-5 py-3 border border-rose-600 text-rose-600 dark:text-rose-400 dark:border-rose-400 bg-white dark:bg-neutral-800 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900 transition"
            >
              🔔 View Tasks Due Today
            </button>

            <button
              onClick={() => navigate('/projects/due-today')}
              className="w-full sm:w-auto px-5 py-3 border border-green-600 text-green-600 dark:text-green-400 dark:border-green-400 bg-white dark:bg-neutral-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-900 transition"
            >
              📆 View Projects Due Today
            </button>
          </div>
        </div>

        {/* Right Side: Calendar */}
        <div className="flex-1 max-w-sm mx-auto bg-white dark:bg-neutral-800 shadow-md rounded-xl p-6">
          <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-100 mb-4">
            📅 Calendar
          </h3>
          <Calendar
            onChange={setDate}
            value={date}
            className="!border-0 !w-full !bg-transparent dark:!text-white"
          />
        </div>
      </div>

    </div>
  );
}

export default DashboardPage;
