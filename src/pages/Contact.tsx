import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, MessageSquare, CheckCircle, AlertTriangle, Loader2, ArrowRight } from "lucide-react";

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

  const whatsappUrl = "https://wa.me/919851350892?text=Hello%20Parbati%20Interior%20team%21%20I%20visited%20your%20website%20and%20would%20like%20to%20request%20a%20turnkey%20design%20consultation%20and%20free%20site%20visit.";

  const processSteps = [
    { number: "01", title: "Share Your Idea", description: "Tell us about your vision and requirements" },
    { number: "02", title: "Site Consultation", description: "We visit and analyze your space" },
    { number: "03", title: "Design & Quotation", description: "Premium designs and transparent pricing" },
    { number: "04", title: "Execution", description: "Seamless project implementation" }
  ];

  return (
    <div id="contact-page" className="bg-white pt-8 pb-0 sm:pt-12">
      
      {/* SVG Blueprint Pattern Background */}
      <svg className="fixed top-0 left-0 w-full h-screen opacity-[0.02] pointer-events-none z-0" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <defs>
          <pattern id="blueprint" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="120" height="120" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            <line x1="60" y1="0" x2="60" y2="120" stroke="currentColor" strokeWidth="0.3"/>
            <line x1="0" y1="60" x2="120" y2="60" stroke="currentColor" strokeWidth="0.3"/>
            <circle cx="60" cy="60" r="3" fill="currentColor" opacity="0.1"/>
          </pattern>
        </defs>
        <rect width="1440" height="900" fill="url(#blueprint)"/>
      </svg>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3 relative">
            <span className="text-xs font-extrabold tracking-widest text-brand-red uppercase bg-red-50 px-3.5 py-1.5 rounded-md inline-block">
              Get In Touch
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Let's Shape Your Space
            </h1>
            <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
              Have questions about space design costing or custom wardrobes? Contact us. Our designers provide turnkey supervision in Kathmandu, Lalitpur, and Bhaktapur.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-20 sm:mb-24">
            
            {/* LEFT COLUMN: Contact Card with Image */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                
                {/* Premium Office Image */}
                <div className="w-full h-40 overflow-hidden bg-gray-100 border-b border-gray-100">
                  <img 
                    src="/contact us/contact us.jpg" 
                    alt="Parbati Interior Office" 
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Contact Information */}
                <div className="p-8 sm:p-10 space-y-8">
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <span className="w-1 h-8 bg-brand-red rounded-full"></span>
                      Office Contact Info
                    </h3>
                  </div>

                  <div className="space-y-7">
                    
                    {/* Location */}
                    <div className="flex items-start gap-4">
                      <div className="bg-red-50 text-brand-red p-3.5 rounded-xl shrink-0 border border-red-100">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="block font-bold text-gray-900 text-xs uppercase tracking-wider">Office Address</span>
                        <span className="text-sm text-gray-600 leading-relaxed">Kathmandu, Nepal</span>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-4">
                      <div className="bg-red-50 text-brand-red p-3.5 rounded-xl shrink-0 border border-red-100">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="block font-bold text-gray-900 text-xs uppercase tracking-wider">Call Directly</span>
                        <a href="https://wa.me/919851350892" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-brand-red font-semibold transition-colors">
                          9851350892
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4">
                      <div className="bg-red-50 text-brand-red p-3.5 rounded-xl shrink-0 border border-red-100">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="block font-bold text-gray-900 text-xs uppercase tracking-wider">Email Inquiry</span>
                        <a href="mailto:Parbatiinterior07@gmail.com" className="text-sm text-gray-600 hover:text-brand-red transition-colors">
                          Parbatiinterior07@gmail.com
                        </a>
                      </div>
                    </div>

                    {/* Hours */}
                    <div className="flex items-start gap-4">
                      <div className="bg-red-50 text-brand-red p-3.5 rounded-xl shrink-0 border border-red-100">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="block font-bold text-gray-900 text-xs uppercase tracking-wider">Working Hours</span>
                        <span className="text-xs text-gray-600 leading-relaxed">
                          Sun - Fri: 9:00 AM - 6:00 PM <br />
                          <span className="text-gray-400 font-medium">Saturday Closed</span>
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* WhatsApp Button */}
                  <div className="pt-4 border-t border-gray-100">
                    <a
                      id="contact-whatsapp-card-btn"
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center space-x-3 bg-emerald-50 border border-emerald-200 text-emerald-700 py-4 px-4 rounded-lg hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-300 group"
                    >
                      <MessageSquare className="h-5 w-5 fill-emerald-600 stroke-none group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold uppercase tracking-wider">Fast Chat via WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Consultation Form */}
            <div className="lg:col-span-7 mt-12">
              <div className="bg-white rounded-2xl p-8 sm:p-12 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <span className="w-1 h-8 bg-brand-red rounded-full"></span>
                  Request Free Site Consultation
                </h3>

                {/* Status alerts */}
                {submitStatus === "success" && (
                  <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg flex items-start space-x-3 animate-fade-in">
                    <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-0.5">Message Logged!</span>
                      <span>{statusMessage}</span>
                    </div>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="mb-8 p-4 bg-red-50 border border-red-200 text-brand-red text-sm rounded-lg flex items-start space-x-3 animate-fade-in">
                    <AlertTriangle className="h-5 w-5 text-brand-red shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-0.5">Failed Submission</span>
                      <span>{statusMessage}</span>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form id="contact-form" onSubmit={handleSubmit} className="space-y-7">
                  
                  {/* Name */}
                  <div className="space-y-2">
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
                      className={`w-full px-4 py-3.5 rounded-lg border text-sm focus:outline-none transition-all duration-200 ${
                        errors.name
                          ? "border-red-300 focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                          : "border-gray-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red/20"
                      }`}
                    />
                    {errors.name && <p className="text-xs text-brand-red font-semibold">{errors.name}</p>}
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    {/* Email */}
                    <div className="space-y-2">
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
                        className={`w-full px-4 py-3.5 rounded-lg border text-sm focus:outline-none transition-all duration-200 ${
                          errors.email
                            ? "border-red-300 focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                            : "border-gray-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red/20"
                        }`}
                      />
                      {errors.email && <p className="text-xs text-brand-red font-semibold">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="E.g., 9851350892"
                        className={`w-full px-4 py-3.5 rounded-lg border text-sm focus:outline-none transition-all duration-200 ${
                          errors.phone
                            ? "border-red-300 focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                            : "border-gray-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red/20"
                        }`}
                      />
                      {errors.phone && <p className="text-xs text-brand-red font-semibold">{errors.phone}</p>}
                    </div>

                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Describe Your Design Project
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="E.g., I am looking for space planning, 3D modular kitchen concept designs and vertical WPC wall claddings for my 3-bedroom apartment in Kathmandu..."
                      className={`w-full px-4 py-3.5 rounded-lg border text-sm focus:outline-none transition-all duration-200 resize-none ${
                        errors.message
                          ? "border-red-300 focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                          : "border-gray-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red/20"
                      }`}
                    />
                    {errors.message && <p className="text-xs text-brand-red font-semibold">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-brand-red hover:bg-brand-red-dark text-white font-bold rounded-lg transition-all shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 disabled:opacity-55 disabled:cursor-not-allowed text-sm uppercase tracking-wider hover:-translate-y-0.5"
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

                </form>
              </div>
            </div>

          </div>

        </div>

        {/* What Happens Next Section */}
        <div className="bg-gray-50/80 py-16 sm:py-20 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-3">What Happens Next?</h2>
              <p className="text-gray-600 text-sm">A simple process from your first idea to the finished space</p>
            </div>

            {/* Process Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Connecting Line (Desktop Only) */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-200 -ml-12 translate-x-12"></div>
                  )}

                  {/* Step Card */}
                  <div className="relative bg-white rounded-xl p-6 border border-gray-100 hover:border-brand-red hover:shadow-lg transition-all duration-300 group h-full">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-brand-red text-white rounded-lg flex items-center justify-center font-bold font-display text-lg group-hover:scale-110 transition-transform">
                        {step.number}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Google Map Section */}
      <div className="w-screen relative left-1/2 -translate-x-1/2 bg-white border-t border-gray-100">
        <div className="relative overflow-hidden bg-white h-80 sm:h-96 group">
          <iframe
            title="Parbati Interior Pvt. Ltd. Location Map"
            src="https://maps.google.com/maps?q=Parbati%20Interior%20Pvt.%20Ltd.%2C%20Shantinagar-31%2C%20Kathmandu%2C%20Nepal&t=&z=16&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0 grayscale-[10%] contrast-[110%] transition-all duration-300 group-hover:grayscale-0"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Floating Info Card */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6 max-w-sm w-full md:w-80 bg-white/95 backdrop-blur-md rounded-xl p-5 border border-gray-200 shadow-2xl z-20 space-y-3 transition-all duration-300 group-hover:scale-[1.02]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-block text-[10px] font-extrabold tracking-widest text-brand-red bg-red-50 px-2 py-0.5 rounded border border-red-100">
                  HEAD OFFICE
                </span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  Active
                </span>
              </div>
              <h4 className="font-display text-base font-bold text-gray-900">Parbati Interior Pvt. Ltd.</h4>
              <p className="text-xs text-brand-red font-semibold uppercase tracking-wider">Serving Kathmandu Valley</p>
            </div>

            <div className="space-y-2 text-xs text-gray-600 py-3 border-t border-gray-100">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-brand-red mt-0.5 shrink-0" />
                <span className="font-medium text-gray-700">Shantinagar-31, Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-red shrink-0" />
                <a href="https://wa.me/919851350892" target="_blank" rel="noopener noreferrer" className="hover:text-brand-red font-bold text-gray-700 transition-colors">
                  9851350892
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-red shrink-0" />
                <a href="mailto:Parbatiinterior07@gmail.com" className="hover:text-brand-red text-gray-700 transition-colors">
                  Parbatiinterior07@gmail.com
                </a>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <a
                href="https://maps.google.com/maps?q=Parbati+Interior+Pvt.+Ltd.,+Shantinagar-31,+Kathmandu,+Nepal"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2 bg-brand-red hover:bg-brand-red-dark text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors"
              >
                Directions
              </a>
              <a
                href="https://www.google.com/maps/place/Parbati+Interior+Pvt.+Ltd./@27.69111,85.341416,16z"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors"
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
