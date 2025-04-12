let csrfToken: string | null = null;

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type JsonData = Record<string, unknown>;

const getCsrfToken = async (): Promise<string | null> => {
  if (csrfToken) return csrfToken;

  const res = await fetch('/api/auth/csrf/restore', {
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Failed to fetch CSRF token');

  const data = await res.json();
  csrfToken = data.csrf_token;

  return csrfToken;
};

const request = async <T, D = JsonData>(endpoint: string, method: RequestMethod = 'GET', data?: D): Promise<T> => {
  const options: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (method !== 'GET') {
    const token = await getCsrfToken();
    options.headers = {
      ...options.headers,
      'X-CSRFToken': token as string,
    };
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(endpoint, options);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const error = new Error(errorData.error || errorData.message || 'API request failed');
    throw Object.assign(error, { status: res.status, data: errorData });
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
};

const get = <T>(endpoint: string): Promise<T> => request<T>(endpoint, 'GET');

const post = <T, D = JsonData>(endpoint: string, data?: D): Promise<T> => request<T, D>(endpoint, 'POST', data);

const put = <T, D = JsonData>(endpoint: string, data?: D): Promise<T> => request<T, D>(endpoint, 'PUT', data);

const del = <T, D = JsonData>(endpoint: string, data?: D): Promise<T> => request<T, D>(endpoint, 'DELETE', data);

const invalidateCsrfToken = (): void => {
  csrfToken = null;
};

const apiClient = {
  get,
  post,
  put,
  delete: del,
  request,
  getCsrfToken,
  invalidateCsrfToken,
};

export default apiClient;
