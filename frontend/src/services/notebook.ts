import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  tags: string[];
}

export interface ExperimentStep {
  id: string;
  experiment_id: string;
  step_number: number;
  description: string;
  observation: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExperimentAttachment {
  id: string;
  experiment_id: string;
  file_name: string;
  file_type: string;
  file_path: string;
  description: string | null;
  created_at: string;
}

export interface Experiment {
  id: string;
  user_id: string;
  title: string;
  hypothesis: string;
  materials: string | null;
  methods: string;
  results: string | null;
  conclusion: string | null;
  status: 'planned' | 'in_progress' | 'completed' | 'failed';
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  references: string | null;
  steps: ExperimentStep[];
  attachments: ExperimentAttachment[];
}

export type CreateNoteDto = {
  title: string;
  content: string;
  tags?: string[];
};

export type UpdateNoteDto = Partial<CreateNoteDto>;

export type CreateExperimentDto = {
  title: string;
  hypothesis: string;
  materials?: string;
  methods: string;
  references?: string;
  steps?: Array<{
    description: string;
    observation?: string;
  }>;
};

export type UpdateExperimentDto = Partial<{
  title: string;
  hypothesis: string;
  materials: string;
  methods: string;
  results: string;
  conclusion: string;
  status: 'planned' | 'in_progress' | 'completed' | 'failed';
  references: string;
  steps: Array<{
    id?: string;
    description: string;
    observation?: string;
    started_at?: string;
    completed_at?: string;
  }>;
}>;

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

export const useNotes = () => {
  const queryClient = useQueryClient();
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    data: notes = [],
    isLoading: isLoadingNotes,
    refetch: refetchNotes,
  } = useQuery({
    queryKey: ['notes'],
    queryFn: () => makeRequest<Note[]>('/notes'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const fetchNote = async (id: string) => {
    try {
      const note = await makeRequest<Note>(`/notes/${id}`);
      setCurrentNote(note);
      return note;
    } catch (error: any) {
      setError(error.data?.error || 'Failed to fetch note');
      throw error;
    }
  };

  const createNoteMutation = useMutation({
    mutationFn: (data: CreateNoteDto) => makeRequest<Note>('/notes', 'POST', data),
    onSuccess: newNote => {
      queryClient.setQueryData(['notes'], (old: Note[] = []) => [newNote, ...old]);
      setCurrentNote(newNote);
      setError(null);
    },
    onError: (err: any) => {
      setError(err.data?.error || 'Failed to create note');
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoteDto }) => makeRequest<Note>(`/notes/${id}`, 'PUT', data),
    onSuccess: updatedNote => {
      queryClient.setQueryData(['notes'], (old: Note[] = []) =>
        old.map(note => (note.id === updatedNote.id ? updatedNote : note))
      );

      // Update current note if it's the one being edited
      if (currentNote?.id === updatedNote.id) {
        setCurrentNote(updatedNote);
      }

      setError(null);
    },
    onError: (err: any) => {
      setError(err.data?.error || 'Failed to update note');
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => makeRequest<{ message: string }>(`/notes/${id}`, 'DELETE'),
    onSuccess: (_, id) => {
      queryClient.setQueryData(['notes'], (old: Note[] = []) => old.filter(note => note.id !== id));

      // Clear current note if it was deleted
      if (currentNote?.id === id) {
        setCurrentNote(null);
      }

      setError(null);
    },
    onError: (err: any) => {
      setError(err.data?.error || 'Failed to delete note');
    },
  });

  const createNote = async (data: CreateNoteDto) => {
    try {
      return await createNoteMutation.mutateAsync(data);
    } catch (error) {
      throw error;
    }
  };

  const updateNote = async (id: string, data: UpdateNoteDto) => {
    try {
      return await updateNoteMutation.mutateAsync({ id, data });
    } catch (error) {
      throw error;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await deleteNoteMutation.mutateAsync(id);
    } catch (error) {
      throw error;
    }
  };

  const clearError = () => setError(null);

  return {
    notes,
    currentNote,
    isLoading:
      isLoadingNotes || createNoteMutation.isPending || updateNoteMutation.isPending || deleteNoteMutation.isPending,
    error,
    setCurrentNote,
    clearError,
    fetchNote,
    createNote,
    updateNote,
    deleteNote,
    refetchNotes,
  };
};

export const useExperiments = () => {
  const queryClient = useQueryClient();
  const [currentExperiment, setCurrentExperiment] = useState<Experiment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    data: experiments = [],
    isLoading: isLoadingExperiments,
    refetch: refetchExperiments,
  } = useQuery({
    queryKey: ['experiments'],
    queryFn: () => makeRequest<Experiment[]>('/experiments'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const fetchExperiment = async (id: string) => {
    try {
      const experiment = await makeRequest<Experiment>(`/experiments/${id}`);
      setCurrentExperiment(experiment);
      return experiment;
    } catch (error: any) {
      setError(error.data?.error || 'Failed to fetch experiment');
      throw error;
    }
  };

  const createExperimentMutation = useMutation({
    mutationFn: (data: CreateExperimentDto) => makeRequest<Experiment>('/experiments', 'POST', data),
    onSuccess: newExperiment => {
      queryClient.setQueryData(['experiments'], (old: Experiment[] = []) => [newExperiment, ...old]);
      setCurrentExperiment(newExperiment);
      setError(null);
    },
    onError: (err: any) => {
      setError(err.data?.error || 'Failed to create experiment');
    },
  });

  const updateExperimentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExperimentDto }) =>
      makeRequest<Experiment>(`/experiments/${id}`, 'PUT', data),
    onSuccess: updatedExperiment => {
      queryClient.setQueryData(['experiments'], (old: Experiment[] = []) =>
        old.map(exp => (exp.id === updatedExperiment.id ? updatedExperiment : exp))
      );

      // Update current experiment if it's the one being edited
      if (currentExperiment?.id === updatedExperiment.id) {
        setCurrentExperiment(updatedExperiment);
      }

      setError(null);
    },
    onError: (err: any) => {
      setError(err.data?.error || 'Failed to update experiment');
    },
  });

  const deleteExperimentMutation = useMutation({
    mutationFn: (id: string) => makeRequest<{ message: string }>(`/experiments/${id}`, 'DELETE'),
    onSuccess: (_, id) => {
      queryClient.setQueryData(['experiments'], (old: Experiment[] = []) => old.filter(exp => exp.id !== id));

      // Clear current experiment if it was deleted
      if (currentExperiment?.id === id) {
        setCurrentExperiment(null);
      }

      setError(null);
    },
    onError: (err: any) => {
      setError(err.data?.error || 'Failed to delete experiment');
    },
  });

  const createExperiment = async (data: CreateExperimentDto) => {
    try {
      return await createExperimentMutation.mutateAsync(data);
    } catch (error) {
      throw error;
    }
  };

  const updateExperiment = async (id: string, data: UpdateExperimentDto) => {
    try {
      return await updateExperimentMutation.mutateAsync({ id, data });
    } catch (error) {
      throw error;
    }
  };

  const deleteExperiment = async (id: string) => {
    try {
      await deleteExperimentMutation.mutateAsync(id);
    } catch (error) {
      throw error;
    }
  };

  const clearError = () => setError(null);

  return {
    experiments,
    currentExperiment,
    isLoading:
      isLoadingExperiments ||
      createExperimentMutation.isPending ||
      updateExperimentMutation.isPending ||
      deleteExperimentMutation.isPending,
    error,
    setCurrentExperiment,
    clearError,
    fetchExperiment,
    createExperiment,
    updateExperiment,
    deleteExperiment,
    refetchExperiments,
  };
};
