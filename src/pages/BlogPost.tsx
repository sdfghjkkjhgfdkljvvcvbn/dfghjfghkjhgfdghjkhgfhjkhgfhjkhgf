import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Calendar, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { blogService } from "../utils/supabase";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  created_at: string;
  cover_image?: string;
  author?: string;
}

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadBlogPost();
  }, [id]);

  const loadBlogPost = async () => {
    try {
      setLoading(true);
      
      // Fetch all posts to find the one with matching ID
      const { data, error } = await blogService.fetchAll(true);
      
      if (error) {
        console.error('Error loading blog post:', error);
        setNotFound(true);
        return;
      }

      const foundPost = data?.find((p: BlogPost) => p.id === id);
      
      if (!foundPost) {
        setNotFound(true);
        return;
      }

      setPost(foundPost);
      document.title = `${foundPost.title} | Parbati Interior Pvt. Ltd.`;
      window.scrollTo(0, 0);

      // Find related posts (same category, different post)
      const relatedPosts = (data || [])
        .filter((p: BlogPost) => p.category === foundPost.category && p.id !== foundPost.id)
        .slice(0, 3);
      setRelated(relatedPosts);
    } catch (error) {
      console.error('Error loading blog post:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div id="blog-post-page" className="min-h-screen bg-gray-50/50 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading article...</p>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div id="blog-post-page" className="min-h-screen bg-gray-50/50 py-16">
      {/* Shared Article Container */}
      <div style={{ width: 'min(92vw, 1200px)', margin: '0 auto' }} className="px-0">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-brand-red transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Hero Image */}
        <div className="relative h-64 sm:h-96 rounded-3xl overflow-hidden bg-gray-950 mb-8 shadow-xl w-full">
          {post.cover_image && (
            <img
              src={post.cover_image}
              alt={post.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-90"
            />
          )}
          <span className="absolute bottom-4 left-4 bg-brand-red text-white text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-md">
            {post.category}
          </span>
        </div>

        {/* Article Metadata */}
        <div className="flex items-center gap-4 text-xs text-gray-400 font-semibold mb-6">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            5 min read
          </span>
        </div>

        {/* Article Title */}
        <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-8 text-left">
          {post.title}
        </h1>

        {/* Article Content */}
        <div className="space-y-6 mb-12">
          {post.content && typeof post.content === 'string' ? (
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              {post.content}
            </p>
          ) : Array.isArray(post.content) ? (
            post.content.map((para, i) => (
              <p key={i} className="text-base sm:text-lg text-gray-600 leading-relaxed">
                {para}
              </p>
            ))
          ) : (
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="pt-8 border-t border-gray-200/60 mb-16">
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
          >
            Book a Free Consultation
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="border-t border-gray-200/60 pt-10">
            <h2 className="font-display text-lg font-bold text-gray-900 mb-6">More in {post.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/blog/${r.id}`}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className="h-32 overflow-hidden bg-gray-200">
                    {r.cover_image && (
                      <img
                        src={r.cover_image}
                        alt={r.title}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-sm font-bold text-gray-900 group-hover:text-brand-red transition-colors leading-snug line-clamp-2">
                      {r.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
