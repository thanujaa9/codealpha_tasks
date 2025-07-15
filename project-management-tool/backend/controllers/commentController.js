const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createComment = async (req, res) => {
  const { text, task: taskId } = req.body;
  const userId = req.user.id;

  try {
    const task = await Task.findById(taskId).populate('project', 'owner members');
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const project = task.project;
    if (!project) {
      return res.status(500).json({ msg: 'Associated project not found for this task' });
    }

    if (project.owner.toString() !== userId && !project.members.some(member => member._id.toString() === userId)) {
      return res.status(403).json({ msg: 'User not authorized to comment on this task/project' });
    }

    const newComment = new Comment({
      text,
      user: userId,
      task: taskId,
      project: project._id
    });

    const comment = await newComment.save();
    await comment.populate('user', 'username email');
    res.status(201).json(comment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid Task ID' });
    }
    res.status(500).send('Server Error');
  }
};

exports.getCommentsByTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId).populate('project', 'owner members');
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const project = task.project;
    if (project.owner.toString() !== req.user.id && !project.members.some(member => member._id.toString() === req.user.id)) {
      return res.status(403).json({ msg: 'User not authorized to view comments for this task/project' });
    }

    const comments = await Comment.find({ task: req.params.taskId })
      .populate('user', 'username email')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid Task ID' });
    }
    res.status(500).send('Server Error');
  }
};

exports.updateComment = async (req, res) => {
  const { text } = req.body;

  try {
    let comment = await Comment.findById(req.params.commentId).populate('task', 'project');
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to update this comment' });
    }

    const project = await Project.findById(comment.task.project);
    if (!project || (project.owner.toString() !== req.user.id && !project.members.some(member => member._id.toString() === req.user.id))) {
      return res.status(403).json({ msg: 'User no longer authorized to access the related project' });
    }

    comment.text = text || comment.text;
    await comment.save();
    await comment.populate('user', 'username email');
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Comment not found or Invalid ID' });
    }
    res.status(500).send('Server Error');
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId).populate('task', 'project');
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    const project = await Project.findById(comment.task.project);
    const isCommentOwner = comment.user.toString() === req.user.id;
    const isProjectOwner = project && project.owner.toString() === req.user.id;

    if (!isCommentOwner && !isProjectOwner) {
      return res.status(401).json({ msg: 'User not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.json({ msg: 'Comment removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    res.status(500).send('Server Error');
  }
};
