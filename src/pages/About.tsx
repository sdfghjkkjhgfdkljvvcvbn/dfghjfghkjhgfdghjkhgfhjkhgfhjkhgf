import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Users, Clock, CheckCircle, MapPin, Phone, Mail, ChevronDown } from "lucide-react";

const stats = [
  { value: "150+", label: "Happy Clients", icon: Users },
  { value: "8+", label: "Years Experience", icon: Clock },
  { value: "200+", label: "Projects Completed", icon: Award },
  { value: "100%", label: "Client Satisfaction", icon: CheckCircle },
];

const team = [
  {
    name: "Founder & Lead Designer",
    role: "Interior Design & Planning",
    // Replace with actual image path
    image: null,
    bio: "Passionate about creating functional and beautiful spaces that reflect the client's personality and lifestyle.",
  },
  {
    name: "Senior Architect",
    role: "Structural & Construction",
    image: null,
    bio: "Expert in blending modern architecture with traditional Nepali design sensibilities for enduring results.",
  },
  {
    name: "Project Manager",
    role: "Execution & Client Relations",
    image: null,
    bio: "Ensures every project is delivered on time, within budget, and to the highest quality standards.",
  },
];

const values = [
  {
    title: "Quality First",
    description: "We use only premium materials and partner with skilled craftsmen to ensure every detail is built to last.",
    icon: "🏆",
  },
  {
    title: "Client-Centered",
    description: "Your vision drives everything. We listen, collaborate, and refine until the result exceeds expectations.",
    icon: "🤝",
  },
  {
    title: "Transparent Process",
    description: "No hidden costs, no surprises. We keep you informed at every stage from design to handover.",
    icon: "💡",
  },
  {
    title: "On-Time Delivery",
    description: "We respect your time. Our structured project timelines ensure work is completed as promised.",
    icon: "⏱️",
  },
];

const faqs = [
  {
    question: "How much time does a typical interior design project take?",
    answer: "Project timelines vary based on scope. A simple home makeover typically takes 3–4 months, while larger projects like full home renovations or commercial spaces can take 6–12 months. We provide a detailed timeline during the initial consultation.",
  },
  {
    question: "What is your design process like?",
    answer: "We follow a structured process: 1) Site visit and understanding your needs, 2) 3D design planning and visualization, 3) Material selection and quotation, 4) Fabrication in our workshop, 5) Installation and handover. Regular updates keep you informed at every stage.",
  },
  {
    question: "Do you provide 3D visualizations before construction starts?",
    answer: "Yes, absolutely. We create detailed 3D renderings of your space so you can visualize the final result before any work begins. This helps ensure the design aligns with your expectations and allows for easy modifications.",
  },
  {
    question: "What services do you offer?",
    answer: "We offer complete interior design and construction services including home interiors and decor, modular kitchens and furniture, WPC works (walls, ceilings, cladding), 3D planning and visualization, commercial office interiors, and project management from start to finish.",
  },
  {
    question: "Can you work within my budget?",
    answer: "Absolutely. We believe great design is possible at any budget. During consultation, we understand your financial constraints and create solutions that maximize value without compromising quality. Our in-house fabrication also helps us offer competitive pricing.",
  },
  {
    question: "What areas do you serve?",
    answer: "We primarily serve Kathmandu Valley including Kathmandu, Lalitpur (Patan), and Bhaktapur. We also undertake special projects in nearby regions. Contact us to discuss your specific location.",
  },
  {
    question: "Do you provide a warranty on your work?",
    answer: "Yes, we stand behind our work. We provide workmanship guarantees on all completed projects. Specific warranty periods depend on the type of work and materials used. We'll discuss this in detail during your consultation.",
  },
  {
    question: "How do I get started?",
    answer: "It's simple: Contact us via WhatsApp, email, or phone to schedule a free site visit. Our team will listen to your ideas, assess your space, and prepare a detailed quotation with timeline and design options. No obligation—just honest consultation.",
  },
];

