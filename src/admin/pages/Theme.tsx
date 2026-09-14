import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardBody, CardHeader } from '../components/Card';

export const Theme: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Theme Customizer</h1>
          <p className="text-gray-600 mt-2">Customize colors, fonts, and styling with live preview</p>
        </div>

        <Card>
          <CardHeader title="Theme Customizer" />
          <CardBody>
            <div className="text-center py-12">
              <p className="text-gray-600">
                Theme Customizer module coming soon in Phase 4...
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
};
