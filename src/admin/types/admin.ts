// Admin user types
export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'Admin' | 'Content_Editor' | 'Enquiry_Manager' | 'Viewer';
  status: 'Active' | 'Inactive' | 'Invited';
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
  expiresAt: string;
}

// Enquiry types
export interface Enquiry {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  service_type: string;
  room_type?: string;
  budget_range?: string;
  project_description: string;
  status: 'New' | 'Contacted' | 'In_Progress' | 'Closed';
  contacted_by?: string;
  contacted_at?: string;
  source: 'website' | 'whatsapp' | 'referral';
  created_at: string;
  updated_at: string;
  archived_at?: string;
  tags?: string[];
}

// Project types
export interface Project {
  id: string;
  title: string;
  slug: string;
  category: 'Residential' | 'Modular_Kitchen' | 'Commercial' | 'Custom_Furniture' | 'Construction';
  description: string;
  client_name: string;
  location: string;
  completion_date: string;
  budget_range?: string;
  media_urls: Array<{
    url: string;
    cloudinary_id: string;
    type: 'image' | 'video';
  }>;
  room_types: string[];
  is_featured: boolean;
  status: 'Draft' | 'Published';
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Blog types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: 'Design_Tip' | 'Case_Study' | 'Industry_Insight' | 'Tutorial';
  content: string;
  excerpt: string;
  featured_image_url: string;
  cloudinary_id: string;
  author: string;
  status: 'Draft' | 'Published' | 'Scheduled';
  published_date?: string;
  scheduled_publish_date?: string;
  view_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Service types
export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  featured_image_url: string;
  cloudinary_id: string;
  icon_emoji?: string;
  display_order: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Package types
export interface Package {
  id: string;
  service_id: string;
  name: string;
  description: string;
  price: number;
  currency: 'NPR' | 'USD';
  features: Array<{
    description: string;
  }>;
  delivery_timeline_days: number;
  display_order: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Hero Slide types
export interface HeroSlide {
  id: string;
  headline: string;
  subheading: string;
  button_text?: string;
  button_link?: string;
  image_url: string;
  cloudinary_id: string;
  status: 'Draft' | 'Published' | 'Scheduled';
  scheduled_publish_date?: string;
  display_order: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Gallery types
export interface GalleryImage {
  id: string;
  room_type: 'Bedroom' | 'Living_Room' | 'Kitchen' | 'Bathroom' | 'Office' | 'Commercial';
  title: string;
  description: string;
  image_url: string;
  cloudinary_id: string;
  before_image_url?: string;
  before_cloudinary_id?: string;
  is_before_after: boolean;
  project_reference?: string;
  display_order: number;
  status: 'Draft' | 'Published';
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Theme types
export interface ThemeConfig {
  id: string;
  config_type: 'Colors' | 'Fonts' | 'CustomCSS';
  preset_name?: string;
  config_data: Record<string, any>;
  custom_css?: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