export default function About() {
  const [openFaqId, setOpenFaqId] = useState<number | null>(0);

  useEffect(() => {
    document.title = "About Us | Parbati Interior Pvt. Ltd.";
  }, []);

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO SECTION - BLOG POST CARD SIZE ──────────────────── */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Card - Same Size as Blog Post */}
          <div className="relative h-80 sm:h-[450px] rounded-3xl overflow-hidden bg-gray-950 shadow-xl group border border-gray-100 mb-12">
            <img
              src="/about page/hero sesision  image.png"
              alt="Parbati Interior Studio"
              className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-opacity duration-300"
            />
            {/* Overlay gradient for better contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col items-start justify-end p-6 sm:p-8">
              <div className="space-y-2">
                <span className="text-xs font-extrabold tracking-widest text-gray-900 uppercase bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg inline-block">
                  About
                </span>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
                  Designing Spaces<br />Building Dreams
                </h2>
                <p className="text-sm sm:text-base text-gray-800 font-medium max-w-md">
                  Parbati Interior Pvt. Ltd.
                </p>
              </div>
            </div>
          </div>

          {/* Content Below Card */}
          <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-red hover:bg-brand-red-dark text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-red-500/20 hover:-translate-y-0.5"
            >
              Get in Touch
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-gray-300 hover:border-brand-red text-gray-700 hover:text-brand-red font-bold rounded-xl text-sm transition-all"
            >
              View Our Work
            </Link>
          </div>

        </div>
      </section>

      {/* ── STATS ROW ───────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center justify-center py-10 px-6 text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-1">
                  <Icon className="h-5 w-5 text-brand-red" />
                </div>
                <span className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900">{value}</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO WE ARE ──────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Image block — placeholder, swap with real photo */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-gray-100 flex items-center justify-center">
                {/* Office Photo */}
                <img 
                  src="/about page/parbati interior office.png" 
                  alt="Parbati Interior Office" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating accent card */}
              <div className="absolute -bottom-6 -right-4 sm:-right-8 bg-brand-red text-white rounded-2xl px-6 py-4 shadow-xl shadow-red-500/20 z-10">
                <p className="text-2xl font-extrabold font-display leading-none">8+</p>
                <p className="text-xs font-bold tracking-wider uppercase mt-1 text-red-100">Years in Nepal</p>
              </div>
              {/* Gold accent line */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-yellow-500 rounded-tl-2xl opacity-60" />
            </div>

            {/* Content */}
            <div className="space-y-6">
              <span className="text-xs font-extrabold tracking-widest text-brand-red uppercase bg-red-50 px-3 py-1.5 rounded-md inline-block">
                Who We Are
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                A Full-Service Interior & Construction Company in Kathmandu
              </h2>
              <div className="w-12 h-0.5 bg-yellow-500" />
              <p className="text-gray-600 text-sm leading-relaxed">
                Founded with a passion for transforming spaces, Parbati Interior Pvt. Ltd. has grown into one of Kathmandu Valley's most trusted interior design and construction firms. We combine thoughtful design with practical execution to deliver results that are beautiful, durable, and tailored to each client.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                From concept and 3D planning to full-scale construction, modular kitchens, WPC works, and custom furniture — our team handles every stage in-house, ensuring quality control and clear communication throughout.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-red-500/10"
                >
                  Our Services
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 hover:border-brand-red text-gray-700 hover:text-brand-red font-bold rounded-xl text-sm transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── OUR VALUES ──────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-extrabold tracking-widest text-brand-red uppercase bg-red-50 px-3 py-1.5 rounded-md inline-block">
              What Drives Us
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Our Core Values
            </h2>
            <div className="flex justify-center">
              <div className="h-0.5 w-12 bg-yellow-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ title, description, icon }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-brand-red transition-all duration-300 group cursor-pointer">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-brand-red transition-colors mb-3">
                  {title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEET THE CHAIRPERSON ───────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* LEFT: Chairperson Info */}
            <div className="space-y-6">
              <span className="text-xs font-extrabold tracking-widest text-brand-red uppercase bg-red-50 px-3 py-1.5 rounded-md inline-block">
                Leadership
              </span>
              <div>
                <h3 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-2">Chairperson</h3>
                <p className="text-sm font-bold text-brand-red uppercase tracking-wider">Vision & Direction</p>
              </div>
              <div className="w-12 h-0.5 bg-yellow-500" />
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                Visionary leader guiding Parbati Interior Pvt. Ltd. with expertise in interior design and construction. Committed to delivering premium, innovative solutions across Kathmandu Valley.
              </p>
            </div>

            {/* RIGHT: Chairperson Image with Accent */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] bg-gray-100">
                <img 
                  src="/about page/chairperson image.jpg" 
                  alt="Chairperson" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating accent card */}
              <div className="absolute -bottom-6 -right-4 sm:-right-8 bg-brand-red text-white rounded-2xl px-6 py-4 shadow-xl shadow-red-500/20 z-10">
                <p className="text-2xl font-extrabold font-display leading-none">8+</p>
                <p className="text-xs font-bold tracking-wider uppercase mt-1 text-red-100">Years Leading</p>
              </div>
              {/* Gold accent line */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border-t-4 border-r-4 border-yellow-500 rounded-tr-2xl opacity-60" />
            </div>

          </div>
        </div>
      </section>

      {/* ── OUR WORKSPACE / STUDIO ──────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

            {/* LEFT: VIDEO PLAYER - EXACT SIZE FROM HOMEPAGE */}
            <div className="relative h-96 sm:h-[500px] lg:h-[550px] rounded-2xl overflow-hidden shadow-2xl">
              <video
                width="100%"
                height="100%"
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
              >
                <source src="/our workplace/workplace.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* RIGHT: CONTENT - EXACT STYLING FROM HOMEPAGE */}
            <div className="flex flex-col justify-center space-y-4 lg:space-y-6">
              
              {/* Label */}
              <div className="text-center lg:text-left">
                <span className="text-lg sm:text-xl font-extrabold tracking-widest text-gray-700 uppercase">
                  About Interior
                </span>
              </div>

              {/* Headline */}
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
      </section>

      {/* ── FAQ SECTION ─────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Premium Section Header */}
          <div className="text-center mb-20 space-y-6">
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
              const isOpen = openFaqId === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen 
                      ? "bg-white border-2 border-brand-red shadow-lg shadow-red-500/15" 
                      : "bg-white border-2 border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : index)}
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
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────── */}
      <section className="py-20 bg-brand-red relative overflow-hidden">
        {/* Subtle pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(255,255,255,.1) 20px,rgba(255,255,255,.1) 21px)",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Ready to Transform Your Space?
          </h2>
          <p className="text-red-100 text-sm sm:text-base max-w-xl mx-auto">
            Get a free site visit and consultation from our team. We serve Kathmandu, Lalitpur, and Bhaktapur.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-red hover:bg-gray-50 font-bold rounded-xl text-sm transition-all shadow-lg"
            >
              Book Free Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://wa.me/9851350892"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/40 hover:border-white text-white font-bold rounded-xl text-sm transition-all"
            >
              <Phone className="h-4 w-4" />
              WhatsApp Us
            </a>
          </div>

          {/* Contact details */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4 text-red-100 text-xs font-medium">
            <span className="flex items-center gap-1.5 justify-center">
              <MapPin className="h-3.5 w-3.5" /> Shantinagar-31, Kathmandu, Nepal
            </span>
            <span className="flex items-center gap-1.5 justify-center">
              <Phone className="h-3.5 w-3.5" /> 9851350892
            </span>
            <span className="flex items-center gap-1.5 justify-center">
              <Mail className="h-3.5 w-3.5" /> Parbatiinterior07@gmail.com
            </span>
          </div>
        </div>
      </section>

    </div>
  );
}
