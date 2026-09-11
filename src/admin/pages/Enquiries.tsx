import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardBody, CardHeader } from '../components/Card';
import { enquiriesService } from '../services/supabaseClient';
import { useUIStore } from '../store/uiStore';

interface Enquiry {
  id: string;
  customer_name?: string;
  email?: string;
  phone?: string;
  service_type?: string;
  status?: string;
  created_at?: string;
  [key: string]: any;
}

export const Enquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useUIStore();

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const data = await enquiriesService.getAll();
      console.log('Loaded enquiries:', data);
      setEnquiries(data || []);
      
      const subscription = enquiriesService.subscribe((payload: any) => {
        console.log('Enquiries update:', payload);
        loadEnquiries();
      });
      
      return () => subscription?.unsubscribe();
    } catch (error: any) {
      console.error('Error loading enquiries:', error);
      addNotification({
        type: 'error',
        message: 'Failed to load enquiries',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enquiries</h1>
          <p className="text-gray-600 mt-2">Manage customer enquiries and follow-ups ({enquiries.length} total)</p>
        </div>

        {loading ? (
          <Card>
            <CardBody className="text-center py-12">
              <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading enquiries...</p>
            </CardBody>
          </Card>
        ) : enquiries.length === 0 ? (
          <Card>
            <CardHeader title="No Enquiries Yet" />
            <CardBody>
              <p className="text-gray-600 text-center py-6">
                No customer enquiries yet. They will appear here when customers submit the form on your website.
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-3">
            {enquiries.map((enquiry) => (
              <Card key={enquiry.id}>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Name</p>
                      <p className="font-semibold text-gray-900">{enquiry.customer_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Email</p>
                      <p className="text-sm text-gray-600">{enquiry.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Phone</p>
                      <p className="text-sm text-gray-600">{enquiry.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Status</p>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                        enquiry.status === 'New' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {enquiry.status || 'New'}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
