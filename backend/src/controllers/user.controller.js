const prisma = require('../utils/database');

// Get all users (Admin only)
const getUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const whereClause = {
      ...(role && { role })
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              createdProjects: true,
              projectMembers: true,
              assignedTasks: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.user.count({ where: whereClause })
    ]);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        createdProjects: {
          select: {
            id: true,
            name: true,
            status: true,
            createdAt: true
          }
        },
        projectMembers: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
                status: true
              }
            }
          }
        },
        assignedTasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            dueDate: true,
            project: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;

    const stats = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        _count: {
          select: {
            createdProjects: true,
            projectMembers: true,
            assignedTasks: true,
            createdTasks: true
          }
        }
      }
    });

    if (!stats) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get task status breakdown
    const taskStats = await prisma.task.groupBy({
      by: ['status'],
      where: { assignedToId: userId },
      _count: { status: true }
    });

    const taskStatusCounts = {
      TODO: 0,
      IN_PROGRESS: 0,
      DONE: 0
    };

    taskStats.forEach(stat => {
      taskStatusCounts[stat.status] = stat._count.status;
    });

    res.json({
      stats: {
        ...stats._count,
        tasksByStatus: taskStatusCounts
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
};

module.exports = {
  getUsers,
  getUser,
  getUserStats
};