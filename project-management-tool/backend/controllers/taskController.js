const Task = require('../models/Task.js');
const Project = require('../models/Project.js');

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, assignedTo, project } = req.body;

    const newTask = new Task({
      title,
      description,
      status,
      assignedTo: assignedTo || null,
      project,
    });

    const savedTask = await newTask.save();
    const populatedTask = await Task.findById(savedTask._id).populate('assignedTo', 'username email');

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.getTasksDueToday = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasksDueToday = await Task.find({
      dueDate: { $gte: today, $lt: tomorrow }
    })
    .populate('assignedTo', 'username email')
    .populate('project', 'title');

    res.status(200).json(tasksDueToday);
  } catch (error) {
    console.error('Error fetching today’s due tasks:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ Get all tasks (admin/global view)
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('project', 'title description')
      .populate('assignedTo', 'username email');

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching all tasks:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ Get all tasks for a specific project
exports.getTasksByProjectId = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const tasks = await Task.find({ project: projectId }).populate('assignedTo', 'username email');
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ Get a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;  
    const task = await Task.findById(taskId).populate('assignedTo', 'username email');

    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ Update a task
exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { title, description, status, assignedTo, dueDate, priority } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedTo: assignedTo || null,
      },
      { new: true }
    ).populate('assignedTo', 'username email');

    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ Task Count 
exports.getTaskCount = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    res.status(200).json({ totalTasks });
  } catch (error) {
    console.error('Error getting task count:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.getTaskCountByUser = async (req, res) => {
  try {
    const userId = req.user.id; 

    const totalTasks = await Task.countDocuments({ assignedTo: userId });

    res.status(200).json({ totalTasks });
  } catch (error) {
    console.error('Error counting user tasks:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.getTasksByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await Task.find({ assignedTo: userId })
      .populate('project', 'title description')    
      .populate('assignedTo', 'username email');  

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ Get Members of a Project 
exports.getProjectMembers = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = await Project.findById(projectId).populate('members', 'username email');

    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.status(200).json(project.members);
  } catch (error) {
    console.error('Error fetching project members:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
