import { STATUS_COLORS, PROJECT_STATUS_LABELS, TASK_STATUS_LABELS, PRIORITY_LABELS } from '../utils/constants';

const StatusBadge = ({ status, type = 'project' }) => {
  const getLabel = () => {
    switch (type) {
      case 'task':
        return TASK_STATUS_LABELS[status] || status;
      case 'priority':
        return PRIORITY_LABELS[status] || status;
      default:
        return PROJECT_STATUS_LABELS[status] || status;
    }
  };

  const colorClass = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {getLabel()}
    </span>
  );
};

export default StatusBadge;