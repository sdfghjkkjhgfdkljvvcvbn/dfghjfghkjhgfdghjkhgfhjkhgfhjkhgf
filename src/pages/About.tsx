import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Users, Clock, CheckCircle, MapPin, Phone, Mail } from "lucide-react";

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

export default function About() {
  useEffect(() => {
    document.title = "About Us | Parbati Interior Pvt. Ltd.";
  }, []);

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO BANNER ─────────────────────────────────────────── */}
      <section className="relative bg-gray-900 py-28 sm:py-36 overflow-hidden">
        {/* Background image placeholder */}
        <div className="absolute inset-0">
          {/* Replace src with actual hero image when available */}
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(255,255,255,.05) 40px,rgba(255,255,255,.05) 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(255,255,255,.05) 40px,rgba(255,255,255,.05) 41px)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-extrabold tracking-widest text-red-400 uppercase bg-red-500/10 border border-red-500/20 px-3.5 py-1.5 rounded-md inline-block mb-6">
            About Us
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Designing Spaces.<br />
            <span className="text-yellow-500 italic font-serif font-light">Building Dreams.</span>
          </h1>
          <p className="mt-6 text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Parbati Interior Pvt. Ltd. is a Kathmandu-based interior design and general construction company delivering premium spaces for homes, offices, and commercial properties across the Nepal valley.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-brand-red hover:bg-brand-red-dark text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-red-500/20 hover:-translate-y-0.5"
            >
              Get in Touch
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-white/30 hover:border-yellow-400 text-white hover:text-yellow-400 font-bold rounded-xl text-sm transition-all backdrop-blur-sm"
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
                {/* ← Replace this div with <img src="..." /> when you have the photo */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-400 text-sm font-medium">[ Company / Office Photo ]</span>
                </div>
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
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow space-y-3 group">
                <div className="text-3xl">{icon}</div>
                <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-brand-red transition-colors">
                  {title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEET THE TEAM ───────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-extrabold tracking-widest text-brand-red uppercase bg-red-50 px-3 py-1.5 rounded-md inline-block">
              The People Behind the Work
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Meet Our Team
            </h2>
            <div className="flex justify-center">
              <div className="h-0.5 w-12 bg-yellow-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map(({ name, role, image, bio }) => (
              <div key={name} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
                {/* Team member photo placeholder */}
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden flex items-center justify-center">
                  {image ? (
                    <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-gray-400 text-sm font-medium">[ Team Photo ]</span>
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="font-display text-lg font-bold text-gray-900">{name}</h3>
                  <p className="text-xs font-bold text-brand-red uppercase tracking-wider">{role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR WORKSPACE / STUDIO ──────────────────────────────── */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Content */}
            <div className="space-y-6 order-2 lg:order-1">
              <span className="text-xs font-extrabold tracking-widest text-brand-red uppercase bg-red-50 px-3 py-1.5 rounded-md inline-block">
                Our Workshop
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                Built In-House. Delivered On-Site.
              </h2>
              <div className="w-12 h-0.5 bg-yellow-500" />
              <p className="text-gray-600 text-sm leading-relaxed">
                Unlike most firms that outsource fabrication, we operate our own fully equipped woodworking and metal-welding workshop in Kathmandu. This means tighter quality control, faster turnaround, and full customization for every client.
              </p>
              <ul className="space-y-3">
                {[
                  "In-house woodworking & metal fabrication",
                  "Custom furniture to exact dimensions",
                  "WPC paneling, ceiling & cladding works",
                  "Full turnkey project management",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-brand-red shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Image grid placeholder */}
            <div className="grid grid-cols-2 gap-4 order-1 lg:order-2">
              {/* Large image */}
              <div className="col-span-2 rounded-2xl overflow-hidden aspect-video bg-gray-100 flex items-center justify-center shadow-md">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-400 text-sm font-medium">[ Workshop / Studio Photo ]</span>
                </div>
              </div>
              {/* Two smaller images */}
              <div className="rounded-xl overflow-hidden aspect-square bg-gray-100 flex items-center justify-center shadow-sm">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-400 text-xs font-medium text-center px-2">[ Work in Progress ]</span>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden aspect-square bg-gray-100 flex items-center justify-center shadow-sm">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-400 text-xs font-medium text-center px-2">[ Finished Detail ]</span>
                </div>
              </div>
            </div>

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
