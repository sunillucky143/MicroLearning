import { apiClient } from './client';
import type { Topic } from '../types';

export const topicsApi = {
  getByDate: async (date: string): Promise<Topic[]> => {
    const response = await apiClient.get<Topic[]>(`/topics/date/${date}`);
    return response.data;
  },

  getById: async (id: string): Promise<Topic> => {
    const response = await apiClient.get<Topic>(`/topics/${id}`);
    return response.data;
  },

  markComplete: async (id: string): Promise<Topic> => {
    const response = await apiClient.patch<Topic>(`/topics/${id}/complete`);
    return response.data;
  },

  getAllByCourse: async (courseId: string): Promise<Topic[]> => {
    const response = await apiClient.get<Topic[]>(`/topics/course/${courseId}`);
    return response.data;
  },
};
