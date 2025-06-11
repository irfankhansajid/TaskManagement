
import './App.css'
import React, { useEffect } from 'react'

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


import PropType from 'prop-types';
import { toast } from 'sonner';

const ProtectedRoute = ({ children })  => {
  const {isAuthenticated, loading} = useAuth();

  if (loading) {
    return <div>Loading...</div>
  }
  if (!isAuthenticated) {
    return <Navigate to = {"/login"} />
  }
  return children;
}

ProtectedRoute.propTypes = {
  children: PropType.node.isRequired,
}

const AdminRoute = ({ children }) => {
    const { user } = useAuth();
    if (user?.role !== "ADMIN") {
      return <Navigate to="/" />
    }
    return children;
}


function App() {

  useEffect(() => {
    const handler = () => {
      toast({
        title      : 'Session expired',
        description: 'You have been logged out due to inactivity. Please log in again.',
        variant    : 'destructive',
        duration   : 5000,
      })
    }
    window.addEventListener('sessionExpired', handler);
    return () => {
      window.removeEventListener('sessionExpired', handler);
    }
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
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
          <Toaster
            richColors
            position="top-right"
            toastOptions={{
              classNames: {
                destructive: "bg-red-500 text-white border-red-700", 
              },
            }}
          />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App


