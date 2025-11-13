export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Course {
  id: string;
  userId: string;
  courseName: string;
  focusArea: string;
  topicsPerDay: number;
  startDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface Topic {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  assignedDate: string;
  completed: boolean;
  completedAt?: string;
  order: number;
  createdAt: string;
}

export interface Note {
  id: string;
  topicId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningSession {
  id: string;
  topicId: string;
  userId: string;
  mode: LearningMode;
  startedAt: string;
  completedAt?: string;
  duration?: number;
}

export enum LearningMode {
  CHAT = 'chat',
  GAME = 'game',
  AUDIO = 'audio',
  PODCAST = 'podcast',
  VIDEO = 'video',
  COMIC = 'comic',
  CUSTOM = 'custom'
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface CreateCourseRequest {
  courseName: string;
  focusArea: string;
  topicsPerDay: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface GameData {
  topicId: string;
  gameType: string;
  gameContent: string;
  gameUrl?: string;
}

export interface MediaConversion {
  topicId: string;
  mode: LearningMode;
  url?: string;
  content: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}
