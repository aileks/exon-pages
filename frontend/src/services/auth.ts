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

export function useAuth() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const {
    data: user,
    isLoading: isLoadingUser,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => makeRequest<User>('/auth/me'),
    retry: false,
    enabled: false,
    staleTime: Infinity,
  });

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

  const getCurrentUser = async () => {
    try {
      const result = await refetch();
      return !!result.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const register = async (username: string, email: string, password: string) => {
    await registerMutation.mutateAsync({ username, email, password });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

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
