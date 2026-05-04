const { validationResult } = require('express-validator');
const prisma = require('../utils/database');

// Get tasks for a project
const getProjectTasks = async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const { status, assignedTo, priority, page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const whereClause = {
      projectId,
      ...(status && { status }),
      ...(assignedTo && { assignedToId: assignedTo }),
      ...(priority && { priority })
    };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where: whereClause,
        include: {
          assignedTo: {
            select: { id: true, name: true, email: true }
          },
          createdBy: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: [
          { status: 'asc' },
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: parseInt(limit)
      }),
      prisma.task.count({ where: whereClause })
    ]);

    res.json({
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get project tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// Get single task
const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true }
        },
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        project: {
          select: { id: true, name: true, status: true }
        }
      }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

// Create new task
const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { id: projectId } = req.params;
    const { title, description, priority = 'MEDIUM', dueDate, assignedToId } = req.body;
    const createdById = req.user.id;

    // If assignedToId is provided, verify the user is a project member
    if (assignedToId) {
      const isMember = await prisma.projectMember.findFirst({
        where: {
          projectId,
          userId: assignedToId
        }
      });

      if (!isMember) {
        return res.status(400).json({ 
          error: 'Cannot assign task to user who is not a project member' 
        });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assignedToId,
        createdById
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true }
        },
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { id } = req.params;
    const { title, description, status, priority, dueDate, assignedToId } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    // Get current task
    const currentTask = await prisma.task.findUnique({
      where: { id },
      include: { project: true }
    });

    if (!currentTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check permissions for assignment changes
    if (assignedToId && assignedToId !== currentTask.assignedToId) {
      if (!isAdmin) {
        return res.status(403).json({ 
          error: 'Only admins can change task assignments' 
        });
      }

      // Verify new assignee is project member
      const isMember = await prisma.projectMember.findFirst({
        where: {
          projectId: currentTask.projectId,
          userId: assignedToId
        }
      });

      if (!isMember) {
        return res.status(400).json({ 
          error: 'Cannot assign task to user who is not a project member' 
        });
      }
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(assignedToId !== undefined && { assignedToId })
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true }
        },
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Task not found' });
    }
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

// Delete task (Admin only)
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id }
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Task not found' });
    }
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

module.exports = {
  getProjectTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
};