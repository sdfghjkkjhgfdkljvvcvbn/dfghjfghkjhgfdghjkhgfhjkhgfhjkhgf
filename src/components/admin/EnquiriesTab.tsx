import React, { useState, useEffect } from "react";
import { Trash2, Eye, Loader2, CheckCircle, AlertCircle, Phone, Mail } from "lucide-react";
import { Booking } from "../../types";
import { bookingsService } from "../../utils/supabase";

export default function EnquiriesTab() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await bookingsService.fetchAll();
      if (error) {
        console.warn("Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env", error);
        setBookings([]);
      } else {
        setBookings(data || []);
      }
    } catch (err) {
      console.warn("Error loading bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(true);
    try {
      const { error } = await bookingsService.update(id, {
        status: newStatus,
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.warn("Could not update booking. Supabase not configured.", error);
        return;
      }

      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: newStatus as Booking["status"] } : b
        )
      );

      if (selectedBooking?.id === id) {
        setSelectedBooking({ ...selectedBooking, status: newStatus as Booking["status"] });
      }
    } catch (err) {
      console.warn("Error updating booking:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      const { error } = await bookingsService.delete(id);
      if (error) {
        console.warn("Could not delete booking. Supabase not configured.", error);
        return;
      }

      setBookings((prev) => prev.filter((b) => b.id !== id));
      if (selectedBooking?.id === id) setSelectedBooking(null);
    } catch (err) {
      console.warn("Error deleting booking:", err);
    }
  };

  const openWhatsApp = (phone: string) => {
    const message = `Hi, this is regarding your consultation request. We'd like to discuss your project with you.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const filteredBookings =
    statusFilter === "all"
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

  const statusColors = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-yellow-100 text-yellow-800",
    booked: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Bookings List */}
      <div className="lg:col-span-2 space-y-4">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {["all", "new", "contacted", "booked", "closed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                statusFilter === status
                  ? "bg-brand-red text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b-2 border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Name</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Phone</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Status</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">Date</th>
                <th className="text-center px-4 py-3 font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{booking.name}</td>
                  <td className="px-4 py-3 text-gray-600">{booking.phone}</td>
                  <td className="px-4 py-3">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      disabled={updating}
                      className={`px-3 py-1 rounded-full text-xs font-bold border-0 cursor-pointer ${
                        statusColors[booking.status as keyof typeof statusColors]
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="booked">Booked</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-2">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="p-2 hover:bg-blue-100 rounded transition-colors"
                      title="View details"
                    >
                      <Eye className="h-4 w-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => openWhatsApp(booking.phone)}
                      className="p-2 hover:bg-green-100 rounded transition-colors"
                      title="Open WhatsApp"
                    >
                      <Phone className="h-4 w-4 text-green-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteBooking(booking.id)}
                      className="p-2 hover:bg-red-100 rounded transition-colors"
                      title="Delete booking"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No bookings found for this status</p>
            </div>
          )}
        </div>
      </div>

      {/* Details Sidebar */}
      {selectedBooking && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 h-fit sticky top-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">{selectedBooking.name}</h3>

              {/* Status */}
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-600 uppercase mb-2">Status</p>
                <select
                  value={selectedBooking.status}
                  onChange={(e) => handleStatusChange(selectedBooking.id, e.target.value)}
                  disabled={updating}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-bold border-0 ${
                    statusColors[selectedBooking.status as keyof typeof statusColors]
                  }`}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="booked">Booked</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase mb-1">Phone</p>
                  <a href={`tel:${selectedBooking.phone}`} className="text-brand-red font-semibold hover:underline">
                    {selectedBooking.phone}
                  </a>
                </div>

                {selectedBooking.email && (
                  <div>
                    <p className="text-xs font-bold text-gray-600 uppercase mb-1">Email</p>
                    <a href={`mailto:${selectedBooking.email}`} className="text-brand-red font-semibold hover:underline">
                      {selectedBooking.email}
                    </a>
                  </div>
                )}
              </div>

              {/* Requirements */}
              {selectedBooking.requirement && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-2">Requirement</p>
                  <p className="text-sm text-gray-700">{selectedBooking.requirement}</p>
                </div>
              )}

              {/* Message */}
              {selectedBooking.message && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-2">Message</p>
                  <p className="text-sm text-gray-700">{selectedBooking.message}</p>
                </div>
              )}

              {/* Date */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs font-bold text-gray-600 uppercase mb-1">Submitted</p>
                <p className="text-sm text-gray-700">
                  {new Date(selectedBooking.created_at).toLocaleString()}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => openWhatsApp(selectedBooking.phone)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Send WhatsApp
                </button>
                <button
                  onClick={() => handleDeleteBooking(selectedBooking.id)}
                  className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete Booking
                </button>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="w-full bg-gray-300 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
