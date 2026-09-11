import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Hammer,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Facebook,
  Instagram,
  MessageCircle,
  ArrowUp,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const services = [
    { label: "Site Measurement & Layout Planning", hash: "space-planning" },
    { label: "VR Walkthrough Before It's Built", hash: "vr-walkthrough" },
    { label: "Commercial WPC Cladding & Panel Work", hash: "wpc-cladding" },
    { label: "Bulk Institutional & Custom Furniture", hash: "custom-furniture" },
    { label: "General Civil Construction & Finishing", hash: "general-construction" },
  ];

  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "Services", to: "/services" },
    { label: "Projects", to: "/projects" },
    { label: "Blog", to: "/blog" },
    { label: "Contact Us", to: "/contact" },
  ];

  const whatsappUrl =
    "https://wa.me/919851350892?text=Hello%20Parbati%20Interior!%20I%20visited%20your%20website%20and%20would%20like%20to%20know%20more.";

  return (
    <footer id="main-footer" className="bg-brand-red-light text-gray-700 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
          {/* Brand */}
          <div className="space-y-5">
            <Link id="footer-logo-link" to="/" className="flex items-center space-x-3 group">
              <div className="bg-brand-red text-white p-2 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/20">
                <Hammer className="h-5 w-5" />
              </div>
              <div>
                <span className="block font-display text-lg font-bold tracking-tight text-gray-900 group-hover:text-brand-red transition-colors">
                  Parbati Interior
                </span>
                <span className="block text-[10px] font-semibold tracking-widest text-gray-500 uppercase">
                  Pvt. Ltd.
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              We bring practical, well-finished interiors and construction to homes and
              businesses across the Kathmandu Valley, from first measurement to final handover.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="#"
                aria-label="Facebook"
                className="bg-brand-red text-white p-2 rounded-full hover:bg-brand-red-dark transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="bg-brand-red text-white p-2 rounded-full hover:bg-brand-red-dark transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="bg-brand-red text-white p-2 rounded-full hover:bg-brand-red-dark transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display text-base font-bold text-gray-900 mb-5">Services</h3>
            <ul className="space-y-3 text-sm">
              {services.map((s) => (
                <li key={s.hash}>
                  <Link to={`/services#${s.hash}`} className="hover:text-brand-red transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-base font-bold text-gray-900 mb-5">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="flex items-center gap-1.5 hover:text-brand-red transition-colors">
                    <ChevronRight className="h-3.5 w-3.5 text-brand-red shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Have a Question */}
          <div>
            <h3 className="font-display text-base font-bold text-gray-900 mb-5">Have a Question?</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-brand-red mt-0.5 shrink-0" />
                <span>Shantinagar-31, Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-brand-red shrink-0" />
                <a href="https://wa.me/919851350892" target="_blank" rel="noopener noreferrer" className="hover:text-brand-red transition-colors">
                  9851350892
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-brand-red shrink-0" />
                <a href="mailto:Parbatiinterior07@gmail.com" className="hover:text-brand-red transition-colors">
                  Parbatiinterior07@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-brand-red-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-red-50">
          <p id="copyright-text">&copy; {currentYear} Parbati Interior Pvt. Ltd. All rights reserved.</p>
        </div>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-24 right-6 z-50 bg-brand-red text-white p-3 rounded-full shadow-lg hover:bg-brand-red-dark transition-colors"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </footer>
  );
}
