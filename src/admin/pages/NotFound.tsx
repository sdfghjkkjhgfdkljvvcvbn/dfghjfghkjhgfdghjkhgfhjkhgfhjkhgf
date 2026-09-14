import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { Button } from '../components/Button';

export const NotFound: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-96">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-8">Page not found</p>
        <Link to="/admin/dashboard">
          <Button variant="primary">Back to Dashboard</Button>
        </Link>
      </div>
    </DashboardLayout>
  );
};
