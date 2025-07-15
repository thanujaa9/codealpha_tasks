import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function MyTasksPage() {
  const [tasks, setTasks] = useState([]);
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5174/api/tasks/user', {
          headers: { 'x-auth-token': token },
        });
        setTasks(res.data);
      } catch (error) {
        console.error('Error fetching my tasks:', error);
      }
    };

    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  const handleDelete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5174/api/tasks/${taskId}`, {
        headers: { 'x-auth-token': token },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (loading) return <p className="text-center mt-10 text-neutral-600 dark:text-neutral-300">Loading...</p>;

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 p-6 sm:p-10">

      {/* Back Button */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-purple-600 dark:border-purple-400 text-purple-700 dark:text-purple-300 bg-transparent rounded-full hover:bg-purple-100 dark:hover:bg-purple-900 transition duration-200"
        >
          ⬅️ Back to Dashboard
        </button>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-extrabold text-center mb-12">
        📝 My Assigned Tasks
      </h1>

      {/* Task Cards */}
      {tasks.length === 0 ? (
        <p className="text-center text-lg text-neutral-600 dark:text-neutral-300">No tasks assigned to you.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="backdrop-blur-sm bg-white/60 dark:bg-neutral-800/60 border border-neutral-300 dark:border-neutral-700 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              <div className="mb-3">
                <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">{task.title}</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  <span className="font-medium">Status:</span> {task.status}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  <span className="font-medium">Project:</span> {task.project?.title || 'No Project'}
                </p>
              </div>

              <p className="text-sm italic text-neutral-700 dark:text-neutral-300 mb-4">
                {task.description}
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate(`/tasks/${task._id}`)}
                  className="px-3 py-1.5 border border-blue-500 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900 transition"
                >
                  View
                </button>

                <button
                  onClick={() => navigate(`/tasks/${task._id}/edit`)}
                  className="px-3 py-1.5 border border-yellow-500 text-yellow-600 dark:text-yellow-400 rounded-md hover:bg-yellow-50 dark:hover:bg-yellow-900 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(task._id)}
                  className="px-3 py-1.5 border border-red-500 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {}
      <div className="mt-16 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Keep managing your tasks efficiently 🚀
      </div>
    </div>
  );
}

export default MyTasksPage;
