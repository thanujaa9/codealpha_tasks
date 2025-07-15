import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import RegisterPage from './pages/Auth/RegisterPage';
import LoginPage from './pages/Auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ProjectsPage from './pages/ProjectsPage';
import TaskDetailPage from './pages/TaskDetailsPage';
import AllTasksPage from './pages/AllTasksPage';
import CreateProjectPage from './pages/CreateProjectPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import EditProjectPage from './pages/EditProjectPage';
import Navbar from './components/Navbar'; 
import ProjectTasksPage from './pages/ProjectTasksPage';
import CreateTaskPage from './pages/CreateTaskPage';
import EditTaskPage from './pages/EditTaskPage';
import MyTasksPage from './pages/MyTasksPage';
import TasksDueTodayPage from './pages/TasksDueTodayPage'; 
import ProjectsDueTodayPage from './pages/ProjectsDueTodayPage';
import { useAuth } from './context/AuthContext';


function App() {
  const { isAuthenticated, loading } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    console.log("App.js useEffect: loading =", loading, ", isAuthenticated =", isAuthenticated, ", path =", window.location.pathname);

    if (!loading) {
      const currentPath = window.location.pathname;

      if (isAuthenticated) {
        if (currentPath === '/login' || currentPath === '/register' || currentPath === '/') {
          console.log("App.js: Authenticated on public path, redirecting to Dashboard.");
          navigate('/dashboard', { replace: true });
        }
      } else {
        if (currentPath !== '/login' && currentPath !== '/register') {
          console.log("App.js: Not authenticated on protected path, redirecting to login.");
          navigate('/login', { replace: true });
        }
      }
    }
  }, [isAuthenticated, loading, navigate]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 font-sans">
        <p className="text-xl">Loading application data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50 font-sans transition-colors duration-500">

      {}
      {}
      <Navbar />

      <main className="container mx-auto py-8">
        <Routes>
  {/* Auth */}
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/" element={isAuthenticated ? <DashboardPage /> : <LoginPage />} />

  {/* Dashboard & Profile */}
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/profile" element={<ProfilePage />} />

  {/* Projects */}
  <Route path="/projects" element={<ProjectsPage />} />
  <Route path="/projects/create" element={<CreateProjectPage />} />
  <Route path="/projects/:id" element={<ProjectDetailsPage />} />
  <Route path="/projects/:id/edit" element={<EditProjectPage />} />
  <Route path="/projects/:id/create-task" element={<CreateTaskPage />} />
  <Route path="/project/:projectId/tasks" element={<ProjectTasksPage />} />
  <Route path="/projects/due-today" element={<ProjectsDueTodayPage />} />
  {/* Tasks */}
  <Route path="/all-tasks" element={<AllTasksPage />} />
  <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
  <Route path="/tasks/:taskId/edit" element={<EditTaskPage />} />
  <Route path="/my-tasks" element={<MyTasksPage />} />
  <Route path="/tasks/due-today" element={<TasksDueTodayPage />} />
</Routes>

      </main>
    </div>
  );
}

export default App;
