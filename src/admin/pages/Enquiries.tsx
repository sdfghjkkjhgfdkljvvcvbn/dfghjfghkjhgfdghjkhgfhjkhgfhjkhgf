import React, { useState, useEffect } from 'react';
import { Search, MessageCircle, Phone, Mail, Calendar, X, ChevronDown } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardBody } from '../components/Card';
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
  const [addingNote, setAddingNote] = useState('');
  const { addNotification } = useUIStore();

  useEffect(() => {
    loadEnquiries();
    
    const subscription = supabase
      .channel('bookings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        loadEnquiries();
      })
      .subscribe();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let filtered = enquiries;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(e => e.status === filterStatus);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(term) ||
        e.phone.includes(term) ||
        (e.email && e.email.toLowerCase().includes(term)) ||
        (e.requirement && e.requirement.toLowerCase().includes(term))
      );
    }

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
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnquiries(data || []);
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
      const updated = enquiries.find(e => e.id === id);
      if (updated) setSelectedEnquiry({ ...updated, status: newStatus as any });
    } catch (error: any) {
      console.error('Error updating status:', error);
      addNotification({
        type: 'error',
        message: 'Failed to update status',
      });
    }
  };

  const handleAddNote = async (id: string) => {
    if (!addingNote.trim()) return;

    try {
      const enquiry = enquiries.find(e => e.id === id);
      const existingNotes = enquiry?.notes || '';
      const newNotes = existingNotes
        ? `${existingNotes}\n---\n[${new Date().toLocaleString()}] ${addingNote}`
        : `[${new Date().toLocaleString()}] ${addingNote}`;

      const { error } = await supabase
        .from('bookings')
        .update({ notes: newNotes })
        .eq('id', id);

      if (error) throw error;

      addNotification({
        type: 'success',
        message: 'Note added',
      });
      setAddingNote('');
      await loadEnquiries();
      const updated = enquiries.find(e => e.id === id);
      if (updated) setSelectedEnquiry({ ...updated, notes: newNotes });
    } catch (error: any) {
      console.error('Error adding note:', error);
      addNotification({
        type: 'error',
        message: 'Failed to add note',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-600 text-white';
      case 'contacted': return 'bg-blue-600 text-white';
      case 'booked': return 'bg-green-600 text-white';
      case 'closed': return 'bg-gray-400 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'New';
      case 'contacted': return 'Contacted';
      case 'booked': return 'Booked';
      case 'closed': return 'Closed';
      default: return status;
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
      <div className="flex gap-6 h-full">
        {/* Left: Table View */}
        <div className="flex-1 overflow-hidden flex flex-col">
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
                <p className="text-[#77736D] font-light">No enquiries yet</p>
              </CardBody>
            </Card>
          ) : (
            <Card className="h-full overflow-hidden flex flex-col">
              {/* Filters */}
              <div className="px-6 py-4 border-b border-[#E5E1DA] space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#77736D]" />
                  <input
                    type="text"
                    placeholder="Search by name, phone, service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#E5E1DA] rounded-lg focus:outline-none focus:border-[#8F2F2F]"
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
                      className={`px-3 py-1 rounded-full text-xs font-light transition-all ${
                        filterStatus === filter.value
                          ? 'bg-[#8F2F2F] text-white'
                          : 'bg-[#F7F6F2] text-[#77736D] hover:bg-[#EFEFEA]'
                      }`}
                    >
                      {filter.label} ({filter.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="flex-1 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-[#F7F6F2] sticky top-0">
                    <tr className="border-b border-[#E5E1DA]">
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#77736D] uppercase tracking-wider">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#77736D] uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#77736D] uppercase tracking-wider">Service/Package</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#77736D] uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#77736D] uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#77736D] uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEnquiries.map((enquiry, index) => (
                      <tr
                        key={enquiry.id}
                        onClick={() => setSelectedEnquiry(enquiry)}
                        className={`border-b border-[#E5E1DA] cursor-pointer transition-colors ${
                          selectedEnquiry?.id === enquiry.id ? 'bg-[#F7F6F2]' : 'hover:bg-white/50'
                        }`}
                      >
                        <td className="px-6 py-3 text-sm text-[#77736D] font-light">#{String(index + 1).padStart(5, '0')}</td>
                        <td className="px-6 py-3 text-sm text-[#202124] font-light">{enquiry.name}</td>
                        <td className="px-6 py-3 text-sm text-[#77736D] font-light">{enquiry.requirement}</td>
                        <td className="px-6 py-3 text-sm text-[#77736D] font-light">{formatDate(enquiry.created_at).split(',')[0]}</td>
                        <td className="px-6 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-light ${getStatusColor(enquiry.status)}`}>
                            {getStatusLabel(enquiry.status)}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <button className="text-[#8F2F2F] hover:text-[#7a2828] font-light">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

        {/* Right: Details Panel */}
        {selectedEnquiry && (
          <div className="w-80">
            <Card className="h-full flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 border-b border-[#E5E1DA] flex items-center justify-between">
                <h3 className="text-base font-light text-[#202124]">Enquiry Details</h3>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="p-1 hover:bg-[#F7F6F2] rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-[#77736D]" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                {/* Name */}
                <div>
                  <p className="text-sm text-[#77736D] font-light mb-2">Name</p>
                  <p className="text-base text-[#202124] font-medium">{selectedEnquiry.name}</p>
                </div>

                {/* Phone */}
                <div>
                  <p className="text-sm text-[#77736D] font-light mb-2">Phone</p>
                  <div className="flex items-center justify-between">
                    <a href={`tel:${selectedEnquiry.phone}`} className="text-base text-[#202124] font-medium hover:text-[#8F2F2F]">
                      {selectedEnquiry.phone}
                    </a>
                    <button className="p-1 hover:bg-[#F7F6F2] rounded transition-colors">
                      <Mail className="w-4 h-4 text-[#77736D]" />
                    </button>
                  </div>
                </div>

                {/* Email */}
                {selectedEnquiry.email && (
                  <div>
                    <p className="text-sm text-[#77736D] font-light mb-2">Email</p>
                    <a href={`mailto:${selectedEnquiry.email}`} className="text-base text-[#202124] font-medium hover:text-[#8F2F2F]">
                      {selectedEnquiry.email}
                    </a>
                  </div>
                )}

                {/* Service */}
                <div>
                  <p className="text-sm text-[#77736D] font-light mb-2">Service</p>
                  <p className="text-base text-[#202124] font-medium">{selectedEnquiry.requirement}</p>
                </div>

                {/* Message */}
                {selectedEnquiry.message && (
                  <div>
                    <p className="text-sm text-[#77736D] font-light mb-2">Message</p>
                    <p className="text-base text-[#77736D] font-light bg-[#F7F6F2] p-3 rounded">{selectedEnquiry.message}</p>
                  </div>
                )}

                {/* Submitted Date */}
                <div>
                  <p className="text-sm text-[#77736D] font-light mb-2">Submitted</p>
                  <p className="text-base text-[#202124] font-medium">{formatDate(selectedEnquiry.created_at)}</p>
                </div>

                {/* Status */}
                <div>
                  <p className="text-sm text-[#77736D] font-light mb-2">Status</p>
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value)}
                    className="w-full px-4 py-3 border border-[#E5E1DA] rounded-lg text-base font-medium focus:outline-none focus:border-[#8F2F2F] bg-white"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="booked">Booked</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 border-t border-[#E5E1DA] space-y-3">
                <a href={`https://wa.me/${selectedEnquiry.phone.replace(/\D/g, '')}?text=Hi%20${selectedEnquiry.name}%2C%20we%20received%20your%20enquiry`} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" size="md" className="w-full gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Open in WhatsApp
                  </Button>
                </a>
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full"
                  onClick={() => handleStatusChange(selectedEnquiry.id, 'contacted')}
                >
                  Mark as Contacted
                </Button>
                <button
                  onClick={() => handleStatusChange(selectedEnquiry.id, 'booked')}
                  className="w-full py-2.5 bg-green-50 hover:bg-green-100 text-green-700 font-medium rounded-lg transition-colors"
                >
                  Mark as Booked
                </button>
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full"
                  onClick={() => handleStatusChange(selectedEnquiry.id, 'closed')}
                >
                  Mark as Not Interested
                </Button>
              </div>

              {/* Notes Section */}
              <div className="px-6 py-4 border-t border-[#E5E1DA] space-y-2">
                <p className="text-xs text-[#77736D] font-light uppercase tracking-wide">Notes</p>
                <div className="text-xs text-[#77736D] font-light bg-[#F7F6F2] p-2 rounded max-h-20 overflow-y-auto">
                  {selectedEnquiry.notes ? selectedEnquiry.notes : 'No notes yet'}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a note..."
                    value={addingNote}
                    onChange={(e) => setAddingNote(e.target.value)}
                    className="flex-1 px-2 py-1 border border-[#E5E1DA] rounded text-xs focus:outline-none focus:border-[#8F2F2F]"
                  />
                  <button
                    onClick={() => handleAddNote(selectedEnquiry.id)}
                    className="px-3 py-1 bg-[#8F2F2F] text-white text-xs rounded hover:bg-[#7a2828] transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
