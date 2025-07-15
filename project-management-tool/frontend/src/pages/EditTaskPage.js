import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EditTaskPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  const [task, setTask] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState('To Do');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState('');
  const [projectMembers, setProjectMembers] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`http://localhost:5174/api/tasks/${taskId}`, {
          headers: { 'x-auth-token': token },
        });
        const taskData = res.data;
        setTask(taskData);
        setTitle(taskData.title);
        setDescription(taskData.description);
        setStatus(taskData.status);
        setPriority(taskData.priority);
        setAssignedTo(taskData.assignedTo?._id || '');
        setDueDate(taskData.dueDate?.slice(0, 10));
        setProjectId(taskData.project);
      } catch (err) {
        console.error('Error fetching task:', err);
        setError('Failed to load task.');
      }
    };
    fetchTask();
  }, [taskId, token]);

  useEffect(() => {
    if (projectId) {
      const fetchProjectMembers = async () => {
        try {
          const res = await axios.get(`http://localhost:5174/api/projects/${projectId}`, {
            headers: { 'x-auth-token': token },
          });
          setProjectMembers(res.data.project.members || []);
        } catch (err) {
          console.error('Error fetching project members:', err);
          setProjectMembers([]);
        }
      };
      fetchProjectMembers();
    }
  }, [projectId, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        title,
        description,
        status,
        priority,
        dueDate,
        assignedTo: assignedTo || null,
      };

      await axios.put(`http://localhost:5174/api/tasks/${taskId}`, updatedData, {
        headers: { 'x-auth-token': token },
      });

      navigate(`/tasks/${taskId}`);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task.');
    }
  };

  if (!task) return <p className="text-center mt-10 text-lg dark:text-neutral-200">Loading task details...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 font-sans p-6">
      <div className="w-full max-w-2xl bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-2xl transition-all duration-300">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-blue-700 dark:text-blue-400">
          ✏️ Edit Task
        </h2>

        {error && <p className="text-red-500 mb-4 text-center font-medium">{error}</p>}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-700 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Assign To:</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Unassigned --</option>
              {projectMembers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.username} ({member.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold">Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
              <option>Blocked</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold">Priority:</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold">Due Date:</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02]"
          >
            💾 Update Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTaskPage;
