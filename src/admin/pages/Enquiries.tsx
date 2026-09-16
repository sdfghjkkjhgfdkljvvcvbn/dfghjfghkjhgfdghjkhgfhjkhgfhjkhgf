import React, { useState, useEffect } from 'react';
import { Search, MessageCircle, Phone, Mail, Calendar, X } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardBody, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { supabase } from '../services/supabaseClient';
import { useUIStore } from '../store/uiStore';

interface Booking {
  id: string;
  name: string;
  phone: string;
  email?: string;
  event_date?: string;
  requirement: string;
  message?: string;
  notes?: string;
  source?: string;
  status: 'new' | 'contacted' | 'booked' | 'closed';
  created_at: string;
  updated_at?: string;
}

type FilterStatus = 'all' | 'new' | 'contacted' | 'booked' | 'closed';

export const Enquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Booking[]>([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Booking | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const { addNotification } = useUIStore();

  useEffect(() => {
    loadEnquiries();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('bookings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        console.log('Bookings updated');
        loadEnquiries();
      })
      .subscribe();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Filter and search enquiries whenever filters change
  useEffect(() => {
    let filtered = enquiries;

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(e => e.status === filterStatus);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(term) ||
        e.phone.includes(term) ||
        (e.email && e.email.toLowerCase().includes(term)) ||
        (e.requirement && e.requirement.toLowerCase().includes(term))
      );
    }

    // Apply sort
    filtered = [...filtered].sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
    });

    setFilteredEnquiries(filtered);
  }, [enquiries, filterStatus, searchTerm, sortBy]);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      console.log('Loading enquiries from bookings table...');
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Loaded enquiries:', data);
      setEnquiries(data || []);
    } catch (error: any) {
      console.error('Error loading enquiries:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      const errorMsg = error.message || 'Failed to load enquiries. Make sure the bookings table exists in Supabase.';
      addNotification({
        type: 'error',
        message: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      addNotification({
        type: 'success',
        message: 'Status updated',
      });
      await loadEnquiries();
      setSelectedEnquiry(null);
    } catch (error: any) {
      console.error('Error updating status:', error);
      addNotification({
        type: 'error',
        message: 'Failed to update status',
      });
    }
  };

  const handleAddNote = async (id: string, note: string) => {
    if (!note.trim()) return;

    try {
      const enquiry = enquiries.find(e => e.id === id);
      const existingNotes = enquiry?.notes || '';
      const newNotes = existingNotes
        ? `${existingNotes}\n---\n[${new Date().toLocaleString()}] ${note}`
        : `[${new Date().toLocaleString()}] ${note}`;

      const { error } = await supabase
        .from('bookings')
        .update({ notes: newNotes })
        .eq('id', id);

      if (error) throw error;

      addNotification({
        type: 'success',
        message: 'Note added',
      });
      await loadEnquiries();
      if (selectedEnquiry?.id === id) {
        const updated = enquiries.find(e => e.id === id);
        if (updated) setSelectedEnquiry(updated);
      }
    } catch (error: any) {
      console.error('Error adding note:', error);
      addNotification({
        type: 'error',
        message: 'Failed to add note',
      });
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-50 text-blue-600';
      case 'contacted':
        return 'bg-amber-50 text-amber-600';
      case 'booked':
        return 'bg-emerald-50 text-emerald-600';
      case 'closed':
        return 'bg-[#F7F6F2] text-[#77736D]';
      default:
        return 'bg-[#F7F6F2] text-[#77736D]';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new':
        return 'New';
      case 'contacted':
        return 'Contacted';
      case 'booked':
        return 'Booked';
      case 'closed':
        return 'Closed';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout pageTitle="Enquiries" pageDescription={`Manage customer enquiries and bookings (${enquiries.length} total)`}>
      <div className="space-y-6">

        {loading ? (
          <Card>
            <CardBody className="text-center py-12">
              <div className="w-8 h-8 border-4 border-[#8F2F2F] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-[#77736D] mt-4 font-light">Loading enquiries...</p>
            </CardBody>
          </Card>
        ) : enquiries.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-[#77736D] font-light">No customer enquiries yet. They will appear here when customers submit the booking form on your website.</p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Search and Filters */}
              <Card>
                <CardBody>
                  <div className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#77736D]" />
                      <input
                        type="text"
                        placeholder="Search by name, phone, email, service..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-[#E5E1DA] rounded-lg focus:outline-none focus:border-[#8F2F2F] focus:ring-1 focus:ring-[#8F2F2F]/20"
                      />
                    </div>

                    {/* Status Filters */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: 'all' as FilterStatus, label: 'All', count: enquiries.length },
                        { value: 'new' as FilterStatus, label: 'New', count: enquiries.filter(e => e.status === 'new').length },
                        { value: 'contacted' as FilterStatus, label: 'Contacted', count: enquiries.filter(e => e.status === 'contacted').length },
                        { value: 'booked' as FilterStatus, label: 'Booked', count: enquiries.filter(e => e.status === 'booked').length },
                        { value: 'closed' as FilterStatus, label: 'Closed', count: enquiries.filter(e => e.status === 'closed').length },
                      ].map(filter => (
                        <button
                          key={filter.value}
                          onClick={() => setFilterStatus(filter.value)}
                          className={`px-3 py-1.5 rounded-lg font-light text-sm transition-all ${
                            filterStatus === filter.value
                              ? 'bg-[#8F2F2F] text-white'
                              : 'bg-[#F7F6F2] text-[#77736D] hover:bg-[#EFEFEA]'
                          }`}
                        >
                          {filter.label} ({filter.count})
                        </button>
                      ))}
                    </div>

                    {/* Sort */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSortBy('newest')}
                        className={`px-3 py-1 text-sm rounded-lg transition-all font-light ${
                          sortBy === 'newest'
                            ? 'bg-[#8F2F2F] text-white'
                            : 'bg-[#F7F6F2] text-[#77736D] hover:bg-[#EFEFEA]'
                        }`}
                      >
                        Newest First
                      </button>
                      <button
                        onClick={() => setSortBy('oldest')}
                        className={`px-3 py-1 text-sm rounded-lg transition-all font-light ${
                          sortBy === 'oldest'
                            ? 'bg-[#8F2F2F] text-white'
                            : 'bg-[#F7F6F2] text-[#77736D] hover:bg-[#EFEFEA]'
                        }`}
                      >
                        Oldest First
                      </button>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Enquiries List */}
              <div className="space-y-2">
                {filteredEnquiries.length === 0 ? (
                  <Card>
                    <CardBody className="text-center py-8">
                      <p className="text-gray-500">No enquiries match your filters</p>
                    </CardBody>
                  </Card>
                ) : (
                  filteredEnquiries.map(enquiry => (
                    <div
                      key={enquiry.id}
                      onClick={() => setSelectedEnquiry(enquiry)}
                      className={`p-4 border rounded-[10px] cursor-pointer transition-all ${
                        selectedEnquiry?.id === enquiry.id
                          ? 'border-[#8F2F2F] bg-white shadow-md'
                          : 'border-[#E5E1DA] hover:border-[#D4CDBF] bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-light text-[#202124] truncate">{enquiry.name}</h3>
                            <span className={`px-2 py-0.5 text-xs font-light rounded-lg flex-shrink-0 ${getStatusBadgeColor(enquiry.status)}`}>
                              {getStatusLabel(enquiry.status)}
                            </span>
                          </div>
                          <p className="text-sm text-[#77736D] mb-2 font-light">{enquiry.requirement}</p>
                          <div className="flex flex-wrap gap-4 text-xs text-[#77736D]">
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {enquiry.phone}
                            </div>
                            {enquiry.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {enquiry.email}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(enquiry.created_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Details Panel */}
            {selectedEnquiry && (
              <div className="lg:col-span-1">
                <Card>
                  <CardBody className="space-y-4">
                    {/* Close Button */}
                    <button
                      onClick={() => setSelectedEnquiry(null)}
                      className="absolute top-4 right-4 p-1 hover:bg-[#F7F6F2] rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-[#77736D]" />
                    </button>

                    <div>
                      <h3 className="text-lg font-light text-[#202124] mb-1">{selectedEnquiry.name}</h3>
                      <p className="text-sm text-[#77736D] font-light">{selectedEnquiry.requirement}</p>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="text-xs font-light text-[#77736D] uppercase block mb-2 tracking-widest">Status</label>
                      <select
                        value={selectedEnquiry.status}
                        onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg font-light text-sm focus:outline-none ${getStatusBadgeColor(selectedEnquiry.status)}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="booked">Booked</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 p-3 bg-[#F7F6F2] rounded-lg">
                      <div>
                        <p className="text-xs text-[#77736D] font-light">Phone</p>
                        <a href={`tel:${selectedEnquiry.phone}`} className="text-sm text-[#8F2F2F] hover:text-[#7a2828] font-light">
                          {selectedEnquiry.phone}
                        </a>
                      </div>
                      {selectedEnquiry.email && (
                        <div>
                          <p className="text-xs text-[#77736D] font-light">Email</p>
                          <a href={`mailto:${selectedEnquiry.email}`} className="text-sm text-[#8F2F2F] hover:text-[#7a2828] font-light truncate">
                            {selectedEnquiry.email}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Message */}
                    {selectedEnquiry.message && (
                      <div>
                        <p className="text-xs text-[#77736D] font-light mb-1">Message</p>
                        <p className="text-sm text-[#77736D] p-2 bg-[#F7F6F2] rounded italic font-light">{selectedEnquiry.message}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2">
                      <a href={`https://wa.me/${selectedEnquiry.phone.replace(/\D/g, '')}?text=Hi%20${selectedEnquiry.name}%2C%20we%20received%20your%20enquiry`} target="_blank" rel="noopener noreferrer">
                        <Button variant="primary" size="sm" className="w-full gap-2 text-sm">
                          <MessageCircle className="w-4 h-4" />
                          WhatsApp
                        </Button>
                      </a>
                      <a href={`tel:${selectedEnquiry.phone}`}>
                        <Button variant="secondary" size="sm" className="w-full gap-2 text-sm">
                          <Phone className="w-4 h-4" />
                          Call
                        </Button>
                      </a>
                    </div>

                    {/* Notes Section */}
                    <div className="border-t border-[#E5E1DA] pt-3">
                      <p className="text-xs text-[#77736D] font-light mb-2">Notes</p>
                      {selectedEnquiry.notes ? (
                        <div className="text-xs text-[#77736D] p-2 bg-[#F7F6F2] rounded max-h-32 overflow-y-auto whitespace-pre-wrap font-light">
                          {selectedEnquiry.notes}
                        </div>
                      ) : (
                        <p className="text-xs text-[#D4CDBF] italic font-light">No notes yet</p>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
