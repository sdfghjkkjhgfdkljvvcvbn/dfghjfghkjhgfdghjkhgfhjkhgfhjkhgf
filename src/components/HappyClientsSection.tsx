import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

interface ClientTestimonial {
  id: number;
  video_path?: string;
  videoPath?: string;
  name?: string;
  title?: string;
  client_image?: string;
  clientImage?: string;
  project_image?: string;
  projectImage?: string;
  rating?: number;
}

// Fallback testimonials (in case database is empty or not connected)
const fallbackTestimonials: ClientTestimonial[] = [
  {
    id: 1,
    videoPath: "/video/our happy client/1.mp4",
    name: "Garima",
    title: "Homeowner - Living Room Transformation",
    clientImage: "/reviewers/garima.jpg",
    projectImage: "/reviewers/garima.jpg",
    rating: 5,
  },
  {
    id: 2,
    videoPath: "/video/our happy client/2.mp4",
    name: "Harshit",
    title: "Interior Design Client - Office Space",
    clientImage: "/reviewers/harshit-bgremoved.png",
    projectImage: "/reviewers/harshit-bgremoved.png",
    rating: 5,
  },
  {
    id: 3,
    videoPath: "/video/our happy client/3.mp4",
    name: "Ranjana",
    title: "Kitchen Renovation Client",
    clientImage: "/reviewers/ranjana.jpeg",
    projectImage: "/reviewers/ranjana.jpeg",
    rating: 5,
  },
  {
    id: 4,
    videoPath: "/video/our happy client/4.mp4",
    name: "Siddharth",
    title: "Bedroom Design Client",
    clientImage: "/reviewers/siddharth.png",
    projectImage: "/reviewers/siddharth.png",
    rating: 5,
  },
  {
    id: 5,
    videoPath: "/video/our happy client/5 .mp4",
    name: "Mishara Family",
    title: "Kitchen Design & Consultancy",
    clientImage: "/reviewers/mishara family.jpeg",
    projectImage: "/reviewers/mishara family.jpeg",
    rating: 5,
  },
];

export default function HappyClientsSection() {
  const [testimonials, setTestimonials] = useState<ClientTestimonial[]>(fallbackTestimonials);
  const [loading, setLoading] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  useEffect(() => {
    loadTestimonials();

    // Set up realtime subscription for updates
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const subscription = supabase
        .channel("happy-clients-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "happy_clients" }, () => {
          console.log("Happy Clients updated, reloading...");
          loadTestimonials();
        })
        .subscribe();

      return () => {
        subscription?.unsubscribe();
      };
    }
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        console.warn("Supabase not configured, using fallback testimonials");
        setTestimonials(fallbackTestimonials);
        setLoading(false);
        return;
      }

      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from("happy_clients")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.warn("Error loading testimonials from database:", error.message);
        console.warn("Using fallback testimonials");
        setTestimonials(fallbackTestimonials);
      } else if (data && data.length > 0) {
        console.log("Loaded testimonials from database:", data);
        setTestimonials(data);
        setPlayingVideoId(data[0]?.id || null);
      } else {
        console.log("No testimonials in database, using fallback");
        setTestimonials(fallbackTestimonials);
        setPlayingVideoId(fallbackTestimonials[0]?.id || null);
      }
    } catch (error) {
      console.error("Error loading testimonials:", error);
      setTestimonials(fallbackTestimonials);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const toggleVideoPlay = (videoId: number) => {
    Object.keys(videoRefs.current).forEach((id) => {
      const vid = videoRefs.current[parseInt(id)];
      if (vid && parseInt(id) !== videoId) {
        vid.pause();
      }
    });

    const video = videoRefs.current[videoId];
    if (video) {
      if (video.paused) {
        video.play();
        setPlayingVideoId(videoId);
      } else {
        video.pause();
      }
    }
  };

  // Get the video URL from either video_path or videoPath field
  const getVideoUrl = (testimonial: ClientTestimonial): string => {
    return (testimonial.video_path || testimonial.videoPath) || "";
  };

  // Get the client image from either client_image or clientImage field
  const getClientImage = (testimonial: ClientTestimonial): string => {
    return (testimonial.client_image || testimonial.clientImage) || "";
  };

  return (
    <section className="py-20 md:py-32 px-4 md:px-6 bg-white">
      <div className="max-w-full">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Happy Clients
          </h2>
          <div className="w-24 h-1 bg-brand-red mx-auto"></div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading testimonials...</p>
          </div>
        )}

        {/* Horizontal Scrolling Gallery */}
        {!loading && testimonials.length > 0 && (
          <div className="relative">
            <div
              ref={scrollContainerRef}
              id="happy-clients-scroll"
              className="flex gap-4 overflow-x-auto scroll-smooth px-4 md:px-0"
              style={{ scrollBehavior: "smooth", scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {testimonials.map((client) => {
                const videoUrl = getVideoUrl(client);
                const clientImage = getClientImage(client);

                return (
                  <div
                    key={client.id}
                    className="flex-shrink-0 w-64 md:w-80 h-80 md:h-96 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group bg-gray-900 cursor-pointer relative"
                  >
                    {/* Video */}
                    <video
                      ref={(el) => {
                        if (el) videoRefs.current[client.id] = el;
                      }}
                      src={videoUrl}
                      className="absolute inset-0 w-full h-full object-cover"
                      autoPlay={client.id === testimonials[0]?.id}
                      onClick={() => toggleVideoPlay(client.id)}
                      onPlay={() => setPlayingVideoId(client.id)}
                      onPause={() => setPlayingVideoId(null)}
                    />

                    {/* Dark Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300" />

                    {/* Play/Pause Button — always visible, gray */}
                    <div
                      className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
                      onClick={() => toggleVideoPlay(client.id)}
                    >
                      <div className="bg-gray-600 hover:bg-gray-700 p-4 rounded-full shadow-xl transition-all transform hover:scale-125">
                        {playingVideoId === client.id ? (
                          <Pause className="w-6 h-6 text-white fill-white" />
                        ) : (
                          <Play className="w-6 h-6 text-white fill-white" />
                        )}
                      </div>
                    </div>

                    {/* Client Info Overlay — visible on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <h3 className="font-bold text-white text-lg">{client.name}</h3>
                      <p className="text-sm text-white/90">{client.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={() => scroll("left")}
              className="absolute -left-6 md:left-0 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full bg-brand-red hover:bg-red-700 text-white shadow-lg transition-all hover:scale-110 flex items-center justify-center"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <button
              onClick={() => scroll("right")}
              className="absolute -right-6 md:right-0 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full bg-brand-red hover:bg-red-700 text-white shadow-lg transition-all hover:scale-110 flex items-center justify-center"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-16 max-w-7xl mx-auto">
          <p className="text-gray-600 mb-4 text-lg">Ready to transform your space?</p>
          <a
            href="https://wa.me/9851350892?text=Hi! I saw the testimonials on your website and I'm interested in learning more about Parbati Interior's services."
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all hover:shadow-lg"
          >
            Contact Us on WhatsApp
          </a>
        </div>
      </div>

      <style>{`
        #happy-clients-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
