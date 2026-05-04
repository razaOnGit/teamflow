export const PROJECT_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  ON_HOLD: 'ON_HOLD',
  RESOLVED: 'RESOLVED',
  CANCELLED: 'CANCELLED'
};

export const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE'
};

export const PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
};

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER'
};

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUS.OPEN]: 'Open',
  [PROJECT_STATUS.IN_PROGRESS]: 'In Progress',
  [PROJECT_STATUS.ON_HOLD]: 'On Hold',
  [PROJECT_STATUS.RESOLVED]: 'Resolved',
  [PROJECT_STATUS.CANCELLED]: 'Cancelled'
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]: 'To Do',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.DONE]: 'Done'
};

export const PRIORITY_LABELS = {
  [PRIORITY.LOW]: 'Low',
  [PRIORITY.MEDIUM]: 'Medium',
  [PRIORITY.HIGH]: 'High'
};

export const STATUS_COLORS = {
  // Project status colors
  [PROJECT_STATUS.OPEN]: 'bg-blue-100 text-blue-800',
  [PROJECT_STATUS.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
  [PROJECT_STATUS.ON_HOLD]: 'bg-orange-100 text-orange-800',
  [PROJECT_STATUS.RESOLVED]: 'bg-green-100 text-green-800',
  [PROJECT_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
  
  // Task status colors
  [TASK_STATUS.TODO]: 'bg-gray-100 text-gray-800',
  [TASK_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [TASK_STATUS.DONE]: 'bg-green-100 text-green-800',
  
  // Priority colors
  [PRIORITY.LOW]: 'bg-gray-100 text-gray-800',
  [PRIORITY.MEDIUM]: 'bg-yellow-100 text-yellow-800',
  [PRIORITY.HIGH]: 'bg-red-100 text-red-800'
};