import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

interface ClientVideo {
  id: number;
  videoPath: string;
  name: string;
  title: string;
  image: string;
}

const clientVideos: ClientVideo[] = [
  {
    id: 1,
    videoPath: "/video/our happy client/1.mp4",
    name: "Garima",
    title: "Homeowner - Living Room Transformation",
    image: "/reviewers/garima.jpg",
  },
  {
    id: 2,
    videoPath: "/video/our happy client/2.mp4",
    name: "Harshit",
    title: "Interior Design Client - Office Space",
    image: "/reviewers/harshit-bgremoved.png",
  },
  {
    id: 3,
    videoPath: "/video/our happy client/3.mp4",
    name: "Ranjana",
    title: "Kitchen Renovation Client",
    image: "/reviewers/ranjana.jpeg",
  },
  {
    id: 4,
    videoPath: "/video/our happy client/4.mp4",
    name: "Siddharth",
    title: "Bedroom Design Client",
    image: "/reviewers/siddharth.png",
  },
];

export default function HappyClientsSection() {
  const [playingVideoId, setPlayingVideoId] = useState<number>(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const toggleVideoPlay = (videoId: number) => {
    // Pause all other videos
    Object.keys(videoRefs.current).forEach((id) => {
      const vid = videoRefs.current[parseInt(id)];
      if (vid && parseInt(id) !== videoId) {
        vid.pause();
      }
    });

    // Toggle the clicked video
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

  return (
    <section className="py-20 md:py-32 px-4 md:px-6" style={{ backgroundColor: "rgba(220, 38, 38, 0.08)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-brand-red uppercase">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
            Our Happy Clients
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from our satisfied clients about their transformation journey with Parbati Interior
          </p>
        </div>

        {/* Videos Carousel */}
        <div className="relative">
          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            id="happy-clients-scroll"
            className="flex gap-6 overflow-x-auto scroll-smooth"
            style={{ scrollBehavior: "smooth", scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {clientVideos.map((client) => (
              <div
                key={client.id}
                className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              >
                {/* Video Container */}
                <div className="relative w-full h-80 bg-gray-900 group cursor-pointer">
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current[client.id] = el;
                    }}
                    src={client.videoPath}
                    className="w-full h-full object-cover"
                    autoPlay={client.id === 1}
                    onClick={() => toggleVideoPlay(client.id)}
                  />

                  {/* Play/Pause Button Overlay — always visible */}
                  <div 
                    className="absolute inset-0 bg-black/10 flex items-center justify-center cursor-pointer"
                    onClick={() => toggleVideoPlay(client.id)}
                  >
                    <div className="bg-gray-600 hover:bg-gray-700 p-4 rounded-full shadow-lg transition-all transform hover:scale-110">
                      {playingVideoId === client.id ? (
                        <Pause className="w-6 h-6 text-white fill-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white fill-white" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Client Info */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={client.image}
                      alt={client.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-brand-red"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{client.name}</h3>
                      <p className="text-xs text-gray-500">{client.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-6 z-10 p-3 rounded-full bg-brand-red hover:bg-red-700 text-white shadow-lg transition-all hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-6 z-10 p-3 rounded-full bg-brand-red hover:bg-red-700 text-white shadow-lg transition-all hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
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
