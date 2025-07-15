import axios from 'axios';

const API_BASE_URL = 'http://localhost:5174/api/projects'; 

// Get all projects
export const getProjects = async () => {
  const res = await axios.get(API_BASE_URL, { withCredentials: true });
  return res.data;
};

// Get single project by ID
export const getProjectById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/${id}`, { withCredentials: true });
  return res.data;
};

// Create a new project
export const createProject = async (projectData, token) => {
  const res = await axios.post('/api/projects', projectData, {
    headers: {
      'x-auth-token': token,  
    },
  });
  return res.data;
};
// Delete a project
export const deleteProject = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/${id}`, { withCredentials: true });
  return res.data;
};
