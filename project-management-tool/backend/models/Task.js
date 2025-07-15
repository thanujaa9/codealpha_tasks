const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  description: {
    type: String,
    trim: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project', 
    required: true
  },
  assignedTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  default: null,
},
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done', 'Blocked'], 
    default: 'To Do'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  dueDate: {
    type: Date
  },
  
}, {
  timestamps: true 
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;