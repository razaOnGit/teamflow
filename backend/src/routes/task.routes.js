const express = require('express');
const {
  getTask,
  updateTask,
  deleteTask
} = require('../controllers/task.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requireAdmin, requireTaskAccess } = require('../middleware/role.middleware');
const { validateTask, validateId } = require('../utils/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Task routes
router.get('/:id', validateId, requireTaskAccess, getTask);
router.put('/:id', validateId, validateTask, requireTaskAccess, updateTask);
router.delete('/:id', validateId, requireAdmin, deleteTask);

module.exports = router;