import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  // State
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  getUser: () => Promise<void>;
  clearError: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

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
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: state => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
