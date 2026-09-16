import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play, X, ChevronLeft, ChevronRight, ArrowRight, Film } from "lucide-react";
import { LegacyProject } from "../types";
import { transformDriveUrl } from "../utils/driveHelper";

export default function WatchOurWork() {
  const [videos, setVideos] = useState<LegacyProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    async function loadVideos() {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const data: LegacyProject[] = await response.json();
          setVideos(data.filter((p) => p.mediaType === "video"));
        }
      } catch (error) {
        console.error("Error fetching project videos:", error);
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, []);

  const handleNext = () => {
    if (selectedIdx === null) return;
    setSelectedIdx((prev) => (prev! === videos.length - 1 ? 0 : prev! + 1));
  };
  const handlePrev = () => {
    if (selectedIdx === null) return;
    setSelectedIdx((prev) => (prev! === 0 ? videos.length - 1 : prev! - 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === "Escape") setSelectedIdx(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdx, videos.length]);

  const activeVideo = selectedIdx !== null ? videos[selectedIdx] : null;

  // Nothing to show yet (no videos uploaded via Admin) — skip rendering rather than showing an empty section.
  if (!loading && videos.length === 0) return null;

  return (
    <section id="watch-our-work" className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <span className="text-xs font-extrabold tracking-widest text-brand-red uppercase block mb-2">
              Real Projects, Real Footage
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Watch Our Work
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mt-2">
              Short video walkthroughs from actual sites we've completed across the Kathmandu Valley.
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-red-500/10 shrink-0"
          >
            View Full Gallery
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>

        {loading ? (
          <div className="h-64 rounded-2xl bg-white/5 animate-pulse" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.slice(0, 3).map((video, idx) => {
              const coverUrl = video.mediaUrl.includes("drive.google.com")
                ? "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80"
                : transformDriveUrl(video.mediaUrl, "image");

              return (
                <div
                  key={video.id}
                  onClick={() => setSelectedIdx(idx)}
                  className="relative rounded-2xl overflow-hidden border border-white/10 cursor-pointer group h-72 bg-gray-900"
                >
                  <img
                    src={coverUrl}
                    alt={video.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 text-brand-red p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Play className="h-6 w-6 fill-brand-red" />
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xs py-1 px-2.5 rounded-md text-[10px] font-extrabold text-white flex items-center gap-1.5">
                    <Film className="h-3 w-3" />
                    <span>VIDEO</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold tracking-widest text-brand-red uppercase">
                      {video.category}
                    </span>
                    <h4 className="font-display font-bold text-base leading-snug line-clamp-2">
                      {video.title}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox video player */}
      {activeVideo && (
        <div
          onClick={() => setSelectedIdx(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lightbox-overlay animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-black rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl border border-white/10 animate-fade-in-up"
          >
            <button
              onClick={() => setSelectedIdx(null)}
              className="absolute top-4 right-4 z-10 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {activeVideo.mediaUrl.includes("drive.google.com") && activeVideo.mediaUrl.includes("/preview") ? (
              <iframe
                src={activeVideo.mediaUrl}
                className="w-full aspect-video border-0 bg-transparent"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={activeVideo.title}
              />
            ) : (
              <video
                src={transformDriveUrl(activeVideo.mediaUrl, "video")}
                controls
                autoPlay
                playsInline
                className="w-full max-h-[80vh] object-contain"
              />
            )}

            {videos.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2.5 rounded-full border border-white/20 hover:scale-105 transition-all focus:outline-hidden"
                  aria-label="Previous video"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2.5 rounded-full border border-white/20 hover:scale-105 transition-all focus:outline-hidden"
                  aria-label="Next video"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <div className="p-6 bg-gray-950 text-white">
              <span className="text-xs font-bold text-brand-red uppercase tracking-wider">{activeVideo.category}</span>
              <h3 className="font-display text-lg font-bold mt-1">{activeVideo.title}</h3>
              <p className="text-sm text-gray-400 mt-2 leading-relaxed">{activeVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
