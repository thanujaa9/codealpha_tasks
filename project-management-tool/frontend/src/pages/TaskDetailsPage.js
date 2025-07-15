import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const TaskDetailPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [error, setError] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState('');

  const token = localStorage.getItem('token');

  // Fetch Task Details
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`http://localhost:5174/api/tasks/${taskId}`, {
          headers: { 'x-auth-token': token },
        });
        setTask(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load task');
      }
    };

    fetchTask();
  }, [taskId, token]);

  // Fetch Task Comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:5174/api/comments/task/${taskId}`, {
          headers: { 'x-auth-token': token },
        });
        setComments(res.data);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    fetchComments();
  }, [taskId, token]);

  // Handle Add Comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:5174/api/comments/`,
        { text: newComment, task: taskId },
        { headers: { 'x-auth-token': token } }
      );
      setComments((prev) => [...prev, res.data]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      alert(err.response?.data?.msg || 'Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await axios.delete(`http://localhost:5174/api/comments/${commentId}`, {
        headers: { 'x-auth-token': token },
      });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert(err.response?.data?.msg || 'Failed to delete comment');
    }
  };

  // Handle Start Edit
  const startEditComment = (commentId, text) => {
    setEditingCommentId(commentId);
    setEditedText(text);
  };

  // Handle Save Edit
  const handleSaveEdit = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5174/api/comments/${editingCommentId}`,
        { text: editedText },
        { headers: { 'x-auth-token': token } }
      );

      setComments((prev) =>
        prev.map((c) => (c._id === editingCommentId ? res.data : c))
      );
      setEditingCommentId(null);
      setEditedText('');
    } catch (err) {
      console.error('Error updating comment:', err);
      alert(err.response?.data?.msg || 'Failed to update comment');
    }
  };

  const handleDeleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:5174/api/tasks/${taskId}`, {
          headers: { 'x-auth-token': token },
        });
        navigate(-1);
      } catch (err) {
        alert(err.response?.data?.msg || 'Error deleting task');
      }
    }
  };

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!task) return <p className="text-center mt-10">Loading task details...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 text-neutral-900 dark:text-neutral-50 flex flex-col items-center justify-start py-10 px-6"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="w-full max-w-3xl bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 space-y-6"
      >
        {/* Task Details */}
        <h1 className="text-4xl font-extrabold text-primary-700 dark:text-primary-400">
          {task.title}
        </h1>

        <div className="space-y-3 text-lg">
          <p><strong>Description:</strong> {task.description || 'No description available.'}</p>
          <p><strong>Status:</strong> {task.status}</p>
          <p><strong>Priority:</strong> {task.priority}</p>
          <p><strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not Set'}</p>
          <p><strong>Assigned To:</strong> {task.assignedTo?.username || 'Unassigned'}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <Link to={`/tasks/${taskId}/edit`} className="px-4 py-2 bg-blue-600 text-white rounded-lg">✏️ Edit</Link>
          <button onClick={handleDeleteTask} className="px-4 py-2 bg-red-600 text-white rounded-lg">🗑️ Delete</button>
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-400 text-white rounded-lg">← Back</button>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">💬 Comments</h2>

          {/* List of Comments */}
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            <ul className="space-y-4">
              {comments.map((comment) => (
                <li key={comment._id} className="bg-neutral-100 dark:bg-neutral-700 p-4 rounded-lg shadow-sm">
                  <p><strong>{comment.user?.username || comment.user?.email}:</strong></p>
                  {editingCommentId === comment._id ? (
                    <>
                      <textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="w-full p-2 mt-2 rounded border"
                      />
                      <div className="mt-2 flex gap-2">
                        <button onClick={handleSaveEdit} className="px-3 py-1 bg-green-500 text-white rounded">Save</button>
                        <button onClick={() => setEditingCommentId(null)} className="px-3 py-1 bg-gray-400 text-white rounded">Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="mt-1">{comment.text}</p>
                      <div className="mt-2 text-sm flex gap-3">
                        <button
                          onClick={() => startEditComment(comment._id, comment.text)}
                          className="text-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Add New Comment */}
          <div className="mt-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your comment..."
              className="w-full p-3 rounded border focus:ring focus:ring-blue-300"
            />
            <button
              onClick={handleAddComment}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              ➕ Add Comment
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TaskDetailPage;
