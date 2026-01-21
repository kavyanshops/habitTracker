import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { TrackerState, TrackerAction, Habit, MoodEntry, ScreenTimeEntry, WaterIntakeEntry, GymSessionEntry, FoodEntry, DailyFoodLog } from '../types';
import { DEFAULT_HABITS } from '../utils/constants';
import { getCurrentMonth, getCurrentYear, getDaysInMonthCount } from '../utils/dateUtils';
import { cycleHabitStatus, generateId, calculateMonthlyXP, calculateLevelFromXP, calculateOverallStreak } from '../utils/calculations';
import { saveToStorage, loadFromStorage, loadGlobalSettings } from '../utils/storage';

// Initialize default habits
const createDefaultHabits = (): Habit[] => {
  return DEFAULT_HABITS.map(h => ({
    ...h,
    dailyStatus: {},
    createdAt: new Date().toISOString(),
  }));
};

// Initial state
const initialState: TrackerState = {
  currentMonth: getCurrentMonth(),
  currentYear: getCurrentYear(),
  habits: createDefaultHabits(),
  moods: [],
  screenTime: [],
  waterIntake: [],
  gymSessions: [],
  foodLogs: [],
  calorieTarget: 2000,
  level: 1,
  xp: 0,
  streak: 0,
  darkMode: false,
};

// Reducer
const trackerReducer = (state: TrackerState, action: TrackerAction): TrackerState => {
  switch (action.type) {
    case 'SET_MONTH':
      return {
        ...state,
        currentMonth: action.payload.month,
        currentYear: action.payload.year,
      };
      
    case 'TOGGLE_HABIT': {
      const { habitId, day } = action.payload;
      const newHabits = state.habits.map(habit => {
        if (habit.id === habitId) {
          const currentStatus = habit.dailyStatus[day] || 'empty';
          const newStatus = cycleHabitStatus(currentStatus);
          return {
            ...habit,
            dailyStatus: {
              ...habit.dailyStatus,
              [day]: newStatus,
            },
          };
        }
        return habit;
      });
      return { ...state, habits: newHabits };
    }
    
    case 'ADD_HABIT': {
      return {
        ...state,
        habits: [...state.habits, action.payload],
      };
    }
    
    case 'EDIT_HABIT': {
      const newHabits = state.habits.map(habit => {
        if (habit.id === action.payload.id) {
          return { ...habit, name: action.payload.name };
        }
        return habit;
      });
      return { ...state, habits: newHabits };
    }
    
    case 'DELETE_HABIT': {
      return {
        ...state,
        habits: state.habits.filter(h => h.id !== action.payload),
      };
    }
    
    case 'SET_MOOD': {
      const existingIndex = state.moods.findIndex(m => m.day === action.payload.day);
      let newMoods: MoodEntry[];
      
      if (existingIndex >= 0) {
        newMoods = [...state.moods];
        newMoods[existingIndex] = action.payload;
      } else {
        newMoods = [...state.moods, action.payload];
      }
      
      return { ...state, moods: newMoods };
    }
    
    case 'SET_SCREEN_TIME': {
      const existingIndex = state.screenTime.findIndex(s => s.day === action.payload.day);
      let newScreenTime: ScreenTimeEntry[];
      
      if (existingIndex >= 0) {
        newScreenTime = [...state.screenTime];
        newScreenTime[existingIndex] = action.payload;
      } else {
        newScreenTime = [...state.screenTime, action.payload];
      }
      
      return { ...state, screenTime: newScreenTime };
    }
    
    case 'SET_WATER_INTAKE': {
      const existingIndex = state.waterIntake.findIndex(w => w.day === action.payload.day);
      let newWaterIntake: WaterIntakeEntry[];
      
      if (existingIndex >= 0) {
        newWaterIntake = [...state.waterIntake];
        newWaterIntake[existingIndex] = action.payload;
      } else {
        newWaterIntake = [...state.waterIntake, action.payload];
      }
      
      return { ...state, waterIntake: newWaterIntake };
    }
    
    case 'SET_GYM_SESSION': {
      const existingIndex = state.gymSessions.findIndex(g => g.day === action.payload.day);
      let newGymSessions: GymSessionEntry[];
      
      if (existingIndex >= 0) {
        newGymSessions = [...state.gymSessions];
        newGymSessions[existingIndex] = action.payload;
      } else {
        newGymSessions = [...state.gymSessions, action.payload];
      }
      
      return { ...state, gymSessions: newGymSessions };
    }
    
    case 'ADD_FOOD_ENTRY': {
      const { day, food } = action.payload;
      const existingIndex = state.foodLogs.findIndex(f => f.day === day);
      let newFoodLogs: DailyFoodLog[];
      
      if (existingIndex >= 0) {
        const existingLog = state.foodLogs[existingIndex];
        const updatedFoods = [...existingLog.foods, food];
        const totalCalories = updatedFoods.reduce((sum, f) => sum + f.calories, 0);
        newFoodLogs = [...state.foodLogs];
        newFoodLogs[existingIndex] = { ...existingLog, foods: updatedFoods, totalCalories };
      } else {
        newFoodLogs = [...state.foodLogs, {
          day,
          foods: [food],
          totalCalories: food.calories,
          targetCalories: state.calorieTarget,
        }];
      }
      
      return { ...state, foodLogs: newFoodLogs };
    }
    
    case 'REMOVE_FOOD_ENTRY': {
      const { day, foodId } = action.payload;
      const existingIndex = state.foodLogs.findIndex(f => f.day === day);
      
      if (existingIndex >= 0) {
        const existingLog = state.foodLogs[existingIndex];
        const updatedFoods = existingLog.foods.filter(f => f.id !== foodId);
        const totalCalories = updatedFoods.reduce((sum, f) => sum + f.calories, 0);
        const newFoodLogs = [...state.foodLogs];
        newFoodLogs[existingIndex] = { ...existingLog, foods: updatedFoods, totalCalories };
        return { ...state, foodLogs: newFoodLogs };
      }
      
      return state;
    }
    
    case 'SET_CALORIE_TARGET':
      return { ...state, calorieTarget: action.payload };
    
    case 'UPDATE_XP':
      return { ...state, xp: action.payload };
      
    case 'UPDATE_LEVEL':
      return { ...state, level: action.payload };
      
    case 'UPDATE_STREAK':
      return { ...state, streak: action.payload };
      
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
      
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
      
    case 'RESET_MONTH':
      return {
        ...state,
        habits: createDefaultHabits(),
        moods: [],
        screenTime: [],
        waterIntake: [],
        gymSessions: [],
        foodLogs: [],
        streak: 0,
      };
      
    default:
      return state;
  }
};

