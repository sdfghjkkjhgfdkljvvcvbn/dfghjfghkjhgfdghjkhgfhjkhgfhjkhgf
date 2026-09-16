// ============================================
// BOOKINGS / ENQUIRIES
// ============================================
export interface Booking {
  id: string;
  name: string;
  phone: string;
  email?: string;
  event_date?: string;
  requirement: string;
  message?: string;
  notes?: string;
  source: string;
  status: "new" | "contacted" | "booked" | "closed";
  created_at: string;
  updated_at: string;
}

// ============================================
// SERVICES
// ============================================
export interface Service {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  features: string[];
  packages: ServicePackage[];
  gallery_category: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  popular?: boolean;
  features: string[];
}

// ============================================
// PROJECTS (PORTFOLIO)
// ============================================
export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  location: string;
  date_label: string;
  cover: string;
  intro: string;
  description: string[];
  gallery: GalleryItem[];
  details: ProjectDetail[];
  testimonial: ProjectTestimonial;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
}

export interface ProjectDetail {
  label: string;
  value: string;
}

export interface ProjectTestimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
}

// ============================================
// BLOG POSTS
// ============================================
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  category: string;
  author: string;
  date_label: string;
  read_time: string;
  content: string[];
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// GALLERY IMAGES
// ============================================
export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  category: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// HERO SLIDES
// ============================================
export interface HeroSlide {
  id: string;
  image_url: string;
  title: string;
  description: string;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// SITE SETTINGS
// ============================================
export interface SiteSettings {
  key: string;
  value: Record<string, any>;
  updated_at: string;
}

// ============================================
// USER ROLES
// ============================================
export interface UserRole {
  id: string;
  user_id: string;
  role: "admin" | "editor" | "viewer";
  created_at: string;
}

// ============================================
// LEGACY / LOCAL TYPES
// ============================================
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

// Legacy Project format for old admin pages
export interface LegacyProject {
  id: string;
  title: string;
  description: string;
  category: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  createdAt: string;
}
