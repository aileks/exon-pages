import { create } from 'zustand';
import notebookApi, {
  CreateExperimentDto,
  CreateNoteDto,
  Experiment,
  Note,
  UpdateExperimentDto,
  UpdateNoteDto,
} from '@/lib/notebookApi';

interface NotebookState {
  // Notes state
  notes: Note[];
  currentNote: Note | null;
  isLoadingNotes: boolean;
  noteError: string | null;

  // Experiments state
  experiments: Experiment[];
  currentExperiment: Experiment | null;
  isLoadingExperiments: boolean;
  experimentError: string | null;
}

interface NotebookActions {
  // Notes actions
  fetchNotes: () => Promise<void>;
  fetchNote: (id: string) => Promise<void>;
  createNote: (data: CreateNoteDto) => Promise<Note>;
  updateNote: (id: string, data: UpdateNoteDto) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  setCurrentNote: (note: Note | null) => void;
  clearNoteError: () => void;

  // Experiments actions
  fetchExperiments: () => Promise<void>;
  fetchExperiment: (id: string) => Promise<void>;
  createExperiment: (data: CreateExperimentDto) => Promise<Experiment>;
  updateExperiment: (id: string, data: UpdateExperimentDto) => Promise<Experiment>;
  deleteExperiment: (id: string) => Promise<void>;
  setCurrentExperiment: (experiment: Experiment | null) => void;
  clearExperimentError: () => void;
}

type NotebookStore = NotebookState & NotebookActions;

const useNotebookStore = create<NotebookStore>(set => ({
  // Notes state
  notes: [],
  currentNote: null,
  isLoadingNotes: false,
  noteError: null,

  // Experiments state
  experiments: [],
  currentExperiment: null,
  isLoadingExperiments: false,
  experimentError: null,

  // Notes actions
  fetchNotes: async () => {
    try {
      set({ isLoadingNotes: true, noteError: null });
      const notes = await notebookApi.notes.fetchAll();
      set({ notes, isLoadingNotes: false });
    } catch (error) {
      console.error('Error fetching notes:', error);
      set({ noteError: 'Failed to fetch notes', isLoadingNotes: false });
    }
  },

  fetchNote: async (id: string) => {
    try {
      set({ isLoadingNotes: true, noteError: null });
      const note = await notebookApi.notes.fetchOne(id);
      set({ currentNote: note, isLoadingNotes: false });
    } catch (error) {
      console.error(`Error fetching note ${id}:`, error);
      set({ noteError: 'Failed to fetch note', isLoadingNotes: false });
    }
  },

  createNote: async (data: CreateNoteDto) => {
    try {
      set({ isLoadingNotes: true, noteError: null });
      const newNote = await notebookApi.notes.create(data);
      set(state => ({
        notes: [newNote, ...state.notes],
        currentNote: newNote,
        isLoadingNotes: false,
      }));
      return newNote;
    } catch (error) {
      console.error('Error creating note:', error);
      set({ noteError: 'Failed to create note', isLoadingNotes: false });
      throw error;
    }
  },

  updateNote: async (id: string, data: UpdateNoteDto) => {
    try {
      set({ isLoadingNotes: true, noteError: null });
      const updatedNote = await notebookApi.notes.update(id, data);
      set(state => ({
        notes: state.notes.map(note => (note.id === id ? updatedNote : note)),
        currentNote: state.currentNote?.id === id ? updatedNote : state.currentNote,
        isLoadingNotes: false,
      }));
      return updatedNote;
    } catch (error) {
      console.error(`Error updating note ${id}:`, error);
      set({ noteError: 'Failed to update note', isLoadingNotes: false });
      throw error;
    }
  },

  deleteNote: async (id: string) => {
    try {
      set({ isLoadingNotes: true, noteError: null });
      await notebookApi.notes.delete(id);
      set(state => ({
        notes: state.notes.filter(note => note.id !== id),
        currentNote: state.currentNote?.id === id ? null : state.currentNote,
        isLoadingNotes: false,
      }));
    } catch (error) {
      console.error(`Error deleting note ${id}:`, error);
      set({ noteError: 'Failed to delete note', isLoadingNotes: false });
      throw error;
    }
  },

  setCurrentNote: (note: Note | null) => set({ currentNote: note }),

  clearNoteError: () => set({ noteError: null }),

  // Experiments actions
  fetchExperiments: async () => {
    try {
      set({ isLoadingExperiments: true, experimentError: null });
      const experiments = await notebookApi.experiments.fetchAll();
      set({ experiments, isLoadingExperiments: false });
    } catch (error) {
      console.error('Error fetching experiments:', error);
      set({ experimentError: 'Failed to fetch experiments', isLoadingExperiments: false });
    }
  },

  fetchExperiment: async (id: string) => {
    try {
      set({ isLoadingExperiments: true, experimentError: null });
      const experiment = await notebookApi.experiments.fetchOne(id);
      set({ currentExperiment: experiment, isLoadingExperiments: false });
    } catch (error) {
      console.error(`Error fetching experiment ${id}:`, error);
      set({ experimentError: 'Failed to fetch experiment', isLoadingExperiments: false });
    }
  },

  createExperiment: async (data: CreateExperimentDto) => {
    try {
      set({ isLoadingExperiments: true, experimentError: null });
      const newExperiment = await notebookApi.experiments.create(data);
      set(state => ({
        experiments: [newExperiment, ...state.experiments],
        currentExperiment: newExperiment,
        isLoadingExperiments: false,
      }));
      return newExperiment;
    } catch (error) {
      console.error('Error creating experiment:', error);
      set({ experimentError: 'Failed to create experiment', isLoadingExperiments: false });
      throw error;
    }
  },

  updateExperiment: async (id: string, data: UpdateExperimentDto) => {
    try {
      set({ isLoadingExperiments: true, experimentError: null });
      const updatedExperiment = await notebookApi.experiments.update(id, data);
      set(state => ({
        experiments: state.experiments.map(exp => (exp.id === id ? updatedExperiment : exp)),
        currentExperiment: state.currentExperiment?.id === id ? updatedExperiment : state.currentExperiment,
        isLoadingExperiments: false,
      }));
      return updatedExperiment;
    } catch (error) {
      console.error(`Error updating experiment ${id}:`, error);
      set({ experimentError: 'Failed to update experiment', isLoadingExperiments: false });
      throw error;
    }
  },

  deleteExperiment: async (id: string) => {
    try {
      set({ isLoadingExperiments: true, experimentError: null });
      await notebookApi.experiments.delete(id);
      set(state => ({
        experiments: state.experiments.filter(exp => exp.id !== id),
        currentExperiment: state.currentExperiment?.id === id ? null : state.currentExperiment,
        isLoadingExperiments: false,
      }));
    } catch (error) {
      console.error(`Error deleting experiment ${id}:`, error);
      set({ experimentError: 'Failed to delete experiment', isLoadingExperiments: false });
      throw error;
    }
  },

  setCurrentExperiment: (experiment: Experiment | null) => set({ currentExperiment: experiment }),

  clearExperimentError: () => set({ experimentError: null }),
}));

export default useNotebookStore;
