import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface TopicGenerationRequest {
  courseName: string;
  focusArea: string;
  topicsPerDay: number;
  numberOfDays: number;
}

export interface GeneratedTopic {
  title: string;
  description: string;
  content: string;
  sources: string[];
  order: number;
}