// Context
interface TrackerContextType {
  state: TrackerState;
  dispatch: React.Dispatch<TrackerAction>;
  toggleHabit: (habitId: string, day: number) => void;
  addHabit: (name: string) => void;
  editHabit: (id: string, name: string) => void;
  deleteHabit: (id: string) => void;
  setMood: (day: number, mood: MoodEntry['mood']) => void;
  setScreenTime: (day: number, hours: number) => void;
  setWaterIntake: (day: number, glasses: number) => void;
  setGymSession: (day: number, exercises: GymSessionEntry['exercises'], duration: number, notes?: string) => void;
  addFoodEntry: (day: number, food: FoodEntry) => void;
  removeFoodEntry: (day: number, foodId: string) => void;
  setCalorieTarget: (target: number) => void;
  navigateMonth: (direction: 'prev' | 'next') => void;
  toggleDarkMode: () => void;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

// Provider component
export const TrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(trackerReducer, initialState);
  
  // Load data on mount and when month changes
  useEffect(() => {
    const savedData = loadFromStorage(state.currentMonth, state.currentYear);
    const globalSettings = loadGlobalSettings();
    
    if (savedData) {
      dispatch({ type: 'LOAD_DATA', payload: savedData });
    } else {
      // If no saved data for this month, reset to defaults
      dispatch({ type: 'RESET_MONTH' });
    }
    
    if (globalSettings) {
      dispatch({ type: 'LOAD_DATA', payload: { 
        darkMode: globalSettings.darkMode,
        level: globalSettings.level,
        xp: globalSettings.xp,
      }});
    }
  }, [state.currentMonth, state.currentYear]);
  
