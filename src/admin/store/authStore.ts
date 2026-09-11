import { create } from 'zustand';
import { AdminUser, AuthState, LoginCredentials } from '../types/admin';

interface AuthStoreState extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AdminUser | null) => void;
  setError: (error: string | null) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement Supabase login
      // For now, mock implementation
      const mockUser: AdminUser = {
        id: '1',
        email: credentials.email,
        full_name: 'Admin User',
        role: 'Admin',
        status: 'Active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      localStorage.setItem('admin_token', 'mock-token');
      localStorage.setItem('admin_user', JSON.stringify(mockUser));

      set({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  setUser: (user: AdminUser | null) => {
    set({
      user,
      isAuthenticated: !!user,
    });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const userStr = localStorage.getItem('admin_user');

      if (token && userStr) {
        const user = JSON.parse(userStr) as AdminUser;
        set({
          user,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },
}));
