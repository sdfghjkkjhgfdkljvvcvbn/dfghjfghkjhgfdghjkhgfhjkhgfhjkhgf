import { servicesService, happyClientsService, blogService } from '../admin/services/supabaseClient';

// Public-facing data service that fetches from Supabase for the home page
export const dataService = {
  // Fetch all active services for home page
  async getActiveServices() {
    try {
      const services = await servicesService.getAll();
      return services.filter((s: any) => s.is_active !== false);
    } catch (error) {
      console.error('Error fetching services for home:', error);
      return [];
    }
  },

  // Fetch published blog posts
  async getPublishedBlogs() {
    try {
      const blogs = await blogService.getAll();
      return blogs.filter((b: any) => b.status === 'Published');
    } catch (error) {
      console.error('Error fetching blogs for home:', error);
      return [];
    }
  },

  // Fetch happy clients
  async getHappyClients() {
    try {
      return await happyClientsService.getAll();
    } catch (error) {
      console.error('Error fetching happy clients:', error);
      return [];
    }
  },

  // Subscribe to real-time updates for services
  subscribeToServices(callback: (data: any) => void) {
    return servicesService.subscribe(callback);
  },

  // Subscribe to real-time updates for blogs
  subscribeToBlogs(callback: (data: any) => void) {
    return blogService.subscribe(callback);
  },

  // Subscribe to real-time updates for happy clients
  subscribeToHappyClients(callback: (data: any) => void) {
    return happyClientsService.subscribe(callback);
  },
};
