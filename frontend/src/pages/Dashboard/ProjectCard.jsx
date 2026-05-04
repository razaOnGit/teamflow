import { Link } from 'react-router-dom';
import { Calendar, Users, CheckSquare } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

const ProjectCard = ({ project }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString();
  };

  const getProgressPercentage = () => {
    if (!project.taskStats || project.taskStats.total === 0) return 0;
    return Math.round((project.taskStats.done / project.taskStats.total) * 100);
  };

  const progressPercentage = getProgressPercentage();

  return (
    <Link to={`/projects/${project.id}`} className="block">
      <div className="card hover:shadow-md transition-shadow cursor-pointer">
        <div className="card-header">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {project.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {project.description || 'No description'}
              </p>
            </div>
            <StatusBadge status={project.status} />
          </div>
        </div>

        <div className="card-content space-y-4">
          {/* Project Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(project.deadline)}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{project._count?.members || 0} members</span>
            </div>
          </div>

          {/* Task Progress */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <div className="flex items-center">
                <CheckSquare className="h-4 w-4 mr-1 text-gray-500" />
                <span className="text-gray-600">Tasks</span>
              </div>
              <span className="text-gray-900 font-medium">
                {project.taskStats?.done || 0}/{project.taskStats?.total || 0}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{progressPercentage}% complete</span>
              {project.taskStats?.total > 0 && (
                <span>
                  {project.taskStats.inProgress || 0} in progress
                </span>
              )}
            </div>
          </div>

          {/* Team Members Preview */}
          {project.members && project.members.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Team</p>
              <div className="flex -space-x-2">
                {project.members.slice(0, 3).map((member) => (
                  <div
                    key={member.id}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-500 text-white text-xs font-medium border-2 border-white"
                    title={member.user.name}
                  >
                    {member.user.name.charAt(0).toUpperCase()}
                  </div>
                ))}
                {project.members.length > 3 && (
                  <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-300 text-gray-600 text-xs font-medium border-2 border-white">
                    +{project.members.length - 3}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;