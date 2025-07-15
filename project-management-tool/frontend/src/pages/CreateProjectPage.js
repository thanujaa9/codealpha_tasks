import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateProjectPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Not Started');
  const [endDate, setEndDate] = useState('');
  const [members, setMembers] = useState(''); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first. Token not found.');
        return;
      }

      const membersArray = members
        .split(',')
        .map(id => id.trim())
        .filter(id => id !== '');

      const projectData = {
        name,
        description,
        status,
        endDate, 
        members: membersArray,
      };

      await axios.post('http://localhost:5174/api/projects', projectData, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token, 
        },
      });

      setSuccess('✅ Project created successfully!');
      
      setName('');
      setDescription('');
      setStatus('Not Started'); 
      setEndDate('');
      setMembers('');
    } catch (err) {
      console.error('Error creating project:', err.response?.data || err.message);
      
      setError(err.response?.data?.msg || 'Failed to create project.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4
                    bg-neutral-50 dark:bg-neutral-900 // Background for the whole page
                    text-neutral-900 dark:text-neutral-50 // Default text color
                    font-sans transition-colors duration-500">
      <div className="w-full max-w-md
                      bg-white dark:bg-neutral-800 // Card background
                      rounded-xl shadow-lg p-6
                      transform transition duration-500 hover:scale-[1.02] hover:shadow-2xl"> {}

        {}
        <button
          onClick={() => navigate(-1)}
          className="text-primary-600 dark:text-primary-400 mb-4 hover:underline transition-colors duration-200"
        >
          ← Back to Projects
        </button>

        <h2 className="text-3xl font-extrabold mb-4 text-center
                       text-primary-700 dark:text-primary-400">Create New Project 🚀</h2> {}

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-200 mb-1">Project Name:</label> {}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-neutral-300 dark:border-neutral-600 // Border colors
                         rounded-lg bg-neutral-50 dark:bg-neutral-700 // Input background
                         text-neutral-900 dark:text-neutral-100 // Input text color
                         focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200" 
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-200 mb-1">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-neutral-300 dark:border-neutral-600
                         rounded-lg bg-neutral-50 dark:bg-neutral-700
                         text-neutral-900 dark:text-neutral-100
                         focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200 resize-none"
              rows="3"
            ></textarea>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-200 mb-1">Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 border border-neutral-300 dark:border-neutral-600
                         rounded-lg bg-neutral-50 dark:bg-neutral-700
                         text-neutral-900 dark:text-neutral-100
                         focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200"
            >
              {}
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-200 mb-1">End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 border border-neutral-300 dark:border-neutral-600
                         rounded-lg bg-neutral-50 dark:bg-neutral-700
                         text-neutral-900 dark:text-neutral-100
                         focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-200 mb-1">Members (comma-separated user IDs):</label>
            <input
              type="text"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              placeholder="e.g. userId1, userId2..."
              className="w-full p-3 border border-neutral-300 dark:border-neutral-600
                         rounded-lg bg-neutral-50 dark:bg-neutral-700
                         text-neutral-900 dark:text-neutral-100
                         focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full
                       bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 // Primary button colors
                       text-white py-3 rounded-lg font-semibold
                       hover:shadow-lg transition duration-300 shadow-md // Shadow on hover
                       focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-800"
          >
            ➕ Create Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectPage;
