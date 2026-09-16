import { useEffect, useState } from "react";
import { Link, useLocation, useOutletContext } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "../admin/services/supabaseClient";

interface Service {
  id: string;
  name: string;
  description: string;
  image?: string;
  is_active?: boolean;
  display_order?: number;
}

export default function Services() {
  const location = useLocation();
  const { setIsBookingModalOpen } = useOutletContext<{ setIsBookingModalOpen: (open: boolean) => void }>();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Static services (for features list display)
  const staticServices = [
    {
      id: "interior-design",
      title: "Interior Design & 3D Planning",
      features: ["Site measurement", "Space planning", "3D visualization", "Material coordination"],
    },
    {
      id: "modular-kitchens",
      title: "Modular Kitchens & Furniture",
      features: ["Modular kitchens", "Custom wardrobes", "TV units", "Custom furniture"],
    },
    {
      id: "home-interiors",
      title: "Home Interiors & Decor",
      features: ["Living rooms", "Bedrooms", "False ceilings", "Interior finishing"],
    },
    {
      id: "construction",
      title: "Construction & WPC Works",
      features: ["RCC and structural work", "WPC wall paneling", "Ceiling work", "General construction"],
    },
  ];

  useEffect(() => {
    document.title = "Our Services | Parbati Interior Pvt. Ltd.";
  }, []);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.log('⚠️ Supabase error:', error);
        setServices([]);
      } else if (data && data.length > 0) {
        console.log('✅ Loaded', data.length, 'services from Supabase');
        setServices(data);
      } else {
        console.log('ℹ️ No services found in Supabase');
        setServices([]);
      }
    } catch (error) {
      console.error('Error loading services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.hash) {
      const target = document.getElementById(`service-section-${location.hash.slice(1)}`);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location]);

  return (
    <div id="services-page" className="bg-white">
      {/* Hero Section with Background Image */}
      <section className="relative py-24 md:py-32 px-4 md:px-6 overflow-hidden">
        
        {/* Background Image */}
        <img 
          src="/service/HOME INTERIORS & DECOR.jpg"
          alt="Interior design"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/60 to-gray-900/50" />

        {/* Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          
          {/* Label */}
          <span className="text-sm font-bold tracking-widest text-yellow-600 uppercase mb-4 inline-block">
            What We Offer
          </span>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Services & Packages
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed mb-8">
            Parbati Interior
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-bold text-sm uppercase tracking-wide rounded-lg hover:bg-white hover:text-gray-900 transition-all"
            >
              Book a Call
            </Link>
          </div>

        </div>
      </section>

      {/* Services Cards Grid - DYNAMIC FROM ADMIN */}
      <section id="services" className="py-20 md:py-32 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="h-10 w-10 text-brand-red animate-spin mb-4" />
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading services...</p>
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-8">
              {services.map((service) => {
                // Find matching static service for features
                const staticService = staticServices.find(s => s.id === service.id);
                return (
                  <div
                    key={service.id}
                    id={`service-section-${service.id}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200"
                  >
                    {/* Image Container - FROM SUPABASE */}
                    <div className="relative overflow-hidden bg-gray-200 h-48 md:h-56">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                          <span className="text-sm">No image</span>
                        </div>
                      )}
                    </div>

                    {/* Content Container */}
                    <div className="p-4 md:p-6 space-y-3">
                      {/* Title - FROM SUPABASE */}
                      <h3 className="text-lg md:text-xl font-bold text-gray-950">
                        {service.name}
                      </h3>

                      {/* Description - FROM SUPABASE */}
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {service.description}
                      </p>

                      {/* Features List - FROM STATIC OR SUPABASE */}
                      {staticService && (
                        <ul className="space-y-1 pt-2">
                          {staticService.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-700">
                              <span className="text-red-600 font-bold mt-0 text-sm">›</span>
                              <span className="text-xs md:text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* CTA Buttons */}
                      <div className="pt-3 space-y-2 border-t border-gray-200">
                        <button
                          onClick={() => setIsBookingModalOpen(true)}
                          className="w-full text-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors text-xs md:text-sm"
                        >
                          Book Free Consultation
                        </button>
                        <Link
                          to={`/services/${service.id}`}
                          className="block text-center text-red-600 hover:text-red-700 font-semibold text-xs md:text-sm transition-colors"
                        >
                          Explore Service
                          <ArrowRight className="w-3 h-3 inline ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No services available. Please add services in the admin panel.</p>
            </div>
          )}
        </div>
      </section>

      {/* 4.5 OUR PROCESS - PREMIUM EDITORIAL DESIGN (MATCHING HOMEPAGE) */}
      <section id="our-process" className="py-24 lg:py-32 bg-gradient-to-br from-white via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 items-center">
            
            {/* LEFT SIDE: INTRODUCTION + PREMIUM ARCH IMAGE */}
            <div className="space-y-4 opacity-0 animate-fade-in-up" style={{animationDelay: '0.1s', animationFillMode: 'forwards'}}>
              
              {/* Eyebrow */}
              <div className="flex items-center gap-2">
                <div className="w-0.5 h-4 bg-brand-red rounded-full" />
                <span className="text-xs font-bold tracking-widest text-gray-600 uppercase">
                  Our Process
                </span>
              </div>

              {/* Main Heading */}
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight max-w-lg">
                From First Idea to Final Handover
              </h2>

              {/* Description */}
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed max-w-md">
                From consultation to handover, your vision becomes beautifully built reality.
              </p>

              {/* Premium Arch Image Composition */}
              <div className="relative w-full h-80 mt-8 opacity-0 animate-fade-in-up" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>
                
                {/* Arch background shape */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 320" preserveAspectRatio="none">
                  {/* Outer arch border - gold */}
                  <path d="M 40 320 Q 40 80 200 40 Q 360 80 360 320 Z" fill="none" stroke="rgba(217, 119, 6, 0.3)" strokeWidth="2.5" />
                  {/* Inner arch - white background */}
                  <path d="M 55 320 Q 55 100 200 65 Q 345 100 345 320 Z" fill="white" />
                </svg>

                {/* Main arch image */}
                <div className="absolute inset-0 overflow-hidden" style={{clipPath: 'polygon(14% 100%, 14% 32%, 50% 12%, 86% 32%, 86% 100%)'}}>
                  <img
                    src="/service/HOME INTERIORS & DECOR.jpg"
                    alt="Interior design"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Secondary rectangular image - bottom right */}
                <div className="absolute bottom-6 right-2 w-36 h-28 rounded-lg overflow-hidden shadow-lg z-20" style={{border: '6px solid white', boxShadow: '0 10px 30px rgba(0,0,0,0.15)'}}>
                  <img
                    src="/service/bed room decor.jpg"
                    alt="Design blueprint"
                    className="w-full h-full object-cover"
                  />
                </div>

              </div>

            </div>

            {/* RIGHT SIDE: ENHANCED PROCESS TIMELINE */}
            <div className="relative opacity-0 animate-fade-in-up" style={{animationDelay: '0.15s', animationFillMode: 'forwards'}}>
              
              {/* Vertical timeline line with gradient - thicker and cleaner */}
              <div className="absolute left-6 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-red via-brand-red to-brand-red/40 opacity-0 z-0" style={{animation: 'growDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards'}} />

              {/* Process Steps */}
              <div className="space-y-14 relative z-10 pl-28">

                {/* Step 01 */}
                <div className="relative opacity-0 animate-fade-in-up" style={{animationDelay: '0.35s', animationFillMode: 'forwards'}}>
                  <div className="absolute -left-24 top-0 w-14 h-14 rounded-full bg-brand-red flex items-center justify-center shadow-lg border-4 border-white text-white font-bold text-lg">01</div>
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-gray-900 text-xl">Consult</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">We start with a conversation to understand your needs, lifestyle, budget, and vision.</p>
                  </div>
                </div>

                {/* Step 02 */}
                <div className="relative opacity-0 animate-fade-in-up" style={{animationDelay: '0.4s', animationFillMode: 'forwards'}}>
                  <div className="absolute -left-24 top-0 w-14 h-14 rounded-full bg-brand-red flex items-center justify-center shadow-lg border-4 border-white text-white font-bold text-lg">02</div>
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-gray-900 text-xl">Design</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">We create detailed plans, 3D visualizations, and material selections tailored to your space.</p>
                  </div>
                </div>

                {/* Step 03 */}
                <div className="relative opacity-0 animate-fade-in-up" style={{animationDelay: '0.45s', animationFillMode: 'forwards'}}>
                  <div className="absolute -left-24 top-0 w-14 h-14 rounded-full bg-brand-red flex items-center justify-center shadow-lg border-4 border-white text-white font-bold text-lg">03</div>
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-gray-900 text-xl">Approve</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">You review the design, make any refinements, and give your final approval before proceeding.</p>
                  </div>
                </div>

                {/* Step 04 */}
                <div className="relative opacity-0 animate-fade-in-up" style={{animationDelay: '0.5s', animationFillMode: 'forwards'}}>
                  <div className="absolute -left-24 top-0 w-14 h-14 rounded-full bg-brand-red flex items-center justify-center shadow-lg border-4 border-white text-white font-bold text-lg">04</div>
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-gray-900 text-xl">Build</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">Our expert team brings the design to life with precision, quality, and clear communication.</p>
                  </div>
                </div>

                {/* Step 05 */}
                <div className="relative opacity-0 animate-fade-in-up" style={{animationDelay: '0.55s', animationFillMode: 'forwards'}}>
                  <div className="absolute -left-24 top-0 w-14 h-14 rounded-full bg-brand-red flex items-center justify-center shadow-lg border-4 border-white text-white font-bold text-lg">05</div>
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-gray-900 text-xl">Deliver</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">We complete the project, conduct a final walkthrough, and hand over your dream space.</p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Animation styles */}
        <style>{`
          @keyframes growDown {
            from {
              transform: scaleY(0);
              transform-origin: top;
              opacity: 0;
            }
            to {
              transform: scaleY(1);
              transform-origin: top;
              opacity: 1;
            }
          }
          .animate-grow-down {
            animation: growDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(15px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
        `}</style>

      </section>

      {/* Project Gallery Section */}
      <section className="py-20 md:py-32 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="text-xs font-bold tracking-widest text-red-600 uppercase">
              Gallery
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-950 mt-3 mb-4">
              From Concept to Completion
            </h2>
            <p className="text-lg text-gray-700">
              See how we transform spaces through thoughtful design and skilled execution.
            </p>
          </div>

          {/* Image Grid - 2x2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              {
                img: "/service/bed room decor.jpg",
                title: "Interior Design & 3D Planning",
              },
              {
                img: "/service/KITCHENS & FURNITURE.jpg",
                title: "Modular Kitchens & Furniture",
              },
              {
                img: "/service/HOME INTERIORS & DECOR.jpg",
                title: "Home Interiors & Decor",
              },
              {
                img: "/service/CONSTRUCTION & WPC WORKS.jpg",
                title: "Construction & WPC Works",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white font-bold text-lg">{item.title}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-red-600 text-red-600 font-bold rounded-lg hover:bg-red-50 transition-colors"
            >
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
