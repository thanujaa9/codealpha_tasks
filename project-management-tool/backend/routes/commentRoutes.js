const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); 
const commentController = require('../controllers/commentController');

router.post('/', auth, commentController.createComment);

router.get('/task/:taskId', auth, commentController.getCommentsByTask);

router.put('/:commentId', auth, commentController.updateComment);

router.delete('/:commentId', auth, commentController.deleteComment);

module.exports = router;