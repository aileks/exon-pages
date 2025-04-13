import apiClient from './apiClient';

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

// Notes API
export const fetchNotes = (): Promise<Note[]> => apiClient.get<Note[]>('/api/notes');

export const fetchNote = (id: string): Promise<Note> => apiClient.get<Note>(`/api/notes/${id}`);

export const createNote = (data: CreateNoteDto): Promise<Note> => apiClient.post<Note>('/api/notes', data);

export const updateNote = (id: string, data: UpdateNoteDto): Promise<Note> =>
  apiClient.put<Note>(`/api/notes/${id}`, data);

export const deleteNote = (id: string): Promise<{ message: string }> =>
  apiClient.delete<{ message: string }>(`/api/notes/${id}`);

// Experiments API
export const fetchExperiments = (): Promise<Experiment[]> => apiClient.get<Experiment[]>('/api/experiments');

export const fetchExperiment = (id: string): Promise<Experiment> => apiClient.get<Experiment>(`/api/experiments/${id}`);

export const createExperiment = (data: CreateExperimentDto): Promise<Experiment> =>
  apiClient.post<Experiment>('/api/experiments', data);

export const updateExperiment = (id: string, data: UpdateExperimentDto): Promise<Experiment> =>
  apiClient.put<Experiment>(`/api/experiments/${id}`, data);

export const deleteExperiment = (id: string): Promise<{ message: string }> =>
  apiClient.delete<{ message: string }>(`/api/experiments/${id}`);

// Experiment Steps API
export const addExperimentStep = (
  experimentId: string,
  data: { description: string; observation?: string }
): Promise<ExperimentStep> => apiClient.post<ExperimentStep>(`/api/experiments/${experimentId}/steps`, data);

export const updateExperimentStep = (
  experimentId: string,
  stepId: string,
  data: { description?: string; observation?: string; started_at?: string; completed_at?: string }
): Promise<ExperimentStep> => apiClient.put<ExperimentStep>(`/api/experiments/${experimentId}/steps/${stepId}`, data);

export const deleteExperimentStep = (experimentId: string, stepId: string): Promise<{ message: string }> =>
  apiClient.delete<{ message: string }>(`/api/experiments/${experimentId}/steps/${stepId}`);

// Experiment Attachments API
export const addExperimentAttachment = (
  experimentId: string,
  data: { file_name: string; file_type: string; file_path?: string; description?: string }
): Promise<ExperimentAttachment> =>
  apiClient.post<ExperimentAttachment>(`/api/experiments/${experimentId}/attachments`, data);

export const deleteExperimentAttachment = (experimentId: string, attachmentId: string): Promise<{ message: string }> =>
  apiClient.delete<{ message: string }>(`/api/experiments/${experimentId}/attachments/${attachmentId}`);

export default {
  notes: {
    fetchAll: fetchNotes,
    fetchOne: fetchNote,
    create: createNote,
    update: updateNote,
    delete: deleteNote,
  },
  experiments: {
    fetchAll: fetchExperiments,
    fetchOne: fetchExperiment,
    create: createExperiment,
    update: updateExperiment,
    delete: deleteExperiment,
    steps: {
      add: addExperimentStep,
      update: updateExperimentStep,
      delete: deleteExperimentStep,
    },
    attachments: {
      add: addExperimentAttachment,
      delete: deleteExperimentAttachment,
    },
  },
};
