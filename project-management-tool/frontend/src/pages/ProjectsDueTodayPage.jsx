import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProjectsDueTodayPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');

  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDueProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5174/api/projects/due/today', {
          headers: { 'x-auth-token': token },
        });
        setProjects(res.data);
        setFilteredProjects(res.data);
      } catch (error) {
        console.error('Error fetching due projects:', error);
      }
    };

    if (isAuthenticated) fetchDueProjects();
  }, [isAuthenticated]);

  useEffect(() => {
    if (filterStatus === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter((p) => p.status === filterStatus));
    }
  }, [filterStatus, projects]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-tr from-green-100 via-blue-100 to-purple-100 dark:from-neutral-800 dark:to-neutral-950">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          ⬅ Back
        </button>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded border border-gray-300 bg-white dark:bg-neutral-700 dark:text-white"
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </select>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">
        📆 Projects Due Today
      </h1>

      {filteredProjects.length === 0 ? (
        <p className="text-center text-lg text-neutral-600 dark:text-neutral-300">
          No projects due today under selected filter.
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <li
              key={project._id}
              className="bg-white dark:bg-neutral-800 p-5 rounded-xl shadow hover:scale-105 transition-transform"
            >
              <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-1">
                {project.name}
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300">
                <strong>Description:</strong> {project.description}
              </p>
              <p className="text-neutral-600 dark:text-neutral-300">
                <strong>Status:</strong> {project.status}
              </p>
              <p className="text-neutral-600 dark:text-neutral-300">
                <strong>Due:</strong>{' '}
                {new Date(project.endDate).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              <button
                onClick={() => navigate(`/projects/${project._id}`)}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                View Project
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectsDueTodayPage;
