import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Phone, ArrowRight } from "lucide-react";
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

const AUTOPLAY_MS = 4000;

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
    const timer = setInterval(nextSlide, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [activeSlide, isPaused]);

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

        {/* Slider Controls - Bottom Right Corner */}
        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20 flex items-center gap-6 sm:gap-8">
          {/* Slide counter - elegant typography */}
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-white/80 tracking-widest uppercase">
              Slide
            </div>
            <div className="text-lg font-bold text-white tabular-nums mt-1">
              {String(activeSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </div>
            <div className="h-px w-6 bg-gradient-to-r from-amber-500 to-transparent mt-2" />
          </div>

          {/* Navigation buttons - Premium styled */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="p-3 rounded-xl border border-white/40 text-white hover:border-amber-400 hover:text-amber-300 hover:bg-white/15 transition-all duration-300 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-amber-400/50 group"
            >
              <ChevronLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
            </button>

            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="p-3 rounded-xl border border-white/40 text-white hover:border-amber-400 hover:text-amber-300 hover:bg-white/15 transition-all duration-300 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-amber-400/50 group"
            >
              <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Slide dots - Bottom center */}
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
