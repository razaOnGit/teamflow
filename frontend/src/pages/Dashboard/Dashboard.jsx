import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import ProjectList from './ProjectList';
import { PROJECT_STATUS, PROJECT_STATUS_LABELS } from '../../utils/constants';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState({});
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects');
      setProjects(response.data.projects);
      calculateStats(response.data.projects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (projectList) => {
    const stats = {
      total: projectList.length,
      [PROJECT_STATUS.OPEN]: 0,
      [PROJECT_STATUS.IN_PROGRESS]: 0,
      [PROJECT_STATUS.ON_HOLD]: 0,
      [PROJECT_STATUS.RESOLVED]: 0,
      [PROJECT_STATUS.CANCELLED]: 0
    };

    projectList.forEach(project => {
      if (stats[project.status] !== undefined) {
        stats[project.status]++;
      }
    });

    setStats(stats);
  };

  const filteredProjects = activeTab === 'all' 
    ? projects 
    : projects.filter(project => project.status === activeTab);

  const tabs = [
    { key: 'all', label: 'All', count: stats.total },
    { key: PROJECT_STATUS.OPEN, label: PROJECT_STATUS_LABELS[PROJECT_STATUS.OPEN], count: stats[PROJECT_STATUS.OPEN] },
    { key: PROJECT_STATUS.IN_PROGRESS, label: PROJECT_STATUS_LABELS[PROJECT_STATUS.IN_PROGRESS], count: stats[PROJECT_STATUS.IN_PROGRESS] },
    { key: PROJECT_STATUS.ON_HOLD, label: PROJECT_STATUS_LABELS[PROJECT_STATUS.ON_HOLD], count: stats[PROJECT_STATUS.ON_HOLD] },
    { key: PROJECT_STATUS.RESOLVED, label: PROJECT_STATUS_LABELS[PROJECT_STATUS.RESOLVED], count: stats[PROJECT_STATUS.RESOLVED] },
    { key: PROJECT_STATUS.CANCELLED, label: PROJECT_STATUS_LABELS[PROJECT_STATUS.CANCELLED], count: stats[PROJECT_STATUS.CANCELLED] }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your projects and track progress</p>
        </div>
        {isAdmin() && (
          <Link
            to="/projects/create"
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {Object.values(PROJECT_STATUS).map(status => (
          <div key={status} className="card">
            <div className="card-content">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">{PROJECT_STATUS_LABELS[status]}</p>
                <p className="text-2xl font-bold text-gray-900">{stats[status] || 0}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`${
                activeTab === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <span>{tab.label}</span>
              <span className={`${
                activeTab === tab.key
                  ? 'bg-primary-100 text-primary-600'
                  : 'bg-gray-100 text-gray-900'
              } inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                {tab.count || 0}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Projects List */}
      <ProjectList projects={filteredProjects} onProjectUpdate={fetchProjects} />
    </div>
  );
};

export default Dashboard;