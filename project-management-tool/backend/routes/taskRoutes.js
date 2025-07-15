const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); 
const taskController = require('../controllers/taskController');

// Task count (total number of tasks)
router.get('/count', auth, taskController.getTaskCount);
router.get('/count/user', auth, taskController.getTaskCountByUser);
router.get('/user', auth, taskController.getTasksByUser);

// Create a task
router.post('/', auth, taskController.createTask);

// Get all tasks for a specific project
router.get('/project/:projectId', auth, taskController.getTasksByProjectId);
router.get('/', auth, taskController.getAllTasks); 

// Get a single task by id
router.get('/:id', taskController.getTaskById);

// Update a task
router.put('/:taskId', auth, taskController.updateTask);
router.get('/due/today', auth, taskController.getTasksDueToday);

// Delete a task
router.delete('/:taskId', auth, taskController.deleteTask);

module.exports = router;
