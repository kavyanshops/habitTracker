// Habit status types
export type HabitStatus = 'empty' | 'check' | 'cross';

// Mood types
export type MoodType = 'very-happy' | 'happy' | 'neutral' | 'sad' | 'very-sad' | null;

// Meal types
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

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

// Water intake entry
export interface WaterIntakeEntry {
  day: number;
  glasses: number; // number of glasses (1 glass = 250ml)
}

// Exercise entry for gym
export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number; // in kg
}

// Gym session entry
export interface GymSessionEntry {
  day: number;
  exercises: Exercise[];
  duration: number; // in minutes
  notes?: string;
}

// Food entry
export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein?: number; // in grams
  carbs?: number; // in grams
  fats?: number; // in grams
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

// Daily food log
export interface DailyFoodLog {
  day: number;
  foods: FoodEntry[];
  totalCalories: number;
  targetCalories: number;
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
  waterIntake: WaterIntakeEntry[];
  gymSessions: GymSessionEntry[];
  foodLogs: DailyFoodLog[];
  calorieTarget: number;
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
  | { type: 'SET_WATER_INTAKE'; payload: WaterIntakeEntry }
  | { type: 'SET_GYM_SESSION'; payload: GymSessionEntry }
  | { type: 'ADD_FOOD_ENTRY'; payload: { day: number; food: FoodEntry } }
  | { type: 'REMOVE_FOOD_ENTRY'; payload: { day: number; foodId: string } }
  | { type: 'SET_CALORIE_TARGET'; payload: number }
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
