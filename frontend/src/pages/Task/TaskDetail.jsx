import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import StatusBadge from '../../components/StatusBadge';
import { TASK_STATUS, PRIORITY } from '../../utils/constants';

const TaskDetail = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await api.get(`/tasks/${id}`);
      setTask(response.data.task);
      setFormData({
        title: response.data.task.title,
        description: response.data.task.description || '',
        status: response.data.task.status,
        priority: response.data.task.priority,
        dueDate: response.data.task.dueDate ? response.data.task.dueDate.split('T')[0] : '',
        assignedToId: response.data.task.assignedToId || ''
      });
    } catch (error) {
      console.error('Failed to fetch task:', error);
      navigate('/dashboard');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/tasks/${id}`, {
        ...formData,
        dueDate: formData.dueDate || null,
        assignedToId: formData.assignedToId || null
      });
      
      toast.success('Task updated successfully!');
      setEditing(false);
      fetchTask();
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted successfully!');
      navigate(`/projects/${task.project.id}`);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };

  const canEdit = () => {
    return isAdmin() || task.assignedToId === user.id || task.createdById === user.id;
  };

  const canDelete = () => {
    return isAdmin();
  };

  if (!task) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link to={`/projects/${task.project.id}`} className="btn-outline mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Project
        </Link>
        
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
              <StatusBadge status={task.status} type="task" />
              <StatusBadge status={task.priority} type="priority" />
            </div>
            <p className="text-gray-600">
              In project: <Link to={`/projects/${task.project.id}`} className="text-primary-600 hover:text-primary-700">{task.project.name}</Link>
            </p>
          </div>
          
          <div className="flex space-x-2">
            {canEdit() && (
              <button
                onClick={() => setEditing(!editing)}
                className="btn-outline"
              >
                <Edit className="h-4 w-4 mr-2" />
                {editing ? 'Cancel' : 'Edit'}
              </button>
            )}
            {canDelete() && (
              <button
                onClick={handleDelete}
                className="btn-outline text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Task Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Task Details</h3>
            </div>
            <div className="card-content">
              {editing ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      className="input"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={4}
                      className="textarea"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        className="select"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value={TASK_STATUS.TODO}>To Do</option>
                        <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                        <option value={TASK_STATUS.DONE}>Done</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        name="priority"
                        className="select"
                        value={formData.priority}
                        onChange={handleChange}
                        disabled={!isAdmin()}
                      >
                        <option value={PRIORITY.LOW}>Low</option>
                        <option value={PRIORITY.MEDIUM}>Medium</option>
                        <option value={PRIORITY.HIGH}>High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      className="input"
                      value={formData.dueDate}
                      onChange={handleChange}
                    />
                  </div>

                  {isAdmin() && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assign To
                      </label>
                      <select
                        name="assignedToId"
                        className="select"
                        value={formData.assignedToId}
                        onChange={handleChange}
                      >
                        <option value="">Unassigned</option>
                        {task.project.members?.map(member => (
                          <option key={member.user.id} value={member.user.id}>
                            {member.user.name} ({member.user.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? 'Updating...' : 'Update Task'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                    <p className="text-gray-900">
                      {task.description || 'No description provided'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Task Info */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Task Information</h3>
            </div>
            <div className="card-content space-y-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="text-sm font-medium">{formatDate(task.dueDate)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Assigned To</p>
                  <p className="text-sm font-medium">
                    {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Created By</p>
                  <p className="text-sm font-medium">{task.createdBy.name}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-sm font-medium">
                  {new Date(task.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;