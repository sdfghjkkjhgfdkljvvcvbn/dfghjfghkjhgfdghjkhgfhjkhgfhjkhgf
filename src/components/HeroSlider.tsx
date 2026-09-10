import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface Slide {
  id: string;
  headline: string;
  headlineAccent: string;
  supportingText: string;
  secondarySupportText: string;
  backgroundImage: string;
}

const slides: Slide[] = [
  {
    id: "living-room",
    headline: "Transforming Spaces",
    headlineAccent: "Into Beautiful Homes",
    supportingText: "Stylish. Functional. Timeless.",
    secondarySupportText: "Complete interior solutions for your home and office.",
    backgroundImage: "/slider/1.png",
  },
  {
    id: "bedroom",
    headline: "Beautiful Bedrooms",
    headlineAccent: "Designed Around You",
    supportingText: "Comfort meets elegance.",
    secondarySupportText: "Personalized spaces that reflect your lifestyle.",
    backgroundImage: "/slider/2.png",
  },
  {
    id: "kitchen",
    headline: "Smart Kitchens.",
    headlineAccent: "Beautiful Living.",
    supportingText: "Form meets function.",
    secondarySupportText: "Where culinary dreams come to life.",
    backgroundImage: "/slider/3.jpg",
  },
  {
    id: "office-space",
    headline: "Professional Spaces",
    headlineAccent: "Crafted for Success",
    supportingText: "Modern. Productive. Inspiring.",
    secondarySupportText: "Transform your workspace into a productivity powerhouse.",
    backgroundImage: "/slider/4.png",
  },
  {
    id: "complete-home",
    headline: "Your Dream Home,",
    headlineAccent: "Designed & Delivered",
    supportingText: "Complete transformation.",
    secondarySupportText: "From vision to reality in every detail.",
    backgroundImage: "/slider/5.png",
  },
];

const AUTOPLAY_MS = 3000;

interface HeroSliderProps {
  onBookConsultation?: () => void;
}

export default function HeroSlider({ onBookConsultation }: HeroSliderProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = (index: number) => {
    setActiveSlide(((index % slides.length) + slides.length) % slides.length);
  };
  const nextSlide = () => goTo(activeSlide + 1);
  const prevSlide = () => goTo(activeSlide - 1);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = slides[activeSlide];

  return (
    <section
      id="hero-slider"
      className="relative bg-black overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Hero container */}
      <div className="relative w-full py-24 md:py-32">
        {/* Background with real photography */}
        <AnimatePresence mode="sync">
          <motion.div
            key={slide.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Background image with fade transition */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('${slide.backgroundImage}')`,
              }}
            />
            
            {/* Subtle fade at bottom for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />

            {/* Left-side dark overlay for text contrast - sophisticated gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/15 to-transparent" />
            
            {/* Subtle ambient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/15" />
            
            {/* Premium grain texture - very subtle */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none" 
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,.02) 2px, rgba(255,255,255,.02) 4px)",
              }} 
            />
          </motion.div>
        </AnimatePresence>

        {/* Content Container */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full text-center">
            {/* Main content area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${slide.id}-content`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-7"
              >
                {/* Label */}
                <span className="text-sm font-bold tracking-widest text-yellow-600 uppercase mb-4 inline-block">
                  {slide.supportingText}
                </span>

                {/* Headline - Premium editorial typography */}
                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] font-sans">
                    {slide.headline}
                  </h1>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-[1.1] font-serif">
                    <span className="font-serif text-yellow-600 italic font-light">
                      {slide.headlineAccent}
                    </span>
                  </h2>
                </div>

                {/* Brand name - Parbati Interior */}
                <p className="text-lg md:text-xl text-gray-100 leading-relaxed">
                  Parbati Interior
                </p>

                {/* Supporting text */}
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-light max-w-2xl mx-auto">
                  {slide.secondarySupportText}
                </p>

                {/* CTAs - Dual action buttons with premium styling */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <Link
                    id="hero-slider-cta"
                    to="/projects"
                    className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold text-black bg-gradient-to-br from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-400/50 active:translate-y-0"
                  >
                    Explore Our Projects
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>

                  <a
                    href="https://wa.me/919851350892"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold text-white border-2 border-white/40 hover:border-amber-400 hover:text-amber-300 transition-all duration-300 bg-white/5 backdrop-blur-md hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  >
                    <Phone className="h-4 w-4" />
                    ☎ 9851350892
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>



        {/* Vertical Social Bar - Left side, fixed to viewport */}
        <div className="fixed left-3 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-3">
          {/* YouTube */}
          <a href="https://www.youtube.com/@parbatiinterior" target="_blank" rel="noopener noreferrer" aria-label="YouTube"
            className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white hover:bg-red-600 transition-colors duration-200 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 461.001 461.001" className="w-4 h-4 fill-current">
              <path d="M365.257 67.393H95.744C42.866 67.393 0 110.259 0 163.137v134.728c0 52.878 42.866 95.744 95.744 95.744h269.513c52.878 0 95.744-42.866 95.744-95.744V163.137c0-52.878-42.866-95.744-95.744-95.744zm-64.751 169.663-126.06 60.123c-3.359 1.602-7.239-.847-7.239-4.568V168.607c0-3.774 3.982-6.22 7.348-4.514l126.06 63.881c3.748 1.899 3.683 7.274-.109 9.082z"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a href="https://www.linkedin.com/company/parbati-interior" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
            className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white hover:bg-blue-700 transition-colors duration-200 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>

          {/* Facebook */}
          <a href="https://www.facebook.com/p/Parbati-interior-pvtltd-100068017241571/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
            className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white hover:bg-blue-600 transition-colors duration-200 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
            </svg>
          </a>

          {/* Instagram */}
          <a href="https://www.instagram.com/parbatiinterior" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
            className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white hover:bg-pink-600 transition-colors duration-200 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </a>

          {/* WhatsApp */}
          <a href="https://wa.me/9851350892" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
            className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white hover:bg-green-500 transition-colors duration-200 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>

          {/* TikTok */}
          <a href="https://vt.tiktok.com/ZSqSa986J/" target="_blank" rel="noopener noreferrer" aria-label="TikTok"
            className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white hover:bg-[#ff0050] transition-colors duration-200 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
            </svg>
          </a>

          {/* Pinterest */}
          <a href="https://www.pinterest.com/parbatiinterior" target="_blank" rel="noopener noreferrer" aria-label="Pinterest"
            className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white hover:bg-red-700 transition-colors duration-200 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
            </svg>
          </a>

          {/* Divider line */}
          <div className="w-px h-28 bg-gray-700" />

          {/* SHARE text - rotated */}
          <span className="text-gray-700 text-[10px] font-bold tracking-[0.25em] uppercase" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
            Share
          </span>
        </div>
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
          {slides.map((s, idx) => (
            <motion.button
              key={s.id}
              onClick={() => goTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400/50 ${
                idx === activeSlide
                  ? "bg-amber-500 w-8 h-2.5 shadow-lg shadow-amber-500/50"
                  : "bg-white/30 w-2.5 h-2.5 hover:bg-white/50"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
