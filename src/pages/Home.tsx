import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { ArrowRight, Star, Quote, ChevronDown } from "lucide-react";
import HeroSlider from "../components/HeroSlider";
import HappyClientsSection from "../components/HappyClientsSection";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  projectType: string;
  image: string; // Project/carousel image
  avatar: string; // Avatar/reviewer image
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export default function Home() {
  const { setIsBookingModalOpen } = useOutletContext<{ setIsBookingModalOpen: (open: boolean) => void }>();
  
  // Update browser document title
  useEffect(() => {
    document.title = "Parbati Interior | Premium Interior Design & Construction Nepal";
  }, []);

  // Testimonials database with reviewer images and project photos
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Ramesh Shrestha",
      role: "Apartment Owner, Kathmandu",
      content: "We wanted a practical makeover for our home without overcomplicating the process. The team visited the site, understood the layout, and delivered a finish that feels neat, usable, and well made.",
      rating: 5,
      projectType: "Residential Renovation",
      image: "/service/HOME INTERIORS & DECOR.jpg",
      avatar: "/reviewers/garima.jpg"
    },
    {
      id: 2,
      name: "Prerna Kharel",
      role: "Homeowner, Lalitpur",
      content: "The kitchen came out the way we had imagined. The storage is better, the cabinets feel solid, and the installation was organised and completed without unnecessary delays.",
      rating: 5,
      projectType: "Modular Kitchen",
      image: "/service/KITCHENS & FURNITURE.jpg",
      avatar: "/reviewers/ranjana.jpeg"
    },
    {
      id: 3,
      name: "Aashish Joshi",
      role: "Office Manager, Baneshwor",
      content: "We needed a simple office fit-out with partitions and workstations that would be functional from day one. The team handled the work professionally and kept the process straightforward.",
      rating: 5,
      projectType: "Office Fit-Out",
      image: "/service/bed room decor.jpg",
      avatar: "/reviewers/siddharth.png"
    },
    {
      id: 4,
      name: "Sunita Thapa",
      role: "Family Home Owner, Bhaktapur",
      content: "We asked for custom furniture that would fit our home instead of using standard off-the-shelf pieces. The result was durable, well finished, and more useful than expected.",
      rating: 5,
      projectType: "Custom Furniture",
      image: "/service/CONSTRUCTION & WPC WORKS.jpg",
      avatar: "/reviewers/harshit.jpg"
    }
  ];

  // FAQ Database
  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "What services does Parbati Interior Pvt. Ltd. specialize in?",
      answer: "We specialize in Space Planning, 3D Interior Design, custom metal and premium solid wood furniture fabrication, and general construction (including WPC wall paneling, ceiling works, and full turnkey structural construction projects)."
    },
    {
      id: 2,
      question: "How long does a typical interior design project take to complete?",
      answer: "A standard modular kitchen or living room redecoration takes between 2 to 4 weeks. Larger full-scale residential villas or commercial office projects can take between 6 to 12 weeks, depending on materials, scale, and specific custom fabrications."
    },
    {
      id: 3,
      question: "Do you offer site visits and measurements in Kathmandu?",
      answer: "Yes, absolutely! We provide professional site visits, exact physical measurements, and layout consultation services within the Kathmandu Valley. You can schedule a visit by contacting us directly via our WhatsApp link or contact form."
    },
    {
      id: 4,
      question: "What is WPC work and what are its advantages?",
      answer: "WPC (Wood Plastic Composite) is a modern, eco-friendly material. It is 100% waterproof, termite-proof, flame-retardant, and resistant to warping. We highly recommend WPC for high-end wall claddings, exterior facades, ceiling grids, and damp-prone areas."
    },
    {
      id: 5,
      question: "Can we request custom-sized furniture designs?",
      answer: "Yes! Unlike standard showroom retailers, we have an active, fully equipped in-house woodworking and metal-welding workshop. We can manufacture any furniture designs, dimensions, or material pairings (wood, steel, glass, stone) to match your custom design files perfectly."
    }
  ];

  // Core craft showcase cards - Using actual service images and content
  const coreCraftItems = [
    {
      id: "interior-design",
      title: "Interior Design & 3D Planning",
      description: "Thoughtful layouts, practical planning and realistic 3D visualization before execution.",
      img: "/service/bed room decor.jpg",
      features: [
        "Site measurement",
        "Space planning",
        "3D visualization",
        "Material coordination",
      ],
    },
    {
      id: "modular-kitchens",
      title: "Modular Kitchens & Furniture",
      description: "Custom kitchens, wardrobes and furniture designed around your space and lifestyle.",
      img: "/service/KITCHENS & FURNITURE.jpg",
      features: [
        "Modular kitchens",
        "Custom wardrobes",
        "TV units",
        "Custom furniture",
      ],
    },
    {
      id: "home-interiors",
      title: "Home Interiors & Decor",
      description: "Complete interior solutions that bring comfort, functionality and personality into your home.",
      img: "/service/HOME INTERIORS & DECOR.jpg",
      features: [
        "Living rooms",
        "Bedrooms",
        "False ceilings",
        "Interior finishing",
      ],
    },
    {
      id: "construction",
      title: "Construction & WPC Works",
      description: "Reliable construction and finishing work delivered with practical site execution.",
      img: "/service/CONSTRUCTION & WPC WORKS.jpg",
      features: [
        "RCC and structural work",
        "WPC wall paneling",
        "Ceiling work",
        "General construction",
      ],
    },
  ];

  // Testimonials carousel state
  const [activeReview, setActiveReview] = useState(0);
  const [isReviewSliderPaused, setIsReviewSliderPaused] = useState(false);
  const nextReview = () => {
    setActiveReview((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  // Testimonial auto-rotate effect
  useEffect(() => {
    const timer = setInterval(() => {
      nextReview();
    }, 7000);
    return () => clearInterval(timer);
  }, [activeReview]);

  // FAQs open state (allows toggling independently)
  const [openFaq, setOpenFaq] = useState<number | null>(1);

  return (
    <div 
      id="home-page" 
      className="overflow-x-hidden"
      style={{
        backgroundImage: 'url(/background/backgound\ 1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >

      {/* 1. HIGH-IMPACT HERO SLIDER */}
      <HeroSlider onBookConsultation={() => setIsBookingModalOpen(true)} />

      {/* 2. CORE SERVICE HIGHLIGHT: Horizontal Scroll Services */}
      <section id="core-spotlight" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-extrabold tracking-widest text-red-600 uppercase bg-red-50 px-3 py-1.5 rounded-md">
              Our Services
            </span>
            <div className="space-y-2">
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
                Spaces Designed. Details Built Right.
              </h2>
              {/* Subtle gold accent line */}
              <div className="flex justify-center">
                <div className="h-0.5 w-12 bg-yellow-600" />
              </div>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              From concept and 3D planning to interiors and construction, we take your project from idea to execution.
            </p>
          </div>

          {/* Horizontal Scroll Container */}
          <div className="relative">
            {/* Fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-12 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-12 bg-gradient-to-l from-white to-transparent z-10" />

            {/* Scrollable Container */}
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-6 pb-4 px-2">
                {coreCraftItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 flex-shrink-0 w-80 flex flex-col group"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden bg-gray-200 h-48">
                      <img
                        src={item.img}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-grow space-y-3">
                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-950">
                        {item.title}
                      </h3>

                      {/* Features */}
                      <ul className="space-y-1 text-sm flex-grow">
                        {item.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-gray-700">
                            <span className="text-red-600 font-bold mt-0 text-sm">›</span>
                            <span className="text-xs">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Buttons */}
                      <div className="pt-3 space-y-2 border-t border-gray-200">
                        <button
                          onClick={() => setIsBookingModalOpen(true)}
                          className="w-full text-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors text-xs"
                        >
                          Book Free Consultation
                        </button>
                        <Link
                          to="/services"
                          className="block text-center text-red-600 hover:text-red-700 font-semibold text-xs transition-colors"
                        >
                          Explore Service
                          <ArrowRight className="w-3 h-3 inline ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3.5 ABOUT INTERIOR - PREMIUM EDITORIAL COMPOSITION */}
      <section id="about-interior" className="py-24 lg:py-32 bg-white relative overflow-hidden">
        {/* Subtle architectural background pattern - right side only */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-full h-full opacity-3" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <defs>
              <pattern id="arch-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="100" y2="0" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                <line x1="0" y1="100" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                <line x1="0" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                <line x1="100" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="1000" height="1000" fill="url(#arch-pattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

            {/* LEFT: VIDEO PLAYER */}
            <div className="relative h-96 sm:h-[500px] lg:h-[550px] rounded-2xl overflow-hidden shadow-2xl opacity-0 animate-fade-in-up" style={{animationDelay: '0.1s', animationFillMode: 'forwards'}}>
              <video
                width="100%"
                height="100%"
                controls
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
              >
                <source src="/video/12681248_2160_3840_60fps.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* RIGHT: PREMIUM CONTENT */}
            <div className="flex flex-col justify-center space-y-4 lg:space-y-6 opacity-0 animate-fade-in-up" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>
              
              {/* Label */}
              <div className="text-center lg:text-left">
                <span className="text-lg sm:text-xl font-extrabold tracking-widest text-gray-700 uppercase">
                  About Interior
                </span>
              </div>

              {/* Headline with red accent */}
              <div className="space-y-2">
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                  We provide the best architect & interior design services
                </h2>
              </div>

              {/* Premium Highlight Box */}
              <div className="bg-white border-l-4 border-brand-red p-6 space-y-2 shadow-sm">
                <p className="text-gray-900 font-semibold text-sm leading-relaxed">
                  Our signature design process comes standard...refresh, remodel, new and enjoyable design experience
                </p>
              </div>

              {/* Supporting Paragraph */}
              <p className="text-gray-700 text-base leading-relaxed max-w-lg">
                We believe great design goes beyond aesthetics—it creates experiences and enhances daily life. Our team works closely with you to transform your vision into reality, balancing functionality, elegant materials, and seamless execution every step of the way.
              </p>

              {/* Button */}
              <div className="pt-4">
                <Link
                  to="/services"
                  className="inline-flex items-center px-8 py-3 bg-brand-red hover:bg-red-700 text-white font-bold text-sm uppercase tracking-wide transition-all hover:shadow-lg hover:translate-y-[-2px]"
                >
                  Discover More
                </Link>
              </div>

            </div>

          </div>
        </div>

        {/* Custom animation styles */}
        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
        `}</style>
      </section>
      <section id="projects-teaser" className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <span className="text-xs font-extrabold tracking-widest text-brand-red uppercase block mb-2">Our Work Speaking</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Our Showcase Projects
              </h2>
              <p className="text-gray-500 text-sm max-w-xl mt-2">
                Take a look at some of our residential and commercial builds. We maintain 100% material transparency and deliver clean layouts.
              </p>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-red-500/10"
            >
              Browse Full Grid Gallery
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>

          {/* Quick static grid representation of premium builds */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition-shadow group">
              <div className="relative overflow-hidden h-64">
                <img
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80"
                  alt="Living Room Reno"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <span className="text-xs font-bold text-brand-red uppercase tracking-wider">Residential</span>
                <h4 className="font-display text-lg font-bold text-gray-900 mt-1">Living Room Refresh with Feature Wall</h4>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition-shadow group">
              <div className="relative overflow-hidden h-64">
                <img
                  src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80"
                  alt="Kitchen Modular"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <span className="text-xs font-bold text-brand-red uppercase tracking-wider">Modular Kitchen</span>
                <h4 className="font-display text-lg font-bold text-gray-900 mt-1">Modular Kitchen Upgrade in Lalitpur</h4>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition-shadow group sm:col-span-2 lg:col-span-1">
              <div className="relative overflow-hidden h-64">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
                  alt="Office Build"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <span className="text-xs font-bold text-brand-red uppercase tracking-wider">Commercial</span>
                <h4 className="font-display text-lg font-bold text-gray-900 mt-1">Office Fit-Out with Partition Work</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HAPPY CLIENTS SECTION */}
      <HappyClientsSection />

      {/* 4.5 OUR PROCESS - PREMIUM EDITORIAL DESIGN */}
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

      {/* 5. CLIENT REVIEWS: AVATAR ROW + ACTIVE SPOTLIGHT */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              <span className="text-brand-red">150+</span>{" "}
              <span className="text-gray-900">Satisfied Clients</span>
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-3">
              Real feedback from homeowners and businesses across the Kathmandu Valley.
            </p>
          </div>

          {/* Auto-scrolling review slider (click a client to read their full review below) */}
          <div
            className="relative overflow-hidden mb-14"
            onMouseEnter={() => setIsReviewSliderPaused(true)}
            onMouseLeave={() => setIsReviewSliderPaused(false)}
          >
            {/* Edge fade masks */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 bg-linear-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 bg-linear-to-l from-white to-transparent z-10" />

            <div className="flex w-max gap-10 sm:gap-14">
              <style>{`
                @keyframes infiniteScroll {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(-50%);
                  }
                }
                .animate-infinite-scroll {
                  animation: infiniteScroll 30s linear infinite;
                }
              `}</style>
              <div
                className="flex w-max gap-10 sm:gap-14 animate-infinite-scroll"
                onMouseEnter={() => setIsReviewSliderPaused(true)}
                onMouseLeave={() => setIsReviewSliderPaused(false)}
              >
                {[...testimonials, ...testimonials, ...testimonials].map((t, idx) => {
                  return (
                    <button
                      key={`${t.id}-${idx}`}
                      onClick={() => setActiveReview(idx % testimonials.length)}
                      className="flex flex-col items-center text-center shrink-0 w-32 sm:w-36 group"
                    >
                      <div className="relative mb-4">
                        <img 
                          src={t.avatar}
                          alt={t.name}
                          className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover shadow-md ring-4 ring-white group-hover:ring-red-600 transition-all duration-300"
                        />
                        <span className="absolute -bottom-1 -right-1 bg-red-600 text-white rounded-full p-1.5 shadow-md border-2 border-white">
                          <Quote className="h-3 w-3 fill-white stroke-none" />
                        </span>
                      </div>
                      <span className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-red-600 transition-colors">
                        {t.name}
                      </span>
                      <span className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {t.content}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Premium Testimonial Carousel - Replaces old spotlight */}
          <div className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
              
              {/* Left: Large Interior Project Image */}
              <div className="order-2 lg:order-1">
                <div className="relative rounded-xl overflow-hidden shadow-lg h-64 lg:h-72">
                  <img
                    src={testimonials[activeReview].image}
                    alt={testimonials[activeReview].projectType}
                    className="w-full h-full object-cover"
                  />
                  {/* Badge */}
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-md">
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                      {testimonials[activeReview].projectType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Testimonial Content */}
              <div className="order-1 lg:order-2 flex flex-col justify-center space-y-4">
                
                {/* 5-Star Rating */}
                <div className="flex gap-0.5">
                  {[...Array(testimonials[activeReview].rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 stroke-yellow-500" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-lg sm:text-xl text-gray-900 italic leading-relaxed font-light">
                  "{testimonials[activeReview].content}"
                </p>

                {/* Client Details */}
                <div className="space-y-2">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{testimonials[activeReview].name}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{testimonials[activeReview].role}</p>
                  </div>

                  {/* Project Category */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                    <span className="text-gray-700">{testimonials[activeReview].projectType}</span>
                    <span className="text-gray-400">· Kathmandu</span>
                  </div>

                  {/* View Project Link */}
                  <Link to="/projects" className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-semibold text-xs transition-colors">
                    View This Project
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

            </div>

            {/* Carousel Controls */}
            <div className="mt-6 flex items-center justify-between px-2">
              
              {/* Previous Button */}
              <button
                onClick={() => setActiveReview(activeReview === 0 ? testimonials.length - 1 : activeReview - 1)}
                className="p-1.5 rounded-full border border-gray-300 text-gray-600 hover:border-red-600 hover:text-red-600 transition-all"
                aria-label="Previous"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Progress Line */}
              <div className="flex-1 mx-3 space-y-1">
                <div className="w-full h-0.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 transition-all duration-300"
                    style={{ width: `${((activeReview + 1) / testimonials.length) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 text-center font-medium">
                  {String(activeReview + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={() => setActiveReview(activeReview === testimonials.length - 1 ? 0 : activeReview + 1)}
                className="p-1.5 rounded-full border border-gray-300 text-gray-600 hover:border-red-600 hover:text-red-600 transition-all"
                aria-label="Next"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

            </div>

          </div>

        </div>
      </section>

      {/* 6. OUR PARTNERS */}
      <section id="our-partners" className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-extrabold tracking-widest text-brand-red uppercase bg-red-50 px-3 py-1.5 rounded-md">
              Our Partners
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow flex flex-col">
              <div className="flex flex-col items-center space-y-3 flex-grow">
                <img
                  src="/our partners/Battery Manduu.png"
                  alt="Battery Mandu logo"
                  className="h-20 w-auto object-contain"
                />
                <div className="text-center">
                  <span className="block text-xs font-bold uppercase tracking-wide text-gray-400">
                    Power Partner
                  </span>
                  <span className="block font-bold text-base text-gray-900 mt-1">
                    Battery Mandu
                  </span>
                </div>
              </div>
              <a href="https://www.batterymandu.com/" target="_blank" rel="noopener noreferrer" className="mt-4 pt-4 border-t border-gray-100 text-center text-red-600 hover:text-red-700 font-semibold text-sm transition-colors flex items-center justify-center gap-1">
                View
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow flex flex-col">
              <div className="flex flex-col items-center space-y-3 flex-grow">
                <img
                  src="/our partners/pranam software.png"
                  alt="Pranam Software logo"
                  className="h-20 w-auto object-contain"
                />
                <div className="text-center">
                  <span className="block text-xs font-bold uppercase tracking-wide text-gray-400">
                    Technical Partner
                  </span>
                  <span className="block font-bold text-base text-gray-900 mt-1">
                    Pranam Software
                  </span>
                </div>
              </div>
              <a href="https://www.pranamsoftware.com.np/" target="_blank" rel="noopener noreferrer" className="mt-4 pt-4 border-t border-gray-100 text-center text-red-600 hover:text-red-700 font-semibold text-sm transition-colors flex items-center justify-center gap-1">
                View
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow flex flex-col">
              <div className="flex flex-col items-center space-y-3 flex-grow">
                <img
                  src="/our partners/shuv.png"
                  alt="Shuva Electric logo"
                  className="h-20 w-auto object-contain"
                />
                <div className="text-center">
                  <span className="block text-xs font-bold uppercase tracking-wide text-gray-400">
                    Electricity Partner
                  </span>
                  <span className="block font-bold text-base text-gray-900 mt-1">
                    Shuva Electric
                  </span>
                </div>
              </div>
              <a href="https://shuvaelectric.com.np/" target="_blank" rel="noopener noreferrer" className="mt-4 pt-4 border-t border-gray-100 text-center text-red-600 hover:text-red-700 font-semibold text-sm transition-colors flex items-center justify-center gap-1">
                View
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PREMIUM ACCORDION-STYLE FAQ SECTION */}
      <section id="faqs" className="py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Premium Section Header */}
          <div className="text-center mb-20 space-y-6 opacity-0 animate-fade-in-up" style={{animationDelay: '0.1s', animationFillMode: 'forwards'}}>
            <span className="text-xs font-extrabold tracking-widest text-brand-red uppercase bg-red-50 px-3 py-1.5 rounded-md inline-block">
              Have Questions?
            </span>
            <div className="space-y-4">
              <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Frequently Asked Questions
              </h2>
              <div className="flex justify-center">
                <div className="h-1.5 w-20 bg-brand-red rounded-full shadow-sm" />
              </div>
            </div>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Everything you need to know about our services, timelines, custom fabrication, and how we deliver premium interior solutions.
            </p>
          </div>

          {/* Premium Accordion List */}
          <div className="space-y-4 mb-16">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen 
                      ? "bg-white border-2 border-brand-red shadow-lg shadow-red-500/15" 
                      : "bg-white border-2 border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full text-left px-6 sm:px-8 py-7 flex justify-between items-center hover:bg-gray-50/50 transition-colors focus:outline-none group"
                  >
                    <div className="flex items-start gap-5 flex-1">
                      {/* Premium Numbered Badge */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-base shadow-md border-2 transition-all duration-300 ${
                        isOpen 
                          ? "bg-brand-red text-white border-brand-red" 
                          : "bg-gray-100 text-gray-700 border-gray-200 group-hover:bg-brand-red/10 group-hover:border-brand-red/30"
                      }`}>
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <span className={`font-bold text-lg sm:text-xl transition-colors duration-300 ${
                        isOpen ? "text-brand-red" : "text-gray-900 group-hover:text-brand-red"
                      }`}>
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-6 w-6 text-brand-red flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  {/* Premium FAQ Content Box */}
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="px-6 sm:px-8 pb-8 pt-0 border-t-2 border-gray-100">
                      <div className="ml-15 sm:ml-16 text-base sm:text-lg text-gray-700 leading-relaxed space-y-2">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Premium CTA Box underneath FAQs - ARCHITECTURE STUDIO STYLE */}
          <div className="relative py-16 sm:py-24 px-0 sm:px-8 opacity-0 animate-fade-in-up" style={{animationDelay: '0.3s', animationFillMode: 'forwards'}}>
            {/* Premium CTA Panel */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{boxShadow: '0 25px 60px rgba(220, 38, 38, 0.15)'}}>
              
              {/* Background Image */}
              <img 
                src="/background/backgound 1.png"
                alt="Interior design background"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Premium Red Overlay - Lighter for premium feel */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-red/35 via-brand-red/30 to-brand-red/25" />

              {/* Content Container */}
              <div className="relative z-10 max-w-2xl p-8 sm:p-16">
                
                {/* Eyebrow with accent line */}
                <div className="flex items-center gap-3 mb-6 opacity-0 animate-fade-in-up" style={{animationDelay: '0.4s', animationFillMode: 'forwards'}}>
                  <div className="w-1 h-5 bg-yellow-400 rounded-full shadow-sm" />
                  <span className="text-xs font-extrabold tracking-widest text-yellow-300 uppercase">
                    Ready to Begin?
                  </span>
                </div>

                {/* Main Heading */}
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4 opacity-0 animate-fade-in-up" style={{animationDelay: '0.45s', animationFillMode: 'forwards'}}>
                  Let's Create Your Perfect Space
                </h2>

                {/* Supporting Paragraph */}
                <p className="text-gray-100 text-sm sm:text-base leading-relaxed mb-8 max-w-xl opacity-0 animate-fade-in-up" style={{animationDelay: '0.5s', animationFillMode: 'forwards'}}>
                  From concept to completion, thoughtful design and timeless interiors tailored for you.
                </p>

                {/* CTA Button + Secondary Link */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 opacity-0 animate-fade-in-up" style={{animationDelay: '0.55s', animationFillMode: 'forwards'}}>
                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="inline-flex items-center px-6 sm:px-8 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs uppercase tracking-widest rounded-lg transition-all hover:shadow-lg hover:shadow-yellow-400/40 hover:translate-y-[-2px] gap-2 group"
                  >
                    Start Your Project
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
