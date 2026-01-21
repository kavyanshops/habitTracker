// Habit status types
export type HabitStatus = 'empty' | 'check' | 'cross';

// Mood types
export type MoodType = 'very-happy' | 'happy' | 'neutral' | 'sad' | 'very-sad' | null;

// Habit interface
export interface Habit {
  id: string;
  name: string;
  category?: string;
  dailyStatus: Record<number, HabitStatus>;
  createdAt: string;
  isDefault: boolean;
}

// Mood entry
export interface MoodEntry {
  day: number;
  mood: MoodType;
}

// Screen time entry
export interface ScreenTimeEntry {
  day: number;
  hours: number;
}

// Level thresholds
export interface LevelInfo {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
}

// Monthly data structure
export interface MonthData {
  month: number;
  year: number;
  habits: Habit[];
  moods: MoodEntry[];
  screenTime: ScreenTimeEntry[];
  level: number;
  xp: number;
  streak: number;
}

// Progress data for chart
export interface ProgressData {
  day: number;
  score: number;
}

// Monthly report
export interface MonthlyReport {
  totalHabitsCompleted: number;
  completionPercentage: number;
  mostConsistentHabit: string;
  leastConsistentHabit: string;
  averageScreenTime: number;
  previousMonthScreenTime: number;
  screenTimeChange: number;
  currentStreak: number;
  previousStreak: number;
  averageMoodScore: number;
  totalDaysTracked: number;
  perfectDays: number;
}

// Context state
export interface TrackerState {
  currentMonth: number;
  currentYear: number;
  habits: Habit[];
  moods: MoodEntry[];
  screenTime: ScreenTimeEntry[];
  level: number;
  xp: number;
  streak: number;
  darkMode: boolean;
}

// Context actions
export type TrackerAction =
  | { type: 'SET_MONTH'; payload: { month: number; year: number } }
  | { type: 'TOGGLE_HABIT'; payload: { habitId: string; day: number } }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'EDIT_HABIT'; payload: { id: string; name: string } }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'SET_MOOD'; payload: MoodEntry }
  | { type: 'SET_SCREEN_TIME'; payload: ScreenTimeEntry }
  | { type: 'UPDATE_XP'; payload: number }
  | { type: 'UPDATE_LEVEL'; payload: number }
  | { type: 'UPDATE_STREAK'; payload: number }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'LOAD_DATA'; payload: Partial<TrackerState> }
  | { type: 'RESET_MONTH' };

// Motivational quote
export interface Quote {
  text: string;
  author: string;
}
