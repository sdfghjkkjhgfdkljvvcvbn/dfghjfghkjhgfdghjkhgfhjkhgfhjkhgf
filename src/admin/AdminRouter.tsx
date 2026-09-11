import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
import { Packages } from './pages/Packages';
import { Theme } from './pages/Theme';
import { Settings } from './pages/Settings';
import { HappyClients } from './pages/HappyClients';

export const AdminRouter: React.FC = () => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      {/* Login Route (Public) */}
      <Route path="/login" element={<Login />} />

      {/* Dashboard Routes (Protected) */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/enquiries" element={<Enquiries />} />
      <Route path="/hero-slider" element={<HeroSlider />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/services" element={<Services />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/theme" element={<Theme />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/happy-clients" element={<HappyClients />} />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
