import React from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Briefcase,
  Palette,
  FileText,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardBody, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { useAuthStore } from '../store/authStore';

interface MetricCard {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  const metrics: MetricCard[] = [
    {
      title: 'New Enquiries',
      value: 12,
      subtitle: 'This month',
      icon: <MessageSquare className="w-8 h-8" />,
      href: '/admin/enquiries',
      color: 'text-blue-600',
    },
    {
      title: 'Projects',
      value: 45,
      subtitle: 'Published',
      icon: <Briefcase className="w-8 h-8" />,
      href: '/admin/projects',
      color: 'text-green-600',
    },
    {
      title: 'Services',
      value: 8,
      subtitle: 'Active',
      icon: <Palette className="w-8 h-8" />,
      href: '/admin/services',
      color: 'text-purple-600',
    },
    {
      title: 'Blog Posts',
      value: 23,
      subtitle: 'Published',
      icon: <FileText className="w-8 h-8" />,
      href: '/admin/blog',
      color: 'text-orange-600',
    },
  ];

  const recentActivities = [
    { title: 'New enquiry from Rajesh Kumar', time: '2 hours ago', type: 'enquiry' },
    { title: 'Published "Modern Kitchen Design" blog post', time: '5 hours ago', type: 'blog' },
    { title: 'Added "Modular Kitchen" service', time: '1 day ago', type: 'service' },
    { title: 'Updated project gallery', time: '2 days ago', type: 'project' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.full_name || 'Admin'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's an overview of your admin panel
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Link key={index} to={metric.href}>
              <Card className="hover:shadow-lg hover:border-red-200 transition-all cursor-pointer h-full">
                <CardBody className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={metric.color}>
                      {metric.icon}
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      {metric.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {metric.value}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {metric.subtitle}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader title="Recent Activity" />
              <CardBody>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0"
                    >
                      <div>
                        <p className="text-gray-900 font-medium">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-700 capitalize">
                        {activity.type}
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader title="Quick Actions" />
              <CardBody className="space-y-3">
                <Link to="/admin/enquiries">
                  <Button
                    variant="secondary"
                    className="w-full justify-between"
                  >
                    View Enquiries
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/admin/projects">
                  <Button
                    variant="secondary"
                    className="w-full justify-between"
                  >
                    Add Project
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/admin/blog">
                  <Button
                    variant="secondary"
                    className="w-full justify-between"
                  >
                    Write Blog
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/admin/theme">
                  <Button
                    variant="secondary"
                    className="w-full justify-between"
                  >
                    Customize Theme
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Getting Started */}
        <Card>
          <CardHeader
            title="Getting Started"
            description="Follow these steps to set up your admin panel"
          />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-10 h-10 bg-red-600 text-white rounded-lg flex items-center justify-center font-bold">
                  1
                </div>
                <h4 className="font-semibold text-gray-900">Setup Services</h4>
                <p className="text-sm text-gray-600">
                  Create your service categories and packages
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 bg-red-600 text-white rounded-lg flex items-center justify-center font-bold">
                  2
                </div>
                <h4 className="font-semibold text-gray-900">Add Projects</h4>
                <p className="text-sm text-gray-600">
                  Upload your portfolio projects
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 bg-red-600 text-white rounded-lg flex items-center justify-center font-bold">
                  3
                </div>
                <h4 className="font-semibold text-gray-900">Customize Theme</h4>
                <p className="text-sm text-gray-600">
                  Personalize your branding and colors
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
};
