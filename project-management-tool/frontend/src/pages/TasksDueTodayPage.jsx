import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TasksDueTodayPage = () => {
  const [tasks, setTasks] = useState([]);
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDueTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5174/api/tasks/due/today', {
          headers: { 'x-auth-token': token },
        });
        setTasks(res.data);
      } catch (error) {
        console.error('Error fetching due tasks:', error);
      }
    };

    if (isAuthenticated) fetchDueTasks();
  }, [isAuthenticated]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-tr from-yellow-100 via-pink-100 to-purple-100 dark:from-neutral-800 dark:to-neutral-950">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        ⬅ Back
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">⏰ Tasks Due Today</h1>

      {tasks.length === 0 ? (
        <p className="text-center text-lg text-neutral-600 dark:text-neutral-300">No tasks due today.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="bg-white dark:bg-neutral-800 p-5 rounded-xl shadow hover:scale-105 transition-transform"
            >
              <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-1">{task.title}</h2>
              <p className="text-neutral-600 dark:text-neutral-300">
                <strong>Status:</strong> {task.status}
              </p>
              <p className="text-neutral-600 dark:text-neutral-300">
                <strong>Project:</strong> {task.project?.title || 'No Project'}
              </p>
              <p className="text-neutral-600 dark:text-neutral-300">
                <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TasksDueTodayPage;
