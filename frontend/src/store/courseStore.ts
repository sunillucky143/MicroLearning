import { create } from 'zustand';
import type { Course, Topic } from '../types';

interface CourseState {
  activeCourse: Course | null;
  topics: Topic[];
  selectedDate: Date;
  setActiveCourse: (course: Course | null) => void;
  setTopics: (topics: Topic[]) => void;
  setSelectedDate: (date: Date) => void;
  addTopic: (topic: Topic) => void;
  updateTopic: (id: string, updates: Partial<Topic>) => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  activeCourse: null,
  topics: [],
  selectedDate: new Date(),

  setActiveCourse: (course) => set({ activeCourse: course }),

  setTopics: (topics) => set({ topics }),

  setSelectedDate: (date) => set({ selectedDate: date }),

  addTopic: (topic) => set((state) => ({
    topics: [...state.topics, topic]
  })),

  updateTopic: (id, updates) => set((state) => ({
    topics: state.topics.map((topic) =>
      topic.id === id ? { ...topic, ...updates } : topic
    ),
  })),
}));
