import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardBody, CardHeader } from '../components/Card';

export const Settings: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Configure admin panel settings and preferences</p>
        </div>

        <Card>
          <CardHeader title="Settings" />
          <CardBody>
            <div className="text-center py-12">
              <p className="text-gray-600">
                Settings module coming soon in Phase 4...
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
};
