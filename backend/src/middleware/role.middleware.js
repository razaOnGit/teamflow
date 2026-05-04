const prisma = require('../utils/database');

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      error: 'Access denied. Admin role required.' 
    });
  }
  next();
};

// Check if user is project member or admin
const requireProjectAccess = async (req, res, next) => {
  try {
    const projectId = req.params.id || req.params.projectId;
    const userId = req.user.id;

    // Admins have access to all projects
    if (req.user.role === 'ADMIN') {
      return next();
    }

    // Check if user is a member of the project
    const membership = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId
      }
    });

    if (!membership) {
      return res.status(403).json({ 
        error: 'Access denied. You are not a member of this project.' 
      });
    }

    next();
  } catch (error) {
    console.error('Project access check error:', error);
    res.status(500).json({ error: 'Failed to verify project access' });
  }
};

// Check if user can modify task (admin, task creator, or assignee)
const requireTaskAccess = async (req, res, next) => {
  try {
    const taskId = req.params.id || req.params.taskId;
    const userId = req.user.id;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          include: {
            members: true
          }
        }
      }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Admins can access any task
    if (req.user.role === 'ADMIN') {
      req.task = task;
      return next();
    }

    // Check if user is project member
    const isMember = task.project.members.some(member => member.userId === userId);
    if (!isMember) {
      return res.status(403).json({ 
        error: 'Access denied. You are not a member of this project.' 
      });
    }

    // For updates, check if user is assignee or creator
    if (req.method === 'PUT' || req.method === 'PATCH') {
      const canModify = task.assignedToId === userId || task.createdById === userId;
      if (!canModify) {
        return res.status(403).json({ 
          error: 'Access denied. You can only modify tasks assigned to you or created by you.' 
        });
      }
    }

    req.task = task;
    next();
  } catch (error) {
    console.error('Task access check error:', error);
    res.status(500).json({ error: 'Failed to verify task access' });
  }
};

module.exports = {
  requireAdmin,
  requireProjectAccess,
  requireTaskAccess
};