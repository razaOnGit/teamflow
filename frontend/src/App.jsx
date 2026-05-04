import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Auth pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

// Dashboard
import Dashboard from './pages/Dashboard/Dashboard';

// Project pages
import ProjectDetail from './pages/Project/ProjectDetail';
import CreateProject from './pages/Project/CreateProject';

// Task pages
import TaskDetail from './pages/Task/TaskDetail';
import CreateTask from './pages/Task/CreateTask';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If user is not authenticated, show auth routes
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // If user is authenticated, show main app with layout
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 md:ml-64 pt-16">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/projects/:id" 
                  element={
                    <ProtectedRoute>
                      <ProjectDetail />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/projects/create" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <CreateProject />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/projects/:projectId/tasks/create" 
                  element={
                    <ProtectedRoute>
                      <CreateTask />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/tasks/:id" 
                  element={
                    <ProtectedRoute>
                      <TaskDetail />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;