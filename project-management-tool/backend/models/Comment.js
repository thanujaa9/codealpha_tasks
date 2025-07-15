const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task', 
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project', 
    required: true
  }
}, {
  timestamps: true 
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;