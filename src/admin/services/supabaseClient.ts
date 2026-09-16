import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'your-anon-key';

// Log environment check
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  console.error('⚠️ CRITICAL: Supabase environment variables are not set. Check .env file.');
}

// Single Supabase client instance - reused across the entire app
// This is the ONLY client instance that should be used across the admin panel
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to check if user is authenticated
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

// Helper to get current user ID
export const getCurrentUserId = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id || null;
};

// Project operations
export const projectsService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },

  async create(project: any) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  async update(id: string, project: any) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  // Real-time subscription
  subscribe(callback: (data: any) => void) {
    return supabase
      .channel('projects-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, (payload) => {
        callback(payload);
      })
      .subscribe();
  },
};

// Happy Clients operations
export const happyClientsService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('happy_clients')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching happy clients:', error);
      throw error;
    }
  },

  async getById(id: number) {
    try {
      const { data, error } = await supabase
        .from('happy_clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching happy client:', error);
      throw error;
    }
  },

  async create(client: any) {
    try {
      const { data, error } = await supabase
        .from('happy_clients')
        .insert([client])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating happy client:', error);
      throw error;
    }
  },

  async update(id: number, client: any) {
    try {
      const { data, error } = await supabase
        .from('happy_clients')
        .update(client)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating happy client:', error);
      throw error;
    }
  },

  async delete(id: number) {
    try {
      const { error } = await supabase
        .from('happy_clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting happy client:', error);
      throw error;
    }
  },

  // Real-time subscription
  subscribe(callback: (data: any) => void) {
    return supabase
      .channel('happy-clients-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'happy_clients' }, (payload) => {
        callback(payload);
      })
      .subscribe();
  },
};

// Enquiries operations
export const enquiriesService = {
  async getAll(filters?: any) {
    try {
      let query = supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      throw error;
    }
  },

  async create(enquiry: any) {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .insert([enquiry])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating enquiry:', error);
      throw error;
    }
  },

  async update(id: string, enquiry: any) {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .update(enquiry)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating enquiry:', error);
      throw error;
    }
  },

  // Real-time subscription for new enquiries
  subscribe(callback: (data: any) => void) {
    return supabase
      .channel('enquiries-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'enquiries' }, (payload) => {
        callback(payload);
      })
      .subscribe();
  },
};

// Blog operations
export const blogService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  },

  async create(post: any) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([post])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  },

  async update(id: string, post: any) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(post)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  },

  // Real-time subscription
  subscribe(callback: (data: any) => void) {
    return supabase
      .channel('blog-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, (payload) => {
        callback(payload);
      })
      .subscribe();
  },
};

// Gallery operations
export const galleryService = {
  async getByRoomType(roomType: string) {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('room_type', roomType)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      throw error;
    }
  },

  async getAll() {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all gallery images:', error);
      throw error;
    }
  },

  async create(image: any) {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .insert([image])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating gallery image:', error);
      throw error;
    }
  },

  async update(id: string, image: any) {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .update(image)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating gallery image:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      throw error;
    }
  },

  // Real-time subscription
  subscribe(callback: (data: any) => void) {
    return supabase
      .channel('gallery-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, (payload) => {
        callback(payload);
      })
      .subscribe();
  },
};

// Services operations
export const servicesService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  async create(service: any) {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([service])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },

  async update(id: string, service: any) {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(service)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  },

  // Real-time subscription
  subscribe(callback: (data: any) => void) {
    return supabase
      .channel('services-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, (payload) => {
        callback(payload);
      })
      .subscribe();
  },
};

// Packages operations
export const packagesService = {
  async getByService(serviceId: string) {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('service_id', serviceId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching packages:', error);
      throw error;
    }
  },

  async getAll() {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all packages:', error);
      throw error;
    }
  },

  async create(pkg: any) {
    try {
      const { data, error } = await supabase
        .from('packages')
        .insert([pkg])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating package:', error);
      throw error;
    }
  },

  async update(id: string, pkg: any) {
    try {
      const { data, error } = await supabase
        .from('packages')
        .update(pkg)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating package:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting package:', error);
      throw error;
    }
  },

  // Real-time subscription
  subscribe(callback: (data: any) => void) {
    return supabase
      .channel('packages-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'packages' }, (payload) => {
        callback(payload);
      })
      .subscribe();
  },
};
