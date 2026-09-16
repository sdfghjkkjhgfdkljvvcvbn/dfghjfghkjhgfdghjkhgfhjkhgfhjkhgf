import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not found in .env. Using placeholder values.');
}

// Initialize Supabase client - will work once credentials are added
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);

// ============================================
// BOOKINGS QUERIES
// ============================================
export const bookingsService = {
  async fetchAll(status?: string) {
    let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    return query;
  },

  async create(data: any) {
    return supabase.from('bookings').insert([data]).select();
  },

  async update(id: string, data: any) {
    return supabase.from('bookings').update(data).eq('id', id).select();
  },

  async delete(id: string) {
    return supabase.from('bookings').delete().eq('id', id);
  },
};

// ============================================
// HERO SLIDES QUERIES
// ============================================
export const heroSlidesService = {
  async fetchAll() {
    return supabase.from('hero_slides').select('*').eq('active', true).order('sort_order', { ascending: true });
  },

  async fetchAllAdmin() {
    return supabase.from('hero_slides').select('*').order('sort_order', { ascending: true });
  },

  async create(data: any) {
    return supabase.from('hero_slides').insert([data]).select();
  },

  async update(id: string, data: any) {
    return supabase.from('hero_slides').update(data).eq('id', id).select();
  },

  async delete(id: string) {
    return supabase.from('hero_slides').delete().eq('id', id);
  },
};

// ============================================
// SERVICES QUERIES
// ============================================
export const servicesService = {
  async fetchAll() {
    return supabase.from('services').select('*').order('sort_order', { ascending: true });
  },

  async fetchBySlug(slug: string) {
    return supabase.from('services').select('*').eq('slug', slug).single();
  },

  async create(data: any) {
    return supabase.from('services').insert([data]).select();
  },

  async update(id: string, data: any) {
    return supabase.from('services').update(data).eq('id', id).select();
  },

  async delete(id: string) {
    return supabase.from('services').delete().eq('id', id);
  },
};

// ============================================
// PROJECTS QUERIES
// ============================================
export const projectsService = {
  async fetchAll(published = true) {
    let query = supabase.from('projects').select('*');
    if (published) query = query.eq('published', true);
    return query.order('sort_order', { ascending: true });
  },

  async fetchBySlug(slug: string) {
    return supabase.from('projects').select('*').eq('slug', slug).eq('published', true).single();
  },

  async create(data: any) {
    return supabase.from('projects').insert([data]).select();
  },

  async update(id: string, data: any) {
    return supabase.from('projects').update(data).eq('id', id).select();
  },

  async delete(id: string) {
    return supabase.from('projects').delete().eq('id', id);
  },
};

// ============================================
// BLOG POSTS QUERIES
// ============================================
export const blogService = {
  async fetchAll(publishedOnly = true) {
    let query = supabase.from('blog_posts').select('*');
    if (publishedOnly) query = query.eq('status', 'Published');
    return query.order('created_at', { ascending: false });
  },

  async fetchById(id: string) {
    return supabase.from('blog_posts').select('*').eq('id', id).eq('status', 'Published').single();
  },

  async create(data: any) {
    return supabase.from('blog_posts').insert([data]).select();
  },

  async update(id: string, data: any) {
    return supabase.from('blog_posts').update(data).eq('id', id).select();
  },

  async delete(id: string) {
    return supabase.from('blog_posts').delete().eq('id', id);
  },
};

// ============================================
// GALLERY QUERIES
// ============================================
export const galleryService = {
  async fetchAll() {
    return supabase.from('gallery_images').select('*').order('sort_order', { ascending: true });
  },

  async fetchByCategory(category: string) {
    return supabase.from('gallery_images').select('*').eq('category', category).order('sort_order', { ascending: true });
  },

  async create(data: any) {
    return supabase.from('gallery_images').insert([data]).select();
  },

  async update(id: string, data: any) {
    return supabase.from('gallery_images').update(data).eq('id', id).select();
  },

  async delete(id: string) {
    return supabase.from('gallery_images').delete().eq('id', id);
  },
};

// ============================================
// SITE SETTINGS QUERIES
// ============================================
export const settingsService = {
  async fetch(key: string) {
    return supabase.from('site_settings').select('*').eq('key', key).single();
  },

  async update(key: string, value: any) {
    return supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() }).select();
  },
};
