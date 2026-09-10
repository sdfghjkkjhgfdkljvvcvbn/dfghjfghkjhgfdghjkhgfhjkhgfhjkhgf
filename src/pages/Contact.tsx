import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, MessageSquare, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function Contact() {
  useEffect(() => {
    document.title = "Contact Us | Parbati Interior Pvt. Ltd.";
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear specific error as user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.trim().length < 7) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message details are required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Please describe your project in at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setSubmitStatus("idle");
    setStatusMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus("success");
        setStatusMessage(data.message || "Thank you! Your message was sent successfully.");
        // Reset form data on successful submission
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: ""
        });
      } else {
        setSubmitStatus("error");
        setStatusMessage(data.error || "Failed to deliver message. Please check parameters and try again.");
      }
    } catch (err) {
      setSubmitStatus("error");
      setStatusMessage("Network error. Please verify your internet connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Pre-filled WhatsApp setup
  const whatsappUrl = "https://wa.me/919851350892?text=Hello%20Parbati%20Interior%20team%21%20I%20visited%20your%20website%20and%20would%20like%20to%20request%20a%20turnkey%20design%20consultation%20and%20free%20site%20visit.";

  return (
    <div id="contact-page" className="bg-gray-50/50 pt-16 pb-12 sm:pt-24 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Titles */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-extrabold tracking-widest text-brand-red uppercase bg-red-50 px-3.5 py-1.5 rounded-md inline-block">
            Get In Touch
          </span>
          <h1 className="font-display text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Let's Shape Your Space
          </h1>
          <p className="text-gray-500 text-sm">
            Have questions about space design costing or custom wardrobes? Contact us. Our designers provide turnkey supervision in Kathmandu, Lalitpur, and Bhaktapur.
          </p>
        </div>

        {/* Double-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">
          
          {/* LEFT COLUMN: CONTACT CARDS & DETAILS */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs space-y-8">
              <h3 className="font-display text-xl font-bold text-gray-900 border-b border-gray-50 pb-4">
                Office Contact Info
              </h3>

              <div className="space-y-6">
                
                {/* Location */}
                <div className="flex items-start">
                  <div className="bg-red-50 text-brand-red p-3 rounded-xl shrink-0 border border-red-100/50">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="ml-4 space-y-1">
                    <span className="block font-bold text-gray-900 text-sm uppercase tracking-wider">Office Address</span>
                    <span className="text-sm text-gray-600 leading-relaxed">
                      Kathmandu, Nepal
                    </span>
                  </div>
                </div>

                {/* Telephone */}
                <div className="flex items-start">
                  <div className="bg-red-50 text-brand-red p-3 rounded-xl shrink-0 border border-red-100/50">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="ml-4 space-y-1">
                    <span className="block font-bold text-gray-900 text-sm uppercase tracking-wider">Call Directly</span>
                    <a href="https://wa.me/919851350892" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-brand-red font-semibold transition-colors">
                      9851350892
                    </a>
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex items-start">
                  <div className="bg-red-50 text-brand-red p-3 rounded-xl shrink-0 border border-red-100/50">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="ml-4 space-y-1">
                    <span className="block font-bold text-gray-900 text-sm uppercase tracking-wider">Email Inquiry</span>
                    <a href="mailto:Parbatiinterior07@gmail.com" className="text-sm text-gray-600 hover:text-brand-red transition-colors">
                      Parbatiinterior07@gmail.com
                    </a>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start">
                  <div className="bg-red-50 text-brand-red p-3 rounded-xl shrink-0 border border-red-100/50">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="ml-4 space-y-1">
                    <span className="block font-bold text-gray-900 text-sm uppercase tracking-wider">Working Hours</span>
                    <span className="text-xs text-gray-500 leading-relaxed">
                      Sun - Fri: 9:00 AM - 6:00 PM <br />
                      <span className="text-gray-400 font-medium">Saturday Closed</span>
                    </span>
                  </div>
                </div>

              </div>

              {/* Direct WhatsApp Quick-link Block */}
              <div className="pt-6 border-t border-gray-100 mt-6">
                <a
                  id="contact-whatsapp-card-btn"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-3 bg-emerald-50 border border-emerald-100 text-emerald-700 py-3.5 px-4 rounded-xl hover:bg-emerald-100/80 hover:text-emerald-800 transition-colors duration-300 group"
                >
                  <MessageSquare className="h-5 w-5 fill-emerald-600 stroke-none group-hover:scale-105 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-wider">Fast Chat via WhatsApp</span>
                </a>
              </div>
            </div>



          </div>

          {/* RIGHT COLUMN: CONTACT FORM */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-md">
              <h3 className="font-display text-xl font-bold text-gray-900 mb-6">
                Request Free Site Consultation
              </h3>

              {/* Status alerts */}
              {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm rounded-xl flex items-start space-x-3 animate-fade-in">
                  <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Message Logged!</span>
                    <span>{statusMessage}</span>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-brand-red text-sm rounded-xl flex items-start space-x-3 animate-fade-in">
                  <AlertTriangle className="h-5 w-5 text-brand-red shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Failed Submission</span>
                    <span>{statusMessage}</span>
                  </div>
                </div>
              )}

              {/* Form elements */}
              <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="E.g., Arbindra Kharel"
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-hidden transition-all duration-200 ${
                      errors.name
                        ? "border-red-300 focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                        : "border-gray-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                    }`}
                  />
                  {errors.name && <p className="text-xs text-brand-red font-semibold">{errors.name}</p>}
                </div>

                {/* Grid layout for Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@domain.com"
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-hidden transition-all duration-200 ${
                        errors.email
                          ? "border-red-300 focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                          : "border-gray-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                      }`}
                    />
                    {errors.email && <p className="text-xs text-brand-red font-semibold">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Phone Number (984...)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="E.g., 9851350892"
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-hidden transition-all duration-200 ${
                        errors.phone
                          ? "border-red-300 focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                          : "border-gray-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                      }`}
                    />
                    {errors.phone && <p className="text-xs text-brand-red font-semibold">{errors.phone}</p>}
                  </div>

                </div>

                {/* Message detail */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Describe Your Design Project
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="E.g., I am looking for space planning, 3D modular kitchen concept designs and vertical WPC wall claddings for my 3-bedroom apartment in Kathmandu..."
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-hidden transition-all duration-200 resize-none ${
                      errors.message
                        ? "border-red-300 focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                        : "border-gray-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                    }`}
                  />
                  {errors.message && <p className="text-xs text-brand-red font-semibold">{errors.message}</p>}
                </div>

                {/* Submit trigger button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center px-6 py-4 bg-brand-red hover:bg-brand-red-dark text-white font-bold rounded-xl transition-all shadow-md shadow-red-500/10 disabled:opacity-55 disabled:cursor-not-allowed text-sm uppercase tracking-wider"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Validating &amp; Sending...
                      </>
                    ) : (
                      "Send Consultation Request"
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>

      </div>

      {/* Large Interactive Google Map Section — full viewport width */}
      <div className="mt-12 sm:mt-16 animate-fade-in-up w-screen relative left-1/2 -translate-x-1/2">
        <div className="relative overflow-hidden border-y border-gray-100 shadow-xl bg-white h-[350px] md:h-[450px] group">
            {/* Live Google Map iframe */}
            <iframe
              title="Parbati Interior Pvt. Ltd. Location Map"
              src="https://maps.google.com/maps?q=Parbati%20Interior%20Pvt.%20Ltd.%2C%20Shantinagar-31%2C%20Kathmandu%2C%20Nepal&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 grayscale-[10%] contrast-[110%] transition-all duration-300 group-hover:grayscale-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Floating Glassmorphism Info Card */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 max-w-sm w-full md:w-80 bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-white/40 shadow-2xl z-20 space-y-4 transition-all duration-300 group-hover:scale-[1.01]">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="inline-block text-[10px] font-extrabold tracking-widest text-brand-red bg-red-50/90 px-2 py-0.5 rounded border border-red-100/50">
                    HEAD OFFICE
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/50">
                    Active
                  </span>
                </div>
                <h4 className="font-display text-base font-bold text-gray-900 leading-tight">
                  Parbati Interior Pvt. Ltd.
                </h4>
                <p className="text-xs text-brand-red font-semibold uppercase tracking-wider">
                  Serving Kathmandu Valley
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-gray-600">
                {/* Address */}
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-brand-red mr-2 shrink-0 mt-0.5" />
                  <span className="font-medium text-gray-700">Shantinagar-31, Kathmandu, Nepal</span>
                </div>

                {/* Phone */}
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-brand-red mr-2 shrink-0" />
                  <a href="https://wa.me/919851350892" target="_blank" rel="noopener noreferrer" className="hover:text-brand-red font-bold text-gray-700 transition-colors">
                    9851350892
                  </a>
                </div>

                {/* Email */}
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-brand-red mr-2 shrink-0" />
                  <a href="mailto:Parbatiinterior07@gmail.com" className="hover:text-brand-red text-gray-700 transition-colors">
                    Parbatiinterior07@gmail.com
                  </a>
                </div>

                {/* Hours */}
                <div className="flex items-start">
                  <Clock className="h-4 w-4 text-brand-red mr-2 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-medium text-gray-700">Sun - Fri: 9:00 AM - 6:00 PM</span>
                    <span className="text-[10px] text-gray-400">Saturday Closed</span>
                  </div>
                </div>
              </div>

              {/* Actions for Zoom and Directions */}
              <div className="pt-3 border-t border-gray-100 flex gap-2">
                <a
                  href="https://maps.google.com/maps?q=Parbati+Interior+Pvt.+Ltd.,+Shantinagar-31,+Kathmandu,+Nepal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2 bg-brand-red hover:bg-brand-red-dark text-white rounded-lg text-[10px] font-extrabold uppercase tracking-widest transition-colors shadow-sm"
                >
                  Directions
                </a>
                <a
                  href="https://www.google.com/maps/place/Parbati+Interior+Pvt.+Ltd./@27.69111,85.341416,16z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-extrabold uppercase tracking-widest transition-colors"
                >
                  Full Map
                </a>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
