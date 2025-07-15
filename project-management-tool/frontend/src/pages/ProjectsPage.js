import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useDarkMode();

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first.');
        setLoading(false);
        return;
      }

      const res = await axios.get('http://localhost:5174/api/projects', {
        headers: { 'x-auth-token': token },
        params: {
          search: searchTerm,
          status: statusFilter,
        },
      });

      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.response?.data?.msg || 'Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [searchTerm, statusFilter]);

  const handleDelete = async (projectId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this project?');
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5174/api/projects/${projectId}`, {
          headers: { 'x-auth-token': token },
        });
        setProjects(projects.filter((p) => p._id !== projectId));
      } catch (err) {
        console.error('Error deleting project:', err);
        alert('Failed to delete project.');
      }
    }
  };

  const statusColors = {
    'Not Started': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
    'Completed': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
    'On Hold': 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100',
  };

  return (
    <div className="min-h-screen p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 font-sans transition-colors duration-500">
      <div className="max-w-6xl mx-auto bg-white dark:bg-neutral-800 shadow-xl rounded-2xl p-8 lg:p-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-4 border-b border-neutral-200 dark:border-neutral-700">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-700 dark:text-primary-400 mb-4 sm:mb-0">
            Your Projects
          </h1>
          <Link
            to="/projects/create"
            className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Create New Project
          </Link>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <input
            type="text"
            placeholder="Search by project name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-1/4 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
          >
            <option value="All">All</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>

        {/* States: loading, error, empty */}
        {loading ? (
          <div className="text-center py-12 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-300 text-lg">Loading your projects...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400 text-xl font-semibold mb-4">Error: {error}</p>
            <p className="text-neutral-600 dark:text-neutral-300">Please try refreshing the page or check your connection.</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-600 dark:text-neutral-300 text-xl mb-4">No projects found.</p>
            <p className="text-neutral-500 dark:text-neutral-400">Try adjusting your filters or create a new project!</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <li key={project._id} className="group bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg p-6 flex flex-col justify-between transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3 text-primary-600 dark:text-primary-300">
                    {project.status === 'Completed' ? '✅' : project.status === 'In Progress' ? '🚀' : '📁'}
                  </span>
                  <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">{project.name}</h2>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-4 line-clamp-3">
                  {project.description || 'No description provided.'}
                </p>
                <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
                  <p><span className="font-medium">Status:</span>{' '}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[project.status] || 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}>
                      {project.status}
                    </span>
                  </p>
                  {project.endDate && <p><span className="font-medium">End Date:</span> {new Date(project.endDate).toLocaleDateString()}</p>}
                  {project.owner && <p><span className="font-medium">Owner:</span> {project.owner.username || project.owner.email}</p>}
                  {project.members && project.members.length > 0 && <p><span className="font-medium">Members:</span> {project.members.map(m => m.username || m.email).join(', ')}</p>}
                  <p className="pt-2 border-t border-neutral-100 dark:border-neutral-700"><span className="font-medium">Created:</span> {new Date(project.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex space-x-3 mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <Link to={`/projects/${project._id}`} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-center border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-300">View</Link>
                  <Link to={`/projects/${project._id}/edit`} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-center border border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white transition-all duration-300">Edit</Link>
                  <button onClick={() => handleDelete(project._id)} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-center border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-300">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
