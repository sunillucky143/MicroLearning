import { apiClient } from './client';
import type { ChatMessage, LearningMode } from '../types';

export const learningApi = {
  chat: async (topicId: string, messages: ChatMessage[]): Promise<ChatMessage> => {
    const response = await apiClient.post<ChatMessage>(`/learning/chat/${topicId}`, { messages });
    return response.data;
  },

  generateGame: async (topicId: string): Promise<{ gameHtml: string; gameUrl: string }> => {
    const response = await apiClient.post(`/learning/game/${topicId}`);
    return response.data;
  },

  convertToAudio: async (topicId: string): Promise<{ audioUrl: string }> => {
    const response = await apiClient.post(`/learning/audio/${topicId}`);
    return response.data;
  },

  convertToPodcast: async (topicId: string): Promise<{ audioUrl: string }> => {
    const response = await apiClient.post(`/learning/podcast/${topicId}`);
    return response.data;
  },

  convertToVideo: async (topicId: string): Promise<{ videoUrl: string }> => {
    const response = await apiClient.post(`/learning/video/${topicId}`);
    return response.data;
  },

  convertToComic: async (topicId: string): Promise<{ comicUrl: string; panels: string[] }> => {
    const response = await apiClient.post(`/learning/comic/${topicId}`);
    return response.data;
  },

  customBuilder: async (topicId: string, description: string): Promise<{ content: string }> => {
    const response = await apiClient.post(`/learning/custom/${topicId}`, { description });
    return response.data;
  },
};
