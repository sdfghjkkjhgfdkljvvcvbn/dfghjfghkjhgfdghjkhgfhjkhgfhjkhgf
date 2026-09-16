import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface HeaderProps {
  onBookConsultation?: () => void;
  isModalOpen?: boolean;
}

export default function Header({ onBookConsultation, isModalOpen }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const handleBookConsultation = () => {
    if (onBookConsultation) {
      onBookConsultation();
    } else {
      window.dispatchEvent(new CustomEvent('openBookingModal'));
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Projects", path: "/projects" },
    { name: "Blog", path: "/blog" },
    { name: "Contact Us", path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Top utility bar */}
      <div id="topbar" className="hidden sm:block bg-brand-red-dark text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-9 text-xs font-semibold">
          <div className="flex items-center gap-3">
            </div>
            <div className="flex items-center gap-5">
              <a href="https://wa.me/919851350892" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-red-100 transition-colors">
                <Phone className="h-3.5 w-3.5" />
                9851350892
              </a>
              <span className="hidden md:flex items-center gap-1.5 text-red-100/90">
                <MapPin className="h-3.5 w-3.5" />
                Kathmandu, Nepal
              </span>
            </div>
          </div>
        </div>
      </div>

      <header
        id="main-header"
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          isModalOpen
            ? "bg-transparent border-transparent"
            : isScrolled
            ? "bg-white/80 backdrop-blur-lg border-gray-100 shadow-sm"
            : "bg-white border-transparent shadow-none"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex justify-between items-center transition-all duration-300 ${
              isScrolled ? "h-16" : "h-20"
            }`}
          >
            {/* Logo Brand */}
            <Link id="logo-link" to="/" className={`flex items-center group transition-opacity ${isModalOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
              <img src="/logo/logo_for_parbati_interior (1).png" alt="Parbati Interior" className="h-20 w-auto object-contain" />
            </Link>

            {/* Desktop Navigation links */}
            <nav id="desktop-nav" className={`hidden md:flex items-center space-x-8 transition-opacity ${isModalOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  id={`nav-${link.name.toLowerCase().replace(" ", "-")}`}
                  to={link.path}
                  className={`relative py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                    isActive(link.path)
                      ? "text-brand-red"
                      : "text-gray-900 hover:text-brand-red"
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <motion.span
                      layoutId="active-nav-underline"
                      className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-brand-red rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className={`hidden md:block transition-opacity ${isModalOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
              <button
                id="header-cta"
                onClick={handleBookConsultation}
                className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-full text-white bg-brand-red-dark hover:bg-brand-red shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                Book a Consultation
              </button>
            </div>

            {/* Mobile hamburger menu trigger */}
            <div className={`flex md:hidden transition-opacity ${isModalOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
              <button
                id="mobile-menu-toggle"
                onClick={() => setIsOpen(!isOpen)}
                className="relative inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-brand-red hover:bg-gray-50 focus:outline-hidden transition-colors"
                aria-expanded={isOpen}
                aria-label={isOpen ? "Close main menu" : "Open main menu"}
              >
                <span className="sr-only">{isOpen ? "Close main menu" : "Open main menu"}</span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isOpen ? "close" : "open"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex"
                  >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              className="md:hidden border-b border-gray-100 bg-white overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
                <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-500">
                  <Phone className="h-3.5 w-3.5 text-brand-red" />
                  <a href="https://wa.me/919851350892" target="_blank" rel="noopener noreferrer" className="hover:text-brand-red transition-colors">9851350892</a>
                  <span className="text-gray-300">|</span>
                  <MapPin className="h-3.5 w-3.5 text-brand-red" />
                  Kathmandu, Nepal
                </div>
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                  >
                    <Link
                      id={`mobile-nav-${link.name.toLowerCase().replace(" ", "-")}`}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-base font-bold uppercase tracking-wide transition-colors ${
                        isActive(link.path)
                          ? "text-brand-red bg-red-50/50"
                          : "text-gray-900 hover:text-brand-red hover:bg-gray-50"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  className="pt-4 pb-2 px-4 border-t border-gray-50"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.04, duration: 0.2 }}
                >
                  <button
                    id="mobile-header-cta"
                    onClick={() => {
                      setIsOpen(false);
                      handleBookConsultation();
                    }}
                    className="w-full text-center px-4 py-3 border border-transparent text-base font-bold rounded-full text-white bg-brand-red-dark hover:bg-brand-red transition-colors shadow-sm"
                  >
                    Book a Consultation
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
