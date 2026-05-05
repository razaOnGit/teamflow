import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FolderOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import ProjectList from '../Dashboard/ProjectList';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects');
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">View and manage all projects</p>
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

      {/* Projects List */}
      <ProjectList projects={projects} onProjectUpdate={fetchProjects} />
    </div>
  );
};

export default Projects;