import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Filter } from "lucide-react";
import { posts, categories } from "../data/blogPosts";

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    document.title = "Blog | Parbati Interior Pvt. Ltd.";
  }, []);

  const filteredPosts = posts.filter((p) => activeCategory === "All" || p.category === activeCategory);

  return (
    <div id="blog-page" className="min-h-screen bg-gray-50/50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-extrabold tracking-widest text-brand-red uppercase bg-red-50 px-3.5 py-1.5 rounded-md inline-block">
            Our Blog
          </span>
          <h1 className="font-display text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Tips, Updates &amp; Behind The Scenes
          </h1>
          <p className="text-gray-500 text-sm">
            Practical advice on interiors and construction, plus news from our studio and workshop in Kathmandu.
          </p>
        </div>

        {/* Category Filter Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-gray-200/60 pb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
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

        {/* Empty state */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-200/60 rounded-3xl p-12 max-w-md mx-auto">
            <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-display font-bold text-lg text-gray-900 mb-1">No Articles Found</h3>
            <p className="text-xs text-gray-500">
              There are currently no posts under "{activeCategory}". Select another category to keep browsing.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs py-1 px-2.5 rounded-md text-[10px] font-extrabold text-white uppercase tracking-wide">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-brand-red transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-gray-50 text-xs font-bold text-gray-600 group-hover:text-brand-red transition-colors">
                    <span>Read article</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
