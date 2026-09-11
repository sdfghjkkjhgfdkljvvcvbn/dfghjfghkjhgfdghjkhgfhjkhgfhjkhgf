import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Loader2, Eye } from "lucide-react";
import { HeroSlide } from "../../types";
import { heroSlidesService } from "../../utils/supabase";

export default function HeroSliderTab() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    image_url: "",
    title: "",
    description: "",
  });

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    setLoading(true);
    try {
      const { data, error } = await heroSlidesService.fetchAllAdmin();
      if (error) {
        console.warn("Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env", error);
        setSlides([]);
      } else {
        setSlides(data || []);
      }
    } catch (err) {
      console.warn("Error loading slides:", err);
      setSlides([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdate = async () => {
    if (!formData.image_url.trim()) {
      alert("Please fill in the image URL");
      return;
    }

    try {
      if (editingId) {
        const { error } = await heroSlidesService.update(editingId, formData);
        if (error) {
          console.warn("Could not update slide. Supabase not configured.", error);
          return;
        }
        setSlides((prev) =>
          prev.map((s) => (s.id === editingId ? { ...s, ...formData } : s))
        );
      } else {
        const { data, error } = await heroSlidesService.create({
          ...formData,
          sort_order: slides.length,
          active: true,
        });
        if (error) {
          console.warn("Could not create slide. Supabase not configured.", error);
          return;
        }
        setSlides([...slides, data[0]]);
      }

      setFormData({ image_url: "", title: "", description: "" });
      setIsAddingNew(false);
      setEditingId(null);
    } catch (err) {
      console.warn("Error saving slide:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this slide?")) return;

    try {
      const { error } = await heroSlidesService.delete(id);
      if (error) {
        console.warn("Could not delete slide. Supabase not configured.", error);
        return;
      }
      setSlides((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.warn("Error deleting slide:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add New Button */}
      <button
        onClick={() => {
          setIsAddingNew(!isAddingNew);
          setFormData({ image_url: "", title: "", description: "" });
        }}
        className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        <Plus className="h-5 w-5" />
        Add New Slide
      </button>

      {/* Add/Edit Form */}
      {(isAddingNew || editingId) && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
          <h3 className="font-bold text-lg">{editingId ? "Edit Slide" : "New Slide"}</h3>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Slide title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Slide description"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddOrUpdate}
              className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-colors font-bold"
            >
              {editingId ? "Update" : "Add"} Slide
            </button>
            <button
              onClick={() => {
                setIsAddingNew(false);
                setEditingId(null);
                setFormData({ image_url: "", title: "", description: "" });
              }}
              className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Slides List */}
      <div className="space-y-3">
        {slides.map((slide) => (
          <div key={slide.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-brand-red transition-colors">
            <div className="flex items-center gap-4 flex-1">
              <img
                src={slide.image_url}
                alt={slide.title}
                className="h-20 w-32 object-cover rounded-lg"
              />
              <div>
                <h4 className="font-bold text-gray-900">{slide.title || "Untitled"}</h4>
                <p className="text-sm text-gray-600">{slide.description?.substring(0, 60)}...</p>
                <p className="text-xs text-gray-500 mt-1">{slide.active ? "✓ Active" : "Inactive"}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingId(slide.id);
                  setFormData({
                    image_url: slide.image_url,
                    title: slide.title,
                    description: slide.description,
                  });
                }}
                className="p-2 hover:bg-blue-100 rounded transition-colors"
              >
                <Edit2 className="h-5 w-5 text-blue-600" />
              </button>
              <button
                onClick={() => handleDelete(slide.id)}
                className="p-2 hover:bg-red-100 rounded transition-colors"
              >
                <Trash2 className="h-5 w-5 text-red-600" />
              </button>
            </div>
          </div>
        ))}

        {slides.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <p>No slides yet. Create your first hero slide!</p>
          </div>
        )}
      </div>
    </div>
  );
}
