import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

const API_BASE_URL = '/api';

let csrfToken: string | null = null;

const getCsrfToken = async (): Promise<string | null> => {
  if (csrfToken) return csrfToken;

  const res = await fetch(`${API_BASE_URL}/auth/csrf/restore`, {
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Failed to fetch CSRF token');

  const data = await res.json();
  csrfToken = data.csrf_token;

  return csrfToken;
};

const makeRequest = async <T>(endpoint: string, method: string = 'GET', data?: unknown): Promise<T> => {
  const options: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (method !== 'GET') {
    const token = await getCsrfToken();
    if (token) {
      options.headers = {
        ...options.headers,
        'X-CSRFToken': token,
      };
    }
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      data: errorData,
    };
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
};

// Auth service hooks
export function useAuth() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Get current user
  const {
    data: user,
    isLoading: isLoadingUser,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => makeRequest<User>('/auth/me'),
    retry: false,
    enabled: false, // Don't run automatically
    staleTime: Infinity, // Don't refetch automatically
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => makeRequest<User>('/auth/login', 'POST', credentials),
    onSuccess: data => {
      queryClient.setQueryData(['currentUser'], data);
      setError(null);
    },
    onError: (err: any) => {
      setError(err.data?.error || 'Login failed');
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => makeRequest<User>('/auth/register', 'POST', data),
    onSuccess: data => {
      queryClient.setQueryData(['currentUser'], data);
      setError(null);
    },
    onError: (err: any) => {
      setError(err.data?.error || 'Registration failed');
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => makeRequest<{ message: string }>('/auth/logout', 'DELETE'),
    onSuccess: () => {
      queryClient.setQueryData(['currentUser'], null);
      // Invalidate all queries when logging out
      queryClient.clear();
    },
    onError: (err: any) => {
      setError(err.data?.error || 'Logout failed');
      // Even on error, clear user data for security
      queryClient.setQueryData(['currentUser'], null);
    },
  });

  // Function to get current user
  const getCurrentUser = async () => {
    try {
      const result = await refetch();
      return !!result.data;
    } catch (_) {
      return false;
    }
  };

  // Function to login
  const login = async (email: string, password: string) => {
    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (error) {
      throw error;
    }
  };

  // Function to register
  const register = async (username: string, email: string, password: string) => {
    try {
      await registerMutation.mutateAsync({ username, email, password });
    } catch (error) {
      throw error;
    }
  };

  // Function to logout
  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      throw error;
    }
  };

  // Clear error function
  const clearError = () => setError(null);

  return {
    user,
    isAuthenticated: isSuccess && !!user,
    isLoading: isLoadingUser || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    error,
    clearError,
    login,
    register,
    logout,
    getCurrentUser,
  };
}
