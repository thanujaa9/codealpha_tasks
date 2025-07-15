// frontend/src/services/taskService.js
import axios from 'axios';

const API_BASE = 'http://localhost:5174/api/tasks'; 

// Set token from AuthContext
export const getAuthHeader = (token) => ({
  headers: { 'x-auth-token': token },
});

// Get all tasks for a project
export const getTasksByProject = async (projectId, token) => {
  const res = await axios.get(`${API_BASE}/project/${projectId}`, getAuthHeader(token));
  return res.data;
};

// Create a task
export const createTask = async (taskData, token) => {
  const res = await axios.post(API_BASE, taskData, getAuthHeader(token));
  return res.data;
};

// Get single task
export const getTaskById = async (taskId, token) => {
  const res = await axios.get(`${API_BASE}/${taskId}`, getAuthHeader(token));
  return res.data;
};

// Update task
export const updateTask = async (taskId, updatedData, token) => {
  const res = await axios.put(`${API_BASE}/${taskId}`, updatedData, getAuthHeader(token));
  return res.data;
};

// Delete task
export const deleteTask = async (taskId, token) => {
  const res = await axios.delete(`${API_BASE}/${taskId}`, getAuthHeader(token));
  return res.data;
};
