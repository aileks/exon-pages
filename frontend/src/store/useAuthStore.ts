import { create } from 'zustand';
import apiClient from '@/lib/apiClient';

interface User {
  id: number;
  username: string;
  email: string;
}

interface ApiError {
  status?: number;
  data?: {
    error?: string;
    message?: string;
  };
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  getUser: () => Promise<boolean>;
  clearError: () => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

const useAuthStore = create<AuthStore>()(set => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  setLoading: isLoading => set({ isLoading }),
  setError: error => set({ error }),
  clearError: () => set({ error: null }),

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      const user = await apiClient.post<User>('/api/auth/login', { email, password });

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      const error = err as Error & ApiError;
      set({
        error: error.data?.error || 'Login failed',
        isLoading: false,
      });
      throw err;
    }
  },

  register: async (username, email, password, confirmPassword) => {
    try {
      set({ isLoading: true, error: null });

      const user = await apiClient.post<User>('/api/auth/register', {
        username,
        email,
        password,
        confirmPassword,
      });

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      const error = err as Error & ApiError;
      set({
        error: error.data?.error || 'Registration failed',
        isLoading: false,
      });
      throw err;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });

      await apiClient.delete('/api/auth/logout');

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (err) {
      const error = err as Error & ApiError;
      set({
        error: error.data?.error || 'Logout failed',
        isLoading: false,
        user: null,
        isAuthenticated: false,
      });
    }
  },

  getUser: async () => {
    try {
      set({ isLoading: true });

      const user = await apiClient.get<User>('/api/auth/me');

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (_) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return false;
    }
  },
}));

export default useAuthStore;
