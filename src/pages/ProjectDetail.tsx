import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useOutletContext } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { transformDriveUrl } from "../utils/driveHelper";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setIsBookingModalOpen } = useOutletContext<{ setIsBookingModalOpen: (open: boolean) => void }>();

  const [project, setProject] = useState<any>(null);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const projects = await response.json();
          setAllProjects(projects);
          
          const found = projects.find((p: any) => p.id === id);
          
          if (found) {
            setProject(found);
            document.title = `${found.title} | Parbati Interior`;
          } else {
            navigate("/projects");
          }
        }
      } catch (error) {
        console.error("Error loading project:", error);
        navigate("/projects");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProject();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Project not found</p>
          <Link to="/projects" className="text-brand-red font-bold hover:underline">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const relatedProjects = allProjects
    .filter((p) => p.id !== project.id && p.category === project.category)
    .slice(0, 3);

  const heroImageUrl = project.mediaUrl ? transformDriveUrl(project.mediaUrl, "image") : "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="bg-white">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2 text-brand-red font-bold hover:text-red-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Projects
        </button>
      </div>

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative py-24 md:py-32 px-4 md:px-6 overflow-hidden">
        {/* Background Image */}
        <img
          src={heroImageUrl}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/75 to-gray-900/70" />

        {/* Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Category Label */}
          <span className="text-sm font-bold tracking-widest text-yellow-600 uppercase mb-4 inline-block">
            {project.category}
          </span>

          {/* Heading */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-8">
            {project.title}
          </h1>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="inline-flex items-center px-8 py-3 bg-brand-red hover:bg-red-700 text-white font-bold text-sm uppercase tracking-wide rounded-lg transition-all hover:shadow-lg hover:translate-y-[-2px]"
            >
              Book Similar
            </button>
            <a
              href="https://wa.me/919851350892?text=Hi! I'm interested in a project like this one on your website."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-bold text-sm uppercase tracking-wide rounded-lg hover:bg-white hover:text-gray-900 transition-all"
            >
              Message on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ============================================
          PROJECT DETAILS SECTION
          ============================================ */}
      <section className="py-20 md:py-32 px-4 md:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Project Info */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold tracking-widest text-brand-red uppercase">
                  Details
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                  {project.title}
                </h2>
              </div>

              <p className="text-gray-700 text-base leading-relaxed">
                {project.description}
              </p>

              <div className="grid grid-cols-2 gap-4 bg-white rounded-2xl p-6 border border-gray-200">
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Category</p>
                  <p className="text-sm font-semibold text-gray-900">{project.category}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Completed</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(project.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all hover:shadow-lg"
              >
                Start Your Project
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Right: Gallery Preview */}
            <div className="rounded-2xl overflow-hidden shadow-lg h-96">
              <img
                src={heroImageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          GALLERY SECTION
          ============================================ */}
      <section className="py-20 md:py-32 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-brand-red uppercase">Our Work</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">Gallery</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Project visuals
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow h-72 md:h-96">
              <img
                src={heroImageUrl}
                alt="Gallery 1"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>

            <div className="space-y-6">
              {[1, 2].map((idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow h-32"
                >
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 font-semibold">Gallery Image {idx}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery CTA */}
          <div className="text-center mt-12">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-brand-red text-brand-red font-bold rounded-lg hover:bg-red-50 transition-colors"
            >
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          RELATED PROJECTS SECTION
          ============================================ */}
      {relatedProjects.length > 0 && (
        <section className="py-20 md:py-32 px-4 md:px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-widest text-brand-red uppercase">Related</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">Similar Projects</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {project.category} projects
              </p>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((p) => (
                <Link
                  key={p.id}
                  to={`/projects/${p.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-brand-red hover:shadow-xl transition-all"
                >
                  <div className="relative overflow-hidden h-56 bg-gray-900">
                    <img
                      src={transformDriveUrl(p.mediaUrl, "image")}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 bg-brand-red text-white px-3 py-1 rounded-full text-xs font-bold">
                      {p.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-red transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{p.description}</p>
                    <div className="flex items-center gap-2 text-brand-red font-bold text-sm">
                      View Project
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          BOTTOM CTA SECTION
          ============================================ */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-gradient-to-r from-brand-red to-red-700">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Start Your Project</h2>
          <p className="text-lg text-white/90">
            Ready to transform your space?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-8 py-3 bg-white hover:bg-gray-100 text-brand-red font-bold rounded-lg transition-all shadow-lg"
            >
              Book Consultation
            </button>
            <a
              href="https://wa.me/919851350892"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all"
            >
              WhatsApp: 9851350892
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