  // Save data whenever state changes
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToStorage(state);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [state]);
  
  // Update XP, level, and streak when habits change
  useEffect(() => {
    const daysInMonth = getDaysInMonthCount(state.currentMonth, state.currentYear);
    const currentDay = Math.min(new Date().getDate(), daysInMonth);
    
    const xp = calculateMonthlyXP(state.habits, state.moods, state.screenTime, daysInMonth);
    const { level } = calculateLevelFromXP(xp);
    const streak = calculateOverallStreak(state.habits, currentDay);
    
    if (xp !== state.xp) dispatch({ type: 'UPDATE_XP', payload: xp });
    if (level !== state.level) dispatch({ type: 'UPDATE_LEVEL', payload: level });
    if (streak !== state.streak) dispatch({ type: 'UPDATE_STREAK', payload: streak });
  }, [state.habits, state.moods, state.screenTime]);
  
  // Apply dark mode class
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);
  
  // Action handlers
  const toggleHabit = useCallback((habitId: string, day: number) => {
    dispatch({ type: 'TOGGLE_HABIT', payload: { habitId, day } });
  }, []);
  
  const addHabit = useCallback((name: string) => {
    const newHabit: Habit = {
      id: generateId(),
      name,
      dailyStatus: {},
      createdAt: new Date().toISOString(),
      isDefault: false,
    };
    dispatch({ type: 'ADD_HABIT', payload: newHabit });
  }, []);
  
  const editHabit = useCallback((id: string, name: string) => {
    dispatch({ type: 'EDIT_HABIT', payload: { id, name } });
  }, []);
  
  const deleteHabit = useCallback((id: string) => {
    dispatch({ type: 'DELETE_HABIT', payload: id });
  }, []);
  
  const setMood = useCallback((day: number, mood: MoodEntry['mood']) => {
    dispatch({ type: 'SET_MOOD', payload: { day, mood } });
  }, []);
  
  const setScreenTime = useCallback((day: number, hours: number) => {
    dispatch({ type: 'SET_SCREEN_TIME', payload: { day, hours } });
  }, []);
  
  const setWaterIntake = useCallback((day: number, glasses: number) => {
    dispatch({ type: 'SET_WATER_INTAKE', payload: { day, glasses } });
  }, []);
  
  const setGymSession = useCallback((day: number, exercises: GymSessionEntry['exercises'], duration: number, notes?: string) => {
    dispatch({ type: 'SET_GYM_SESSION', payload: { day, exercises, duration, notes } });
  }, []);
  
  const addFoodEntry = useCallback((day: number, food: FoodEntry) => {
    dispatch({ type: 'ADD_FOOD_ENTRY', payload: { day, food } });
  }, []);
  
  const removeFoodEntry = useCallback((day: number, foodId: string) => {
    dispatch({ type: 'REMOVE_FOOD_ENTRY', payload: { day, foodId } });
  }, []);
  
  const setCalorieTarget = useCallback((target: number) => {
    dispatch({ type: 'SET_CALORIE_TARGET', payload: target });
  }, []);
  
  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    let newMonth = state.currentMonth;
    let newYear = state.currentYear;
    
    if (direction === 'prev') {
      newMonth--;
      if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      }
    } else {
      newMonth++;
      if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      }
    }
    
    dispatch({ type: 'SET_MONTH', payload: { month: newMonth, year: newYear } });
  }, [state.currentMonth, state.currentYear]);
  
  const toggleDarkMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  }, []);
  
  return (
    <TrackerContext.Provider value={{
      state,
      dispatch,
      toggleHabit,
      addHabit,
      editHabit,
      deleteHabit,
      setMood,
      setScreenTime,
      setWaterIntake,
      setGymSession,
      addFoodEntry,
      removeFoodEntry,
      setCalorieTarget,
      navigateMonth,
      toggleDarkMode,
    }}>
      {children}
    </TrackerContext.Provider>
  );
};

// Hook to use the tracker context
export const useTracker = (): TrackerContextType => {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error('useTracker must be used within a TrackerProvider');
  }
  return context;
};
