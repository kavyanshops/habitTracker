import {
  format,
  getDaysInMonth,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  isSameMonth,
  addMonths,
  subMonths,
  getDate,
  getMonth,
  getYear,
} from 'date-fns';

// Get number of days in a specific month
export const getDaysInMonthCount = (month: number, year: number): number => {
  return getDaysInMonth(new Date(year, month));
};

// Get array of day numbers for a month
export const getDayNumbers = (month: number, year: number): number[] => {
  const daysCount = getDaysInMonthCount(month, year);
  return Array.from({ length: daysCount }, (_, i) => i + 1);
};

// Format month and year for display
export const formatMonthYear = (month: number, year: number): string => {
  return format(new Date(year, month), 'MMMM yyyy');
};

// Get current day of month
export const getCurrentDay = (): number => {
  return getDate(new Date());
};

// Get current month (0-indexed)
export const getCurrentMonth = (): number => {
  return getMonth(new Date());
};

// Get current year
export const getCurrentYear = (): number => {
  return getYear(new Date());
};

// Check if a specific day is today
export const isDayToday = (day: number, month: number, year: number): boolean => {
  return isToday(new Date(year, month, day));
};

// Check if we're in the current month
export const isCurrentMonth = (month: number, year: number): boolean => {
  return isSameMonth(new Date(year, month), new Date());
};

// Get previous month and year
export const getPreviousMonth = (month: number, year: number): { month: number; year: number } => {
  const date = subMonths(new Date(year, month), 1);
  return { month: getMonth(date), year: getYear(date) };
};

// Get next month and year
export const getNextMonth = (month: number, year: number): { month: number; year: number } => {
  const date = addMonths(new Date(year, month), 1);
  return { month: getMonth(date), year: getYear(date) };
};

// Generate storage key for a specific month
export const getStorageKey = (month: number, year: number): string => {
  return `tracker_${year}_${month}`;
};

// Get all days of the month as Date objects
export const getMonthDays = (month: number, year: number): Date[] => {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));
  return eachDayOfInterval({ start, end });
};

// Check if a date is in the past
export const isPastDay = (day: number, month: number, year: number): boolean => {
  const date = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

// Check if a date is in the future
export const isFutureDay = (day: number, month: number, year: number): boolean => {
  const date = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
};

// Get day of week for a specific date (0 = Sunday)
export const getDayOfWeek = (day: number, month: number, year: number): number => {
  return new Date(year, month, day).getDay();
};

// Format date for display
export const formatDate = (day: number, month: number, year: number): string => {
  return format(new Date(year, month, day), 'MMM d, yyyy');
};
