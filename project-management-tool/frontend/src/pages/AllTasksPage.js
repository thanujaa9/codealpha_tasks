import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AllTasksPage() {
  const [tasks, setTasks] = useState([]);
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5174/api/tasks', {
          headers: { 'x-auth-token': token },
        });
        setTasks(res.data);
      } catch (error) {
        console.error('Error fetching all tasks:', error);
      }
    };

    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-purple-100 to-pink-100 dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-950 p-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-5 py-2 bg-gradient-to-r from-yellow-500 to-pink-500 text-white rounded-full shadow hover:scale-105 transition-transform duration-200"
      >
        ⬅️ Back
      </button>

      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-center text-neutral-800 dark:text-neutral-100 mb-10">
        📋 All Tasks
      </h1>

      {tasks.length === 0 ? (
        <p className="text-center text-lg text-neutral-600 dark:text-neutral-300">No tasks found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-md hover:shadow-yellow-300 transform hover:scale-[1.02] transition-all duration-200"
            >
              <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">{task.title}</h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-1">
                <span className="font-semibold">Status:</span> {task.status}
              </p>
              <p className="text-neutral-600 dark:text-neutral-300 mb-1">
                <span className="font-semibold">Project:</span> {task.project?.title || 'No Project'}
              </p>
              <p className="text-neutral-600 dark:text-neutral-300 mb-1">
                <span className="font-semibold">Assigned To:</span> {task.assignedTo?.username || 'Unassigned'}
              </p>
              <p className="text-neutral-600 dark:text-neutral-300 mb-3">
                <span className="font-semibold">Description:</span> {task.description}
              </p>

              <div className="flex flex-wrap gap-3 mt-3">
                <button
                  onClick={() => navigate(`/tasks/${task._id}`)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-12 text-center text-neutral-600 dark:text-neutral-400 text-sm">
        Keep managing all project tasks efficiently 🚀
      </div>
    </div>
  );
}

export default AllTasksPage;
