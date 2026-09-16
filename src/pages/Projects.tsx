import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Project } from "../types";
import { transformDriveUrl } from "../utils/driveHelper";
import { Filter, Eye, Play, Film, Image as ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "../admin/services/supabaseClient";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  // Set page title
  useEffect(() => {
    document.title = "Our Projects Showcase | Parbati Interior";
  }, []);

  // Fetch projects from Supabase directly
  useEffect(() => {
    async function loadProjects() {
      try {
        // Try Supabase first
        const { data: supabaseData, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && supabaseData && supabaseData.length > 0) {
          console.log('✅ Loaded projects from Supabase:', supabaseData.length);
          // Transform to legacy format
          const transformed = supabaseData.map((proj: any) => ({
            id: proj.id,
            slug: proj.slug || proj.id,
            title: proj.title,
            client: proj.client_name || '',
            category: proj.category,
            location: proj.location || '',
            date_label: proj.completion_date || '',
            cover: proj.media_urls?.[0]?.url || '',
            intro: proj.description,
            description: [proj.description],
            gallery: proj.media_urls?.map((m: any) => ({ id: m.cloudinary_id, url: m.url, caption: '' })) || [],
            details: [],
            testimonial: { name: '', role: '', content: '', rating: 5 },
            published: proj.status === 'Published',
            sort_order: 0,
            created_at: proj.created_at,
            updated_at: proj.updated_at
          }));
          setProjects(transformed);
          setLoading(false);
          return;
        }

        // Fallback to API
        const response = await fetch("/api/projects");
        if (response.ok) {
          const data = await response.json();
          console.log('📁 Loaded projects from API:', data.length);
          setProjects(data);
        } else {
          console.error("Failed to load projects from API");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();

    // Real-time subscription
    const subscription = supabase
      .channel('projects-public-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'projects' 
      }, () => {
        console.log('Projects updated, reloading...');
        loadProjects();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Supported Categories
  const categories = [
    "All",
    "Residential",
    "Modular Kitchen",
    "Commercial",
    "Custom Furniture",
    "General Construction"
  ];

  // Filter project lists
  const filteredProjects = projects.filter((proj) => {
    if (activeCategory === "All") return true;
    return proj.category.toLowerCase() === activeCategory.toLowerCase();
  });

  // Keyboard accessibility for Lightbox (arrow keys + Escape)
  useEffect(() => {
    // Navigation happens on detail page
  }, []);

  return (
    <div id="projects-page" className="min-h-screen bg-gray-50/50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-extrabold tracking-widest text-brand-red uppercase bg-red-50 px-3.5 py-1.5 rounded-md inline-block">
            Our Gallery
          </span>
          <h1 className="font-display text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Recent Completed Works
          </h1>
          <p className="text-gray-500 text-sm">
            A beautiful, filterable portfolio grid displaying our verified modular setups, civil structures, and wood-metal bespoke fabrications in Nepal.
          </p>
        </div>

        {/* Filter Navigation Bar */}
        <div id="category-filters" className="flex flex-wrap justify-center gap-2 mb-12 border-b border-gray-200/60 pb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-btn-${cat.toLowerCase().replace(" ", "-")}`}
              onClick={() => {
                setActiveCategory(cat);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-brand-red text-white shadow-md shadow-red-500/10 scale-105"
                  : "bg-white border border-gray-200 text-gray-600 hover:text-brand-red hover:border-brand-red"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="h-10 w-10 text-brand-red animate-spin" />
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading project files...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          /* EMPTY STATE */
          <div className="text-center py-20 bg-white border border-gray-200/60 rounded-3xl p-12 max-w-md mx-auto">
            <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-display font-bold text-lg text-gray-900 mb-1">No Projects Found</h3>
            <p className="text-xs text-gray-500">
              There are currently no projects listed under "{activeCategory}". Select another category or check back later!
            </p>
          </div>
        ) : (
          /* PORTFOLIO GRID */
          <div id="projects-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
            {filteredProjects.map((proj) => {
              return (
                <div
                  key={proj.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 group cursor-pointer hover:-translate-y-1"
                  style={{ cursor: 'pointer' }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      navigate(`/projects/${proj.id}`);
                    }
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Navigating to:', `/projects/${proj.id}`);
                    navigate(`/projects/${proj.id}`);
                  }}
                >
                  {/* Media Cover wrapper */}
                  <div className="relative h-64 sm:h-72 overflow-hidden bg-gray-950">
                    {/* Media element */}
                    {(proj as any).mediaType === "video" ? (
                      <div className="relative w-full h-full">
                        {/* Static cover image fallback */}
                        <img
                          src={(proj as any).mediaUrl.includes("drive.google.com") ? "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80" : transformDriveUrl((proj as any).mediaUrl, "image")}
                          alt={proj.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                          loading="lazy"
                        />
                        {/* Film Indicator */}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="bg-white/90 text-brand-red p-3.5 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Play className="h-5 w-5 fill-brand-red" />
                          </div>
                        </div>
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xs py-1 px-2.5 rounded-md text-[10px] font-extrabold text-white flex items-center space-x-1.5">
                          <Film className="h-3 w-3" />
                          <span>VIDEO</span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        <img
                          src={transformDriveUrl((proj as any).mediaUrl, "image")}
                          alt={proj.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xs py-1 px-2.5 rounded-md text-[10px] font-extrabold text-white flex items-center space-x-1.5">
                          <ImageIcon className="h-3 w-3" />
                          <span>IMAGE</span>
                        </div>
                      </div>
                    )}

                    {/* Hover detail trigger block */}
                    <div className="absolute inset-0 bg-linear-to-t from-gray-950/80 via-gray-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <div className="text-white space-y-1">
                        <span className="inline-block text-[10px] font-bold tracking-widest text-brand-red uppercase bg-red-500/20 backdrop-blur-md px-2 py-0.5 rounded-sm border border-red-500/30">
                          {proj.category}
                        </span>
                        <h4 className="font-display font-bold text-base leading-snug">
                          {proj.title}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Text descriptions beneath card */}
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-brand-red uppercase tracking-wider">
                        {proj.category}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {new Date((proj as any).createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-brand-red transition-colors line-clamp-1">
                      {proj.title}
                    </h3>
                    
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {(proj as any).description}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-gray-50 text-xs font-bold text-gray-600 group-hover:text-brand-red transition-colors">
                      <span>View details</span>
                      <Eye className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
