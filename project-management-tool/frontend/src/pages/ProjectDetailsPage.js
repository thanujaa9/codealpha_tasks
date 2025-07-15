import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; 

function ProjectDetailsPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth(); 

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [loadingPage, setLoadingPage] = useState(true); 
  const statusColors = {
    'Not Started': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
    'Completed': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
    'On Hold': 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100',
    'To Do': 'bg-neutral-200 text-neutral-700 dark:bg-neutral-600 dark:text-neutral-200',
    'Done': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100', 
    'Blocked': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100', 
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
   
    if (!loading && isAuthenticated) {
      const fetchProjectDetails = async () => {
        try {
          setError(''); 
          const token = localStorage.getItem('token');
          if (!token) {
            setError('Please login first.');
            setLoadingPage(false);
            return;
          }

          const res = await axios.get(`http://localhost:5174/api/projects/${id}`, {
            headers: { 'x-auth-token': token },
          });

          setProject(res.data.project);
          setTasks(res.data.tasks || []); 

        } catch (err) {
          console.error('Error loading project or tasks:', err.response?.data || err.message);
          setError(err.response?.data?.msg || 'Failed to load project details or tasks.');
        } finally {
          setLoadingPage(false);
        }
      };

      fetchProjectDetails();
    } else if (!loading && !isAuthenticated) {
      setLoadingPage(false); 
    }
  }, [id, isAuthenticated, loading]); 
  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5174/api/tasks/${taskId}`, {
          headers: { 'x-auth-token': token },
        });
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      } catch (err) {
        console.error('Error deleting task:', err);
        alert('Failed to delete task.');
      }
    }
  };

  const handleDeleteProject = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this project permanently? All associated tasks will also be removed.');
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5174/api/projects/${id}`, {
          headers: { 'x-auth-token': token },
        });
        navigate('/projects', { replace: true }); 
      } catch (err) {
        console.error('Error deleting project:', err);
        alert('Failed to delete project.');
      }
    }
  };


  if (loadingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 font-sans">
        <p className="text-xl">Loading project details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 font-sans">
        <p className="text-red-500 dark:text-red-400 text-xl font-semibold mb-4">Error: {error}</p>
        <button
          onClick={() => navigate('/projects')}
          className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200"
        >
          Return to Projects
        </button>
      </div>
    );
  }

  if (!project) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 font-sans">
          <p className="text-lg">Project not found or you do not have access.</p>
        </div>
      );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 // Responsive padding
                    bg-neutral-50 dark:bg-neutral-900 // Page background matches App.js
                    text-neutral-900 dark:text-neutral-50 // Default text colors for contrast
                    font-sans transition-colors duration-500"> {}
      <div
        className="w-full max-w-4xl bg-white dark:bg-neutral-800 // Card background
                   rounded-2xl shadow-xl p-8 lg:p-10 // Larger radius, more prominent shadow, more padding
                   transform transition-all duration-500 ease-in-out // For overall container animation
                   hover:scale-[1.005] hover:shadow-2xl" 
      >
        {}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => navigate('/projects')} 
              className="inline-flex items-center px-4 py-2.5 mb-4 sm:mb-0
                         bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 // Button background colors
                         text-neutral-800 dark:text-neutral-200 font-semibold rounded-lg text-sm
                         shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 // Lift on hover
                         focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900"
            >
              ← Back to Projects
            </button>
            <div className="flex flex-wrap justify-end gap-3"> {}
                <Link
                    to={`/projects/${id}/edit`} 
                    className="px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600
                               text-white rounded-lg text-sm font-semibold text-center
                               shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5
                               focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900"
                >
                    Edit Project
                </Link>
                <button
                    onClick={handleDeleteProject} 
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600
                               text-white rounded-lg text-sm font-semibold text-center
                               shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5
                               focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900"
                >
                    Delete Project
                </button>
            </div>
        </div>

        {/* Project Details Section */}
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-primary-700 dark:text-primary-400">
          {project.name}
        </h2>

        <div className="space-y-4 text-lg text-neutral-800 dark:text-neutral-100 mb-8 pb-8 border-b border-neutral-200 dark:border-neutral-700">
          <p className="flex flex-col sm:flex-row sm:items-center">
            <span className="font-semibold text-neutral-700 dark:text-neutral-200 sm:w-32 flex-shrink-0">Description:</span>{' '}
            <span className="text-neutral-600 dark:text-neutral-300 mt-1 sm:mt-0">{project.description || 'No description provided.'}</span>
          </p>

          <p className="flex flex-col sm:flex-row sm:items-center">
            <span className="font-semibold text-neutral-700 dark:text-neutral-200 sm:w-32 flex-shrink-0">Status:</span>{' '}
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                statusColors[project.status] || 'bg-neutral-200 text-neutral-700 dark:bg-neutral-600 dark:text-neutral-200'
              }`}
            >
              {project.status}
            </span>
          </p>

          {project.endDate && (
            <p className="flex flex-col sm:flex-row sm:items-center">
              <span className="font-semibold text-neutral-700 dark:text-neutral-200 sm:w-32 flex-shrink-0">End Date:</span>{' '}
              <span className="text-neutral-600 dark:text-neutral-300 mt-1 sm:mt-0">{new Date(project.endDate).toLocaleDateString()}</span>
            </p>
          )}

          <p className="flex flex-col sm:flex-row sm:items-center">
            <span className="font-semibold text-neutral-700 dark:text-neutral-200 sm:w-32 flex-shrink-0">Owner:</span>{' '}
            <span className="text-neutral-600 dark:text-neutral-300 mt-1 sm:mt-0">{project.owner?.username || project.owner?.email || 'N/A'}</span>
          </p>

          {/* Members List */}
          <div className="flex flex-col sm:flex-row sm:items-start">
            <span className="font-semibold text-neutral-700 dark:text-neutral-200 sm:w-32 flex-shrink-0 mb-1 sm:mb-0">Members:</span>
            {project.members && project.members.length > 0 ? (
              <ul className="list-disc list-inside text-neutral-600 dark:text-neutral-300 pl-4 sm:pl-0">
                {project.members.map((member) => (
                  <li key={member._id}>
                    {member.username} ({member.email})
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-neutral-600 dark:text-neutral-300 mt-1 sm:mt-0">No members assigned.</span>
            )}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-semibold text-neutral-800 dark:text-neutral-100">Tasks for this Project:</h3>
          <Link
            to={`/projects/${id}/create-task`} 
            className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600
                       text-white font-bold py-2.5 px-5 rounded-lg text-sm
                       shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5
                       focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900"
          >
            + Add Task
          </Link>
        </div>

        {tasks.length > 0 ? (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li key={task._id} className="border border-neutral-300 dark:border-neutral-600 p-5 rounded-lg shadow-sm bg-neutral-50 dark:bg-neutral-700">
                <h4 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-2">{task.title}</h4>
                <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-3">{task.description || 'No description provided.'}</p>
                <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-2">
                  <span className="font-medium">Status:</span>{' '}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColors[task.status] || 'bg-neutral-200 text-neutral-700 dark:bg-neutral-600 dark:text-neutral-200'
                    }`}
                  >
                    {task.status}
                  </span>
                </p>
                {task.priority && (
                    <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-3">
                        <span className="font-medium">Priority:</span> {task.priority}
                    </p>
                )}
                {task.dueDate && (
                    <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-3">
                        <span className="font-medium">Due Date:</span> {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                )}

                <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-700 flex space-x-3">
                  <Link
                    to={`/tasks/${task._id}`} 
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-center
                               border border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400
                               hover:bg-blue-500 hover:text-white dark:hover:bg-blue-400 dark:hover:text-neutral-900
                               shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5
                               focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900"
                  >
                    View
                  </Link>
                  <Link
                    to={`/tasks/${task._id}/edit`} 
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-center
                               border border-yellow-500 text-yellow-600 dark:border-yellow-400 dark:text-yellow-400
                               hover:bg-yellow-500 hover:text-white dark:hover:bg-yellow-400 dark:hover:text-neutral-900
                               shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5
                               focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-center
                               border border-red-500 text-red-600 dark:border-red-400 dark:text-red-400
                               hover:bg-red-500 hover:text-white dark:hover:bg-red-400 dark:hover:text-neutral-900
                               shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5
                               focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-neutral-600 dark:text-neutral-300">No tasks yet for this project.</p>
        )}
      </div>
    </div>
  );
}

export default ProjectDetailsPage;
