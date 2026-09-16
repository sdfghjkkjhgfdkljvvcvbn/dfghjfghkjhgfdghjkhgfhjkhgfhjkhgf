import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Filter } from "lucide-react";
import { blogService } from "../utils/supabase";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  created_at: string;
  content?: string;
  author?: string;
  status?: string;
  cover_image?: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    document.title = "Blog | Parbati Interior Pvt. Ltd.";
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await blogService.fetchAll(true);
      
      if (error) {
        console.error('Error loading blog posts:', error);
        return;
      }

      setPosts(data || []);

      // Extract unique categories
      const uniqueCategories = Array.from(new Set((data || []).map((p: BlogPost) => p.category)));
      setCategories(["All", ...uniqueCategories]);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

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

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading blog posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
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
                <div className="relative h-56 overflow-hidden bg-gray-200">
                  {post.cover_image ? (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <p className="text-gray-500 text-sm font-light text-center px-4 line-clamp-3">{post.title}</p>
                    </div>
                  )}
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs py-1 px-2.5 rounded-md text-[10px] font-extrabold text-white uppercase tracking-wide">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      5 min read
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-brand-red transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {post.excerpt || "No description available"}
                  </p>

                  <div className="pt-3 flex items-center justify-between border-t border-gray-50 text-xs font-bold text-gray-600 group-hover:text-brand-red transition-colors -mx-6 px-6 py-3">
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
