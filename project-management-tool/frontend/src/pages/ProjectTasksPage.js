import React, { useEffect, useState } from 'react';
import { useParams, Link} from 'react-router-dom';
import { getTasksByProject, deleteTask } from '../services/taskService';
import { useAuth } from '../context/AuthContext';

const ProjectTasksPage = () => {
  const { projectId } = useParams();
  const { token } = useAuth();

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasksByProject(projectId, token);
        setTasks(data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };
    fetchTasks();
  }, [projectId, token]);

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId, token);
      setTasks(tasks.filter(t => t._id !== taskId));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tasks for this Project</h1>

      <Link to={`/project/${projectId}/tasks/create`} className="px-4 py-2 bg-blue-500 text-white rounded">
        + Create Task
      </Link>

      <ul className="mt-6 space-y-4">
        {tasks.map(task => (
          <li key={task._id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>

            <div className="mt-2 flex space-x-3">
              <Link to={`/tasks/${task._id}`} className="text-blue-500">View</Link>
              <Link to={`/tasks/${task._id}/edit`} className="text-green-500">Edit</Link>
              <button onClick={() => handleDelete(task._id)} className="text-red-500">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectTasksPage;
