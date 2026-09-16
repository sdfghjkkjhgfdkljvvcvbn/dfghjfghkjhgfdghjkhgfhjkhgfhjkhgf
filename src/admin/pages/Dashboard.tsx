import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Home,
  Palette,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardBody, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { useAuthStore } from '../store/authStore';
import { enquiriesService, projectsService, servicesService, blogService } from '../services/supabaseClient';

interface MetricCard {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  href: string;
}

interface Activity {
  title: string;
  time: string;
  type: string;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [metrics, setMetrics] = useState<MetricCard[]>([
    {
      title: 'Enquiries',
      value: 0,
      subtitle: 'Total received',
      icon: <Mail className="w-6 h-6" />,
      href: '/admin/enquiries',
    },
    {
      title: 'Projects',
      value: 0,
      subtitle: 'Published',
      icon: <Home className="w-6 h-6" />,
      href: '/admin/projects',
    },
    {
      title: 'Services',
      value: 0,
      subtitle: 'Available',
      icon: <Palette className="w-6 h-6" />,
      href: '/admin/services',
    },
    {
      title: 'Blog Posts',
      value: 0,
      subtitle: 'Published',
      icon: <BookOpen className="w-6 h-6" />,
      href: '/admin/blog',
    },
  ]);

  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Fetch all data
      const [enquiries, projects, services, blogs] = await Promise.all([
        enquiriesService.getAll(),
        projectsService.getAll(),
        servicesService.getAll(),
        blogService.getAll(),
      ]);

      // Update metrics
      setMetrics(prev => [
        { ...prev[0], value: enquiries?.length || 0 },
        { ...prev[1], value: projects?.length || 0 },
        { ...prev[2], value: services?.length || 0 },
        { ...prev[3], value: blogs?.length || 0 },
      ]);

      // Build recent activities from all data
      const activities: Activity[] = [];

      // Add enquiries
      if (enquiries && enquiries.length > 0) {
        enquiries.slice(0, 3).forEach((enquiry: any) => {
          activities.push({
            title: `Enquiry from ${enquiry.name}`,
            time: new Date(enquiry.created_at).toLocaleDateString(),
            type: 'enquiry',
          });
        });
      }

      // Add projects
      if (projects && projects.length > 0) {
        projects.slice(0, 2).forEach((project: any) => {
          activities.push({
            title: `${project.title}`,
            time: new Date(project.created_at).toLocaleDateString(),
            type: 'project',
          });
        });
      }

      // Add services
      if (services && services.length > 0) {
        services.slice(0, 1).forEach((service: any) => {
          activities.push({
            title: `${service.name}`,
            time: new Date(service.created_at).toLocaleDateString(),
            type: 'service',
          });
        });
      }

      setRecentActivities(activities.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  return (
    <DashboardLayout pageTitle="Dashboard" pageDescription="Overview of your content and activity">
      <div className="space-y-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <Link key={index} to={metric.href}>
              <Card className="hover:shadow-md transition-all cursor-pointer h-full">
                <CardBody className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="text-[#8F2F2F]">
                      {metric.icon}
                    </div>
                  </div>
                  <div>
                    <p className="text-[#77736D] text-xs font-light tracking-widest uppercase">
                      {metric.subtitle}
                    </p>
                    <p className="text-4xl font-light text-[#202124] mt-2">
                      {metric.value}
                    </p>
                    <p className="text-sm text-[#77736D] mt-3 font-light">
                      {metric.title}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader title="Recent Activity" />
              <CardBody>
                {recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between pb-4 border-b border-[#E5E1DA] last:border-0"
                      >
                        <div className="flex-1">
                          <p className="text-[#202124] font-light">
                            {activity.title}
                          </p>
                          <p className="text-xs text-[#77736D] mt-1">
                            {activity.time}
                          </p>
                        </div>
                        <div className="px-3 py-1 rounded-lg bg-[#F7F6F2] text-xs font-light text-[#77736D] capitalize">
                          {activity.type}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#77736D] text-sm font-light text-center py-8">
                    No activity yet
                  </p>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader title="Quick Access" />
              <CardBody className="space-y-2">
                <Link to="/admin/enquiries">
                  <Button
                    variant="secondary"
                    className="w-full justify-between text-sm"
                  >
                    View Enquiries
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/admin/services">
                  <Button
                    variant="secondary"
                    className="w-full justify-between text-sm"
                  >
                    Manage Services
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/admin/projects">
                  <Button
                    variant="secondary"
                    className="w-full justify-between text-sm"
                  >
                    View Projects
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/admin/gallery">
                  <Button
                    variant="secondary"
                    className="w-full justify-between text-sm"
                  >
                    Gallery
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
