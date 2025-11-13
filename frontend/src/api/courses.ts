import { apiClient } from './client';
import type { Course, CreateCourseRequest } from '../types';

export const coursesApi = {
  create: async (data: CreateCourseRequest): Promise<Course> => {
    const response = await apiClient.post<Course>('/courses', data);
    return response.data;
  },

  getActive: async (): Promise<Course | null> => {
    const response = await apiClient.get<Course>('/courses/active');
    return response.data;
  },

  getAll: async (): Promise<Course[]> => {
    const response = await apiClient.get<Course[]>('/courses');
    return response.data;
  },

  getById: async (id: string): Promise<Course> => {
    const response = await apiClient.get<Course>(`/courses/${id}`);
    return response.data;
  },
};
