const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} = require('../controllers/project.controller');
const { getProjectTasks, createTask } = require('../controllers/task.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requireAdmin, requireProjectAccess } = require('../middleware/role.middleware');
const { validateProject, validateTask, validateId, validatePagination } = require('../utils/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Project routes
router.get('/', validatePagination, getProjects);
router.get('/:id', validateId, requireProjectAccess, getProject);
router.post('/', validateProject, requireAdmin, createProject);
router.put('/:id', validateId, validateProject, requireAdmin, updateProject);
router.delete('/:id', validateId, requireAdmin, deleteProject);

// Project member routes
router.post('/:id/members', validateId, requireAdmin, addMember);
router.delete('/:id/members/:userId', validateId, requireAdmin, removeMember);

// Project task routes
router.get('/:id/tasks', validateId, requireProjectAccess, getProjectTasks);
router.post('/:id/tasks', validateId, validateTask, requireProjectAccess, createTask);

module.exports = router;