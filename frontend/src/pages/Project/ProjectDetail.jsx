import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, Users, CheckSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import { TASK_STATUS, TASK_STATUS_LABELS } from '../../utils/constants';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTaskTab, setActiveTaskTab] = useState('all');
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data.project);
    } catch (error) {
      console.error('Failed to fetch project:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/projects/${id}/tasks`);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString();
  };

  const getTaskStats = () => {
    const stats = {
      total: tasks.length,
      [TASK_STATUS.TODO]: 0,
      [TASK_STATUS.IN_PROGRESS]: 0,
      [TASK_STATUS.DONE]: 0,
      overdue: 0
    };

    const now = new Date();
    tasks.forEach(task => {
      if (stats[task.status] !== undefined) {
        stats[task.status]++;
      }
      if (task.dueDate && new Date(task.dueDate) < now && task.status !== TASK_STATUS.DONE) {
        stats.overdue++;
      }
    });

    return stats;
  };

  const filteredTasks = () => {
    if (activeTaskTab === 'all') return tasks;
    if (activeTaskTab === 'overdue') {
      const now = new Date();
      return tasks.filter(task => 
        task.dueDate && 
        new Date(task.dueDate) < now && 
        task.status !== TASK_STATUS.DONE
      );
    }
    return tasks.filter(task => task.status === activeTaskTab);
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const taskStats = getTaskStats();
  const taskTabs = [
    { key: 'all', label: 'All Tasks', count: taskStats.total },
    { key: TASK_STATUS.TODO, label: TASK_STATUS_LABELS[TASK_STATUS.TODO], count: taskStats[TASK_STATUS.TODO] },
    { key: TASK_STATUS.IN_PROGRESS, label: TASK_STATUS_LABELS[TASK_STATUS.IN_PROGRESS], count: taskStats[TASK_STATUS.IN_PROGRESS] },
    { key: TASK_STATUS.DONE, label: TASK_STATUS_LABELS[TASK_STATUS.DONE], count: taskStats[TASK_STATUS.DONE] },
    { key: 'overdue', label: 'Overdue', count: taskStats.overdue }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/dashboard" className="btn-outline mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-gray-600 mb-4">{project.description}</p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Deadline: {formatDate(project.deadline)}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{project.members?.length || 0} members</span>
              </div>
              <div className="flex items-center">
                <CheckSquare className="h-4 w-4 mr-1" />
                <span>{taskStats.total} tasks</span>
              </div>
            </div>
          </div>
          
          <Link
            to={`/projects/${id}/tasks/create`}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Link>
        </div>
      </div>

      {/* Project Members */}
      {project.members && project.members.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Team Members</h3>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.members.map((member) => (
                <div key={member.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                      {member.user.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{member.user.name}</p>
                    <p className="text-sm text-gray-500">{member.user.email}</p>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {member.user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Task Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {taskTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTaskTab(tab.key)}
              className={`${
                activeTaskTab === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <span>{tab.label}</span>
              <span className={`${
                activeTaskTab === tab.key
                  ? 'bg-primary-100 text-primary-600'
                  : 'bg-gray-100 text-gray-900'
              } inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                {tab.count || 0}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredTasks().length === 0 ? (
          <div className="text-center py-12">
            <CheckSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500">Create your first task to get started.</p>
          </div>
        ) : (
          filteredTasks().map(task => (
            <Link key={task.id} to={`/tasks/${task.id}`}>
              <div className="card hover:shadow-md transition-shadow cursor-pointer">
                <div className="card-content">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">{task.title}</h4>
                        <StatusBadge status={task.status} type="task" />
                        <StatusBadge status={task.priority} type="priority" />
                      </div>
                      
                      {task.description && (
                        <p className="text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {task.assignedTo && (
                          <span>Assigned to: {task.assignedTo.name}</span>
                        )}
                        {task.dueDate && (
                          <span>Due: {formatDate(task.dueDate)}</span>
                        )}
                        <span>Created by: {task.createdBy.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;