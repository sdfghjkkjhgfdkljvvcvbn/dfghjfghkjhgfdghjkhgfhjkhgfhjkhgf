import { useState } from "react";
import { X, Phone, Loader2 } from "lucide-react";
import { bookingsService } from "../utils/supabase";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    requirements: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.fullName.trim() || !formData.phone.trim()) {
        setSubmitError("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      // Save to Supabase
      const { data, error } = await bookingsService.create({
        name: formData.fullName,
        phone: formData.phone,
        requirement: formData.requirements || "General Enquiry",
        source: "website_modal",
        status: "new",
      });

      if (error) {
        throw new Error(error.message);
      }

      // Show success and redirect to WhatsApp
      setSubmitSuccess(true);
      setTimeout(() => {
        window.open("https://wa.me/977?text=Hi%20Parbati%20Interior", "_blank");
        onClose();
        setFormData({ fullName: "", phone: "", requirements: "" });
        setSubmitSuccess(false);
      }, 1500);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Solid Red Background Backdrop - with opacity 0.5 */}
      <div
        className="fixed inset-0 bg-brand-red/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Red Overlay - very subtle effect */}
      <div
        className="fixed inset-0 bg-black/5 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-fade-in-scale"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8 space-y-3">
              <p className="text-xs font-bold tracking-widest text-brand-red uppercase">
                Book your date
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900">
                Book a Consultation
              </h2>
              <p className="text-sm text-gray-600">
                We reply to every enquiry within 24 hours.
              </p>
            </div>

            {/* Success Message */}
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-800 font-semibold text-sm">✓ Booking submitted successfully!</p>
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-800 font-semibold text-sm">{submitError}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-red focus:outline-none transition-colors placeholder-gray-400 text-sm disabled:bg-gray-100"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="98XXXXXXXX"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-red focus:outline-none transition-colors placeholder-gray-400 text-sm disabled:bg-gray-100"
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Requirement
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="Tell us about your project..."
                  rows={3}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-red focus:outline-none transition-colors placeholder-gray-400 text-sm resize-none disabled:bg-gray-100"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-full transition-all shadow-md hover:shadow-lg text-sm uppercase tracking-wide flex items-center justify-center gap-2 group mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Send enquiry
                  </>
                )}
              </button>

              {/* Phone CTA */}
              <div className="text-center pt-2">
                <a
                  href="tel:+977-9851350892"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-brand-red transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  Or call +977 9851350892
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </>
  );
}
