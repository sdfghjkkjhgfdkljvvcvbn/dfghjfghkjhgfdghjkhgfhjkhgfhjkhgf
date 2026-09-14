import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Enquiries } from './pages/Enquiries';
import { HeroSlider } from './pages/HeroSlider';
import { Gallery } from './pages/Gallery';
import { Projects } from './pages/Projects';
import { Blog } from './pages/Blog';
import { Services } from './pages/Services';
import { Settings } from './pages/Settings';
import { HappyClients } from './pages/HappyClients';

// Protected Route Component
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? element : <Navigate to="/admin/login" replace />;
};

export const AdminRouter: React.FC = () => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      await checkAuth();
      setIsLoading(false);
    };
    authenticate();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Login Route (Public) */}
      <Route path="/login" element={<Login />} />

      {/* Dashboard Routes (Protected) */}
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/enquiries" element={<ProtectedRoute element={<Enquiries />} />} />
      <Route path="/hero-slider" element={<ProtectedRoute element={<HeroSlider />} />} />
      <Route path="/gallery" element={<ProtectedRoute element={<Gallery />} />} />
      <Route path="/projects" element={<ProtectedRoute element={<Projects />} />} />
      <Route path="/blog" element={<ProtectedRoute element={<Blog />} />} />
      <Route path="/services" element={<ProtectedRoute element={<Services />} />} />
      <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
      <Route path="/happy-clients" element={<ProtectedRoute element={<HappyClients />} />} />

      {/* Default redirect - if authenticated go to dashboard, else go to login */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/admin/dashboard" : "/admin/login"} replace />} />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};
