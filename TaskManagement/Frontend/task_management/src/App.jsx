
import './App.css'
import React from 'react'

import { AuthProvider } from './contexts/AuthProvider'
import { useAuth } from './contexts/useAuth'
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Projects from './pages/Projects';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui/sonner';
import Login from './pages/Login';
import { ToastProvider } from './contexts/ToastContext';

function ProtectedRoute({ children }) {
  const {isAuthenticated, loading} = useAuth();

  if (loading) {
    return <div>Loading...</div>
  }
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />
  }

  return children;
}


function App() {
  return (
    <AuthProvider>
      <ToastProvider>
      <Router>
        <Routes>
            <Route path = '/login' element = {<Login />} />
            <Route path='/' element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>


            <Route index element={<Dashboard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="projects" element={<Projects />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App


