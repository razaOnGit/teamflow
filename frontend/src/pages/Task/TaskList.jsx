import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';
import api from '../../api/axios';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            // First get all projects, then get tasks from each project
            const projectsResponse = await api.get('/projects');
            const projects = projectsResponse.data.projects || [];

            // Fetch tasks from all projects
            const allTasks = [];
            for (const project of projects) {
                try {
                    const tasksResponse = await api.get(`/projects/${project.id}/tasks`);
                    const projectTasks = tasksResponse.data.tasks || [];
                    // Add project info to each task
                    const tasksWithProject = projectTasks.map(task => ({
                        ...task,
                        project: { id: project.id, name: project.name }
                    }));
                    allTasks.push(...tasksWithProject);
                } catch (error) {
                    console.error(`Failed to fetch tasks for project ${project.id}:`, error);
                }
            }

            setTasks(allTasks);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
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
                    <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
                    <p className="text-gray-600">View and manage all tasks</p>
                </div>
            </div>

            {/* Tasks List */}
            {tasks.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <CheckSquare className="mx-auto h-12 w-12" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                    <p className="text-gray-500">Tasks will appear here when they are created in projects.</p>
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {tasks.map((task) => (
                            <li key={task.id}>
                                <Link to={`/tasks/${task.id}`} className="block hover:bg-gray-50">
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center min-w-0 flex-1">
                                                <div className="flex-shrink-0">
                                                    <CheckSquare className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <div className="ml-4 min-w-0 flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                                                        {task.priority && (
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${task.priority === 'high'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : task.priority === 'medium'
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : 'bg-green-100 text-red-800'
                                                                }`}>
                                                                {task.priority}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {task.description && (
                                                        <p className="text-sm text-gray-500 truncate">{task.description}</p>
                                                    )}
                                                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                                                        {task.project && (
                                                            <span>Project: {task.project.name}</span>
                                                        )}
                                                        {task.assignedTo && (
                                                            <span>Assigned to: {task.assignedTo.name}</span>
                                                        )}
                                                        {task.dueDate && (
                                                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${task.status === 'done'
                                                        ? 'bg-green-10 text-red-800'
                                                        : task.status === 'in_progress'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {task.status?.replace('_', ' ') || 'todo'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TaskList;