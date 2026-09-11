import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Calendar, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { posts } from "../data/blogPosts";

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const post = posts.find((p) => p.id === id);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Parbati Interior Pvt. Ltd.`;
      window.scrollTo(0, 0);
    }
  }, [post]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const related = posts.filter((p) => p.category === post.category && p.id !== post.id).slice(0, 3);

  return (
    <div id="blog-post-page" className="min-h-screen bg-gray-50/50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-brand-red transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <div className="relative h-64 sm:h-96 rounded-3xl overflow-hidden bg-gray-950 mb-8 shadow-xl">
          <img
            src={post.coverImage}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-90"
          />
          <span className="absolute bottom-4 left-4 bg-brand-red text-white text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-md">
            {post.category}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400 font-semibold mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime}
          </span>
        </div>

        <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-6">
          {post.title}
        </h1>

        <div className="space-y-4 mb-10">
          {post.content.map((para, i) => (
            <p key={i} className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-200/60 mb-16">
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
          >
            Book a Free Consultation
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>

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
                  <div className="h-32 overflow-hidden">
                    <img
                      src={r.coverImage}
                      alt={r.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
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
