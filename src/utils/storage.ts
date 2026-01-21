import { TrackerState } from '../types';
import { getStorageKey } from './dateUtils';

// Save state to localStorage
export const saveToStorage = (state: TrackerState): void => {
  try {
    const key = getStorageKey(state.currentMonth, state.currentYear);
    const data = {
      habits: state.habits,
      moods: state.moods,
      screenTime: state.screenTime,
      level: state.level,
      xp: state.xp,
      streak: state.streak,
    };
    localStorage.setItem(key, JSON.stringify(data));
    
    // Also save global settings
    localStorage.setItem('tracker_settings', JSON.stringify({
      darkMode: state.darkMode,
      level: state.level,
      xp: state.xp,
    }));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

// Load state from localStorage
export const loadFromStorage = (month: number, year: number): Partial<TrackerState> | null => {
  try {
    const key = getStorageKey(month, year);
    const data = localStorage.getItem(key);
    
    if (data) {
      return JSON.parse(data);
    }
    
    return null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

// Load global settings
export const loadGlobalSettings = (): { darkMode: boolean; level: number; xp: number } | null => {
  try {
    const data = localStorage.getItem('tracker_settings');
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return null;
  }
};

// Get all saved months
export const getAllSavedMonths = (): { month: number; year: number }[] => {
  const months: { month: number; year: number }[] = [];
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('tracker_') && key !== 'tracker_settings') {
        const parts = key.split('_');
        if (parts.length === 3) {
          months.push({
            year: parseInt(parts[1]),
            month: parseInt(parts[2]),
          });
        }
      }
    }
  } catch (error) {
    console.error('Failed to get saved months:', error);
  }
  
  return months.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
};

// Export month data as JSON
export const exportMonthData = (state: TrackerState): string => {
  const exportData = {
    month: state.currentMonth,
    year: state.currentYear,
    habits: state.habits,
    moods: state.moods,
    screenTime: state.screenTime,
    level: state.level,
    xp: state.xp,
    streak: state.streak,
    exportedAt: new Date().toISOString(),
  };
  
  return JSON.stringify(exportData, null, 2);
};

// Download data as file
export const downloadFile = (content: string, filename: string, type: string = 'application/json'): void => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Generate CSV from habit data
export const generateHabitCSV = (state: TrackerState): string => {
  const { habits, currentMonth, currentYear } = state;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Header row
  let csv = 'Habit';
  for (let i = 1; i <= daysInMonth; i++) {
    csv += `,Day ${i}`;
  }
  csv += ',Completion %\n';
  
  // Data rows
  habits.forEach(habit => {
    csv += `"${habit.name}"`;
    let completed = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const status = habit.dailyStatus[day] || 'empty';
      const symbol = status === 'check' ? '✓' : status === 'cross' ? 'X' : '';
      csv += `,${symbol}`;
      if (status === 'check') completed++;
    }
    
    const percentage = ((completed / daysInMonth) * 100).toFixed(1);
    csv += `,${percentage}%\n`;
  });
  
  return csv;
};
