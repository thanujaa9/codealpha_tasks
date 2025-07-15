const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const projectController = require('../controllers/projectController');
router.get('/count', auth, projectController.getProjectCount);
router.post('/', auth, projectController.createProject);
router.get('/:projectId/members', auth, projectController.getProjectMembers);
router.get('/', auth, projectController.getProjects);

router.get('/due/today', auth, projectController.getProjectsDueToday);
router.get('/:id', auth, projectController.getProjectById);

router.put('/:id', auth, projectController.updateProject);

router.delete('/:id', auth, projectController.deleteProject);



module.exports = router;
