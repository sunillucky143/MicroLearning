import { apiClient } from './client';
import type { Note } from '../types';

export const notesApi = {
  getByTopic: async (topicId: string): Promise<Note | null> => {
    const response = await apiClient.get<Note>(`/notes/topic/${topicId}`);
    return response.data;
  },

  create: async (topicId: string, content: string): Promise<Note> => {
    const response = await apiClient.post<Note>('/notes', { topicId, content });
    return response.data;
  },

  update: async (id: string, content: string): Promise<Note> => {
    const response = await apiClient.patch<Note>(`/notes/${id}`, { content });
    return response.data;
  },
};
