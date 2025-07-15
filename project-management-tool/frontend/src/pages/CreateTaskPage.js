import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreateTaskPage = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState('To Do');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [projectMembers, setProjectMembers] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const fetchProjectMembers = async () => {
        try {
          setError('');
          const token = localStorage.getItem('token');
          if (!token) {
            setError('Please login first.');
            return;
          }

          const res = await axios.get(`http://localhost:5174/api/projects/${projectId}`, {
            headers: { 'x-auth-token': token },
          });

          if (res.data && res.data.project && res.data.project.members) {
            setProjectMembers(res.data.project.members);
          } else {
            setProjectMembers([]);
          }
        } catch (err) {
          console.error('Error fetching project members:', err.response?.data || err.message);
          setError(err.response?.data?.msg || 'Failed to load project members.');
        }
      };

      fetchProjectMembers();
    }
  }, [projectId, isAuthenticated, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first. Token not found.');
        return;
      }

      const taskData = {
        title,
        description,
        project: projectId,
        assignedTo: assignedTo || null,
        status,
        priority,
        dueDate: dueDate || null,
      };

      await axios.post('http://localhost:5174/api/tasks', taskData, {
        headers: { 'x-auth-token': token },
      });

      setSuccessMsg('✅ Task created successfully!');
      navigate(`/projects/${projectId}`);
    } catch (err) {
      console.error('API Error:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Task creation failed.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 font-sans">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 font-sans transition-colors duration-500">
      <div className="w-full max-w-xl bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 lg:p-10 transform transition-all duration-500 ease-in-out hover:scale-[1.005] hover:shadow-2xl">
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="inline-flex items-center px-4 py-2.5 mb-6 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 font-semibold rounded-lg text-sm shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900"
        >
          ← Back to Project
        </button>

        <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-primary-700 dark:text-primary-400 text-center">
          Create New Task 🚀
        </h2>

        {error && (
          <p className="text-red-500 dark:text-red-400 text-center mb-6 font-semibold animate-pulse">{error}</p>
        )}
        {successMsg && (
          <p className="text-green-500 dark:text-green-400 text-center mb-6 font-semibold animate-bounce">{successMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="taskTitle" className="block mb-2 font-semibold text-neutral-700 dark:text-neutral-200">Title:</label>
            <input
              type="text"
              id="taskTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-800 transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="taskDescription" className="block mb-2 font-semibold text-neutral-700 dark:text-neutral-200">Description:</label>
            <textarea
              id="taskDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-800 transition-all duration-200 resize-y"
            />
          </div>

          <div>
            <label htmlFor="assignedTo" className="block mb-2 font-semibold text-neutral-700 dark:text-neutral-200">Assign To (Optional):</label>
            <select
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-800 transition-all duration-200"
            >
              <option value="">-- Select Member --</option>
              {projectMembers.length > 0 ? (
                projectMembers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.username} ({member.email})
                  </option>
                ))
              ) : (
                <option disabled>No members available for this project</option>
              )}
            </select>
          </div>

          <div>
            <label htmlFor="taskStatus" className="block mb-2 font-semibold text-neutral-700 dark:text-neutral-200">Status:</label>
            <select
              id="taskStatus"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-800 transition-all duration-200"
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
              <option>Blocked</option>
            </select>
          </div>

          <div>
            <label htmlFor="taskPriority" className="block mb-2 font-semibold text-neutral-700 dark:text-neutral-200">Priority:</label>
            <select
              id="taskPriority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-800 transition-all duration-200"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div>
            <label htmlFor="taskDueDate" className="block mb-2 font-semibold text-neutral-700 dark:text-neutral-200">Due Date:</label>
            <input
              type="date"
              id="taskDueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-800 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-800"
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskPage;
