import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useOutletContext } from "react-router-dom";
import { ArrowRight, Check, ArrowLeft } from "lucide-react";

interface ServiceData {
  id: string;
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  tagline: string;
  aboutTitle: string;
  aboutDescription: string;
  features: string[];
  galleryImages: string[];
  galleryTitle: string;
  bookCTA: string;
}

// Service data - can be moved to database later
const servicesData: Record<string, ServiceData> = {
  "interior-design": {
    id: "1",
    slug: "interior-design",
    name: "Interior Design & 3D Planning",
    description: "Thoughtful layouts, practical planning and realistic 3D visualization before execution.",
    heroImage: "/service/bed room decor.jpg",
    tagline: "Visualize Your Vision Before We Build It",
    aboutTitle: "Interior Design & 3D Planning",
    aboutDescription:
      "Our interior design sessions are vision-driven experiences. We scout your space, understand your lifestyle, and create 3D visualizations that feel like a film still. Every detail is planned with precision before execution begins.",
    features: [
      "Site measurement & space planning",
      "3D visualization & design concepts",
      "Material selection & coordination",
      "Detailed execution drawings",
      "On-site installation support",
      "Premium finishing touches",
    ],
    galleryImages: [
      "/service/bed room decor.jpg",
      "/service/HOME INTERIORS & DECOR.jpg",
      "/service/KITCHENS & FURNITURE.jpg",
      "/service/CONSTRUCTION & WPC WORKS.jpg",
    ],
    galleryTitle: "Our Interior Design Work",
    bookCTA: "Book Design Consultation",
  },
  "modular-kitchens": {
    id: "2",
    slug: "modular-kitchens",
    name: "Modular Kitchens & Furniture",
    description: "Custom kitchens, wardrobes and furniture designed around your space and lifestyle.",
    heroImage: "/service/KITCHENS & FURNITURE.jpg",
    tagline: "Kitchens That Work as Hard as You Do",
    aboutTitle: "Modular Kitchens & Furniture",
    aboutDescription:
      "Our modular kitchen solutions combine functionality with elegance. We design custom kitchens, wardrobes, and furniture pieces that maximize your space and match your lifestyle perfectly. Every component is crafted with precision.",
    features: [
      "Custom modular kitchen design",
      "Premium quality cabinets & hardware",
      "Custom wardrobes & storage solutions",
      "TV units & entertainment furniture",
      "Professional installation",
      "Warranty & after-sales support",
    ],
    galleryImages: [
      "/service/KITCHENS & FURNITURE.jpg",
      "/service/HOME INTERIORS & DECOR.jpg",
      "/service/bed room decor.jpg",
      "/service/CONSTRUCTION & WPC WORKS.jpg",
    ],
    galleryTitle: "Our Kitchen & Furniture Work",
    bookCTA: "Book Kitchen Consultation",
  },
  "home-interiors": {
    id: "3",
    slug: "home-interiors",
    name: "Home Interiors & Decor",
    description: "Complete interior solutions that bring comfort, functionality and personality into your home.",
    heroImage: "/service/HOME INTERIORS & DECOR.jpg",
    tagline: "Your Home, Perfected",
    aboutTitle: "Home Interiors & Decor",
    aboutDescription:
      "Complete interior solutions for every room in your home. From living rooms to bedrooms, we create spaces that blend comfort, functionality, and your personal style. Our team handles everything from concept to completion.",
    features: [
      "Living room design & decoration",
      "Bedroom interior solutions",
      "False ceiling & lighting design",
      "Color schemes & material selection",
      "Complete interior finishing",
      "Post-installation styling",
    ],
    galleryImages: [
      "/service/HOME INTERIORS & DECOR.jpg",
      "/service/bed room decor.jpg",
      "/service/KITCHENS & FURNITURE.jpg",
      "/service/CONSTRUCTION & WPC WORKS.jpg",
    ],
    galleryTitle: "Our Home Interior Work",
    bookCTA: "Book Interior Consultation",
  },
  "construction": {
    id: "4",
    slug: "construction",
    name: "Construction & WPC Works",
    description: "Reliable construction and finishing work delivered with practical site execution.",
    heroImage: "/service/CONSTRUCTION & WPC WORKS.jpg",
    tagline: "Solid Construction, Premium Finishing",
    aboutTitle: "Construction & WPC Works",
    aboutDescription:
      "We handle all aspects of construction and finishing work. From structural work to WPC (Wood Plastic Composite) wall paneling, our experienced team ensures quality execution and timely delivery. Every project is built to last.",
    features: [
      "RCC & structural work",
      "WPC wall paneling & cladding",
      "Ceiling systems & installation",
      "General construction services",
      "Quality control & inspections",
      "Project management & timelines",
    ],
    galleryImages: [
      "/service/CONSTRUCTION & WPC WORKS.jpg",
      "/service/HOME INTERIORS & DECOR.jpg",
      "/service/KITCHENS & FURNITURE.jpg",
      "/service/bed room decor.jpg",
    ],
    galleryTitle: "Our Construction Work",
    bookCTA: "Book Construction Consultation",
  },
};

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { setIsBookingModalOpen } = useOutletContext<{ setIsBookingModalOpen: (open: boolean) => void }>();

  const [service, setService] = useState<ServiceData | null>(null);

  useEffect(() => {
    if (slug && servicesData[slug]) {
      setService(servicesData[slug]);
      document.title = `${servicesData[slug].name} | Parbati Interior`;
    } else {
      navigate("/services");
    }
  }, [slug, navigate]);

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Service not found</p>
          <Link to="/services" className="text-brand-red font-bold hover:underline">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => navigate("/services")}
          className="flex items-center gap-2 text-brand-red font-bold hover:text-red-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Services
        </button>
      </div>

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative py-24 md:py-32 px-4 md:px-6 overflow-hidden">
        {/* Background Image */}
        <img
          src={service.heroImage}
          alt={service.name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/60 to-gray-900/50" />

        {/* Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Label */}
          <span className="text-sm font-bold tracking-widest text-yellow-600 uppercase mb-4 inline-block">
            {service.name.split(" ")[0]} Service
          </span>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {service.name}
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed mb-8">
            {service.tagline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="inline-flex items-center px-8 py-3 bg-brand-red hover:bg-red-700 text-white font-bold text-sm uppercase tracking-wide rounded-lg transition-all hover:shadow-lg hover:translate-y-[-2px]"
            >
              Book This Service
            </button>
            <Link
              to="/services"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-bold text-sm uppercase tracking-wide rounded-lg hover:bg-white hover:text-gray-900 transition-all"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          ABOUT SERVICE SECTION
          ============================================ */}
      <section className="py-20 md:py-32 px-4 md:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: About Text */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold tracking-widest text-brand-red uppercase">
                  About This Service
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">{service.aboutTitle}</h2>
              </div>

              <p className="text-gray-700 text-base leading-relaxed">{service.aboutDescription}</p>

              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all hover:shadow-lg"
              >
                Book Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Right: What's Included */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h3>
              <ul className="space-y-4">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-brand-red shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm md:text-base">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          GALLERY SECTION
          ============================================ */}
      <section className="py-20 md:py-32 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-brand-red uppercase">Our Work</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">{service.galleryTitle}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See examples of how we've transformed spaces similar to yours
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.galleryImages.map((image, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={image}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
            ))}
          </div>

          {/* Gallery CTA */}
          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-brand-red text-brand-red font-bold rounded-lg hover:bg-red-50 transition-colors"
            >
              View All Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          BOTTOM CTA SECTION
          ============================================ */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-gradient-to-r from-brand-red to-red-700">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Get Started?</h2>
          <p className="text-lg text-white/90">
            Let's discuss how we can transform your space with our {service.name.toLowerCase()} services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-8 py-3 bg-white hover:bg-gray-100 text-brand-red font-bold rounded-lg transition-all shadow-lg"
            >
              {service.bookCTA}
            </button>
            <a
              href="https://wa.me/919851350892"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all"
            >
              WhatsApp: 9851350892
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
