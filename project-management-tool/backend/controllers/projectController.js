const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');

exports.createProject = async (req, res) => {
  const { name, description, members, endDate, status } = req.body;

  try {
    const newProject = new Project({
      name,
      description,
      owner: req.user.id,
      members: [req.user.id],
      endDate,
      status
    });

    if (members && Array.isArray(members)) {
      const validMembers = await User.find({ _id: { $in: members } }).select('_id');
      newProject.members = [...new Set([...newProject.members, ...validMembers.map(m => m._id.toString())])];
    }

    const project = await newProject.save();
    await project.populate('owner', 'username email');
    await project.populate('members', 'username email');

    res.status(201).json(project);
  } catch (err) {
    console.error('Error creating project:', err.message);
    res.status(500).send('Server Error');
  }
};
exports.getProjectMembers = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = await Project.findById(projectId).populate('members', 'email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // ✅ Return just array of emails
    const memberEmails = project.members.map(member => member.email);

    res.status(200).json(memberEmails);
  } catch (error) {
    console.error('Error fetching project members:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const { search, status } = req.query;

    const query = {
      $or: [{ owner: req.user.id }, { members: req.user.id }]
    };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const projects = await Project.find(query)
      .populate('owner', 'username email')
      .populate('members', 'username email')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err.message);
    res.status(500).send('Server Error');
  }
};


exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'username email')
      .populate('members', 'username email');

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    const isOwner = project.owner?._id.toString() === req.user.id;
    const isMember = project.members.some((m) => m._id.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ msg: 'Not authorized to view this project' });
    }

    const tasks = await Task.find({ project: project._id });

    res.json({ project, tasks });
  } catch (err) {
    console.error('Error fetching project by ID:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Invalid project ID' });
    }
    res.status(500).send('Server Error');
  }
};


exports.getProjectCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectCount = await Project.countDocuments({
      $or: [
        { owner: userId },
        { members: userId }
      ]
    });
    res.json({ totalProjects: projectCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to count projects' });
  }
};


exports.updateProject = async (req, res) => {
  const { name, description, members, endDate, status } = req.body;
  const projectFields = {};

  if (name) projectFields.name = name;
  if (description) projectFields.description = description;
  if (endDate) projectFields.endDate = endDate;
  if (status) projectFields.status = status;

  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to update this project' });
    }

    if (members && Array.isArray(members)) {
      const validMembers = await User.find({ _id: { $in: members } }).select('_id');
      projectFields.members = [...new Set([...validMembers.map((m) => m._id.toString()), project.owner.toString()])];
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: projectFields },
      { new: true }
    )
      .populate('owner', 'username email')
      .populate('members', 'username email');

    res.json(project);
  } catch (err) {
    console.error('Error updating project:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Invalid project ID' });
    }
    res.status(500).send('Server Error');
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to delete this project' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Project deleted' });
  } catch (err) {
    console.error('Error deleting project:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Invalid project ID' });
    }
    res.status(500).send('Server Error');
  }
};
exports.getProjectsDueToday = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const projectsDueToday = await Project.find({
      endDate: { $gte: today, $lt: tomorrow },
    }).populate('members', 'username email');

    res.status(200).json(projectsDueToday);
  } catch (error) {
    console.error('Error fetching today’s due projects:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

