const express = require('express');
const { getUsers, getUser, getUserStats } = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');
const { validateId, validatePagination } = require('../utils/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// User routes
router.get('/', validatePagination, requireAdmin, getUsers);
router.get('/stats', getUserStats); // Current user stats
router.get('/:id', validateId, requireAdmin, getUser);
router.get('/:id/stats', validateId, requireAdmin, getUserStats);

module.exports = router;