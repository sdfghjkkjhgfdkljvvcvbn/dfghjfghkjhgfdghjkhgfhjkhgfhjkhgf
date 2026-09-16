import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Eye, Upload } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardBody, CardHeader, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { useUIStore } from '../store/uiStore';
import { blogService } from '../services/supabaseClient';
import { uploadToCloudinary } from '../services/cloudinaryService';

interface BlogPost {
  id: string;
  title: string;
  category?: string;
  excerpt?: string;
  content?: string;
  author?: string;
  status?: 'Draft' | 'Published' | 'Scheduled';
  published_date?: string;
  publishedDate?: string;
  created_at?: string;
  createdAt?: string;
}

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    excerpt: '',
    content: '',
    author: '',
    status: 'Draft' as 'Draft' | 'Published' | 'Scheduled',
    cover_image: '',
  });
  const { addNotification } = useUIStore();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await blogService.getAll();
      console.log('Loaded blog posts:', data);
      setPosts(data || []);
    } catch (error: any) {
      console.error('Error loading posts:', error);
      const errorMsg = error.message || 'Failed to load posts';
      addNotification({
        type: 'error',
        message: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Design Tip', 'Case Study', 'Industry Insight', 'Tutorial'];

  const handleAddPost = () => {
    setFormData({
      title: '',
      category: '',
      excerpt: '',
      content: '',
      author: '',
      status: 'Draft',
      cover_image: '',
    });
    setEditingPost(null);
    setShowForm(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setFormData({
      title: post.title || '',
      category: post.category || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      author: post.author || '',
      status: post.status || 'Draft',
      cover_image: (post as any).cover_image || '',
    });
    setEditingPost(post);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadToCloudinary(file, 'blog');
      setFormData({ ...formData, cover_image: imageUrl });
      addNotification({
        type: 'success',
        message: 'Image uploaded successfully',
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      addNotification({
        type: 'error',
        message: error.message || 'Failed to upload image',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSavePost = async () => {
    if (!formData.title.trim() || !formData.category.trim()) {
      addNotification({
        type: 'error',
        message: 'Title and category are required',
      });
      return;
    }

    try {
      if (editingPost) {
        await blogService.update(editingPost.id, {
          title: formData.title,
          category: formData.category,
          excerpt: formData.excerpt,
          content: formData.content,
          author: formData.author,
          status: formData.status,
          cover_image: formData.cover_image,
        });
        addNotification({
          type: 'success',
          message: 'Blog post updated',
        });
      } else {
        await blogService.create({
          id: Date.now().toString(),
          title: formData.title,
          category: formData.category,
          excerpt: formData.excerpt,
          content: formData.content,
          author: formData.author,
          status: formData.status,
          cover_image: formData.cover_image,
          created_at: new Date().toISOString(),
        });
        addNotification({
          type: 'success',
          message: 'Blog post created',
        });
      }
      setShowForm(false);
      await loadPosts();
    } catch (error: any) {
      console.error('Error saving post:', error);
      addNotification({
        type: 'error',
        message: 'Failed to save post',
      });
    }
  };

  const handleDeletePost = async (id: string) => {
    if (confirm('Delete this blog post?')) {
      try {
        await blogService.delete(id);
        addNotification({
          type: 'success',
          message: 'Blog post deleted',
        });
        await loadPosts();
      } catch (error: any) {
        console.error('Error deleting post:', error);
        addNotification({
          type: 'error',
          message: 'Failed to delete post',
        });
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
            <p className="text-gray-600 mt-2">Create and manage blog articles</p>
          </div>
          <Button variant="primary" size="md" className="gap-2" onClick={handleAddPost}>
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <Modal
            isOpen={showForm}
            onClose={() => setShowForm(false)}
            title={editingPost ? 'Edit Blog Post' : 'Add Blog Post'}
            size="lg"
            footer={
              <>
                <Button variant="secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSavePost}>
                  {editingPost ? 'Update' : 'Add'} Post
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <Input
                label="Title"
                placeholder="Blog post title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Category
                </label>
                <select
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Cover Image
                </label>
                <div className="space-y-2">
                  {formData.cover_image && (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border-2 border-gray-300 mb-2">
                      <img
                        src={formData.cover_image}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, cover_image: '' })}
                        className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <label className={`relative inline-flex items-center gap-2 px-4 py-2.5 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    uploading
                      ? 'border-gray-400 bg-gray-100'
                      : 'border-gray-300 hover:border-red-600 hover:bg-red-50'
                  }`}>
                    <Upload className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <Input
                label="Excerpt"
                placeholder="Short summary"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              />

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Content
                </label>
                <textarea
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 resize-vertical"
                  rows={5}
                  placeholder="Full blog content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>

              <Input
                label="Author"
                placeholder="Author name"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Status
                </label>
                <select
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Draft' | 'Published' | 'Scheduled' })}
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>
            </div>
          </Modal>
        )}

        {loading ? (
          <Card>
            <CardBody className="text-center py-12">
              <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading posts...</p>
            </CardBody>
          </Card>
        ) : posts.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-gray-600 mb-4">No blog posts yet. Create your first post!</p>
              <Button variant="primary" onClick={handleAddPost}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Post
              </Button>
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded">
                          {post.category}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          post.status === 'Published' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{post.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.excerpt}</p>
                      <p className="text-xs text-gray-500 mt-2">By {post.author}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => handleEditPost(post)}>
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeletePost(post.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
