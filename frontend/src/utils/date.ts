import { format, parseISO, isAfter, isBefore, isSameDay, addDays, subDays, startOfDay } from 'date-fns';

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
};

export const formatDisplayDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMMM dd, yyyy');
};

export const isDateInFuture = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const today = startOfDay(new Date());
  return isAfter(startOfDay(dateObj), today);
};

export const isDateInPast = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const today = startOfDay(new Date());
  return isBefore(startOfDay(dateObj), today);
};

export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isSameDay(dateObj, new Date());
};

export const getNextDay = (date: Date): Date => {
  return addDays(date, 1);
};

export const getPreviousDay = (date: Date): Date => {
  return subDays(date, 1);
};

export const canAccessDate = (date: Date | string): boolean => {
  return !isDateInFuture(date);
};
