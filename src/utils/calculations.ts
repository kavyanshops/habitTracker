import { Habit, HabitStatus, MoodEntry, ScreenTimeEntry, ProgressData, MonthlyReport, MoodType } from '../types';
import { LEVELS, MOOD_EMOJIS, XP_REWARDS, SCREEN_TIME_THRESHOLDS } from './constants';
import { getDaysInMonthCount } from './dateUtils';

// Cycle through habit status: empty -> check -> cross -> empty
export const cycleHabitStatus = (currentStatus: HabitStatus): HabitStatus => {
  switch (currentStatus) {
    case 'empty':
      return 'check';
    case 'check':
      return 'cross';
    case 'cross':
      return 'empty';
    default:
      return 'empty';
  }
};

// Calculate daily score based on habit completions
export const calculateDailyScore = (habits: Habit[], day: number): number => {
  if (habits.length === 0) return 0;
  
  const completed = habits.filter(habit => habit.dailyStatus[day] === 'check').length;
  return Number(((completed / habits.length) * 10).toFixed(1));
};

// Generate progress data for the chart
export const generateProgressData = (habits: Habit[], daysInMonth: number): ProgressData[] => {
  const data: ProgressData[] = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const score = calculateDailyScore(habits, day);
    data.push({ day, score });
  }
  
  return data;
};

// Calculate streak for a specific habit
export const calculateHabitStreak = (habit: Habit, currentDay: number): number => {
  let streak = 0;
  
  for (let day = currentDay; day >= 1; day--) {
    if (habit.dailyStatus[day] === 'check') {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// Calculate overall streak (all habits completed for consecutive days)
export const calculateOverallStreak = (habits: Habit[], currentDay: number): number => {
  if (habits.length === 0) return 0;
  
  let streak = 0;
  
  for (let day = currentDay; day >= 1; day--) {
    const allCompleted = habits.every(habit => habit.dailyStatus[day] === 'check');
    if (allCompleted) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// Check if all habits are completed for a day
export const isPerfectDay = (habits: Habit[], day: number): boolean => {
  if (habits.length === 0) return false;
  return habits.every(habit => habit.dailyStatus[day] === 'check');
};

// Count completed habits for a day
export const countCompletedHabits = (habits: Habit[], day: number): number => {
  return habits.filter(habit => habit.dailyStatus[day] === 'check').length;
};

// Calculate XP from habits
export const calculateXPFromHabits = (habits: Habit[], day: number): number => {
  let xp = 0;
  
  // XP for each completed habit
  const completedCount = countCompletedHabits(habits, day);
  xp += completedCount * XP_REWARDS.habitComplete;
  
  // Bonus XP for perfect day
  if (isPerfectDay(habits, day)) {
    xp += XP_REWARDS.perfectDay;
  }
  
  return xp;
};

// Calculate total XP for the month
export const calculateMonthlyXP = (habits: Habit[], moods: MoodEntry[], screenTime: ScreenTimeEntry[], daysInMonth: number): number => {
  let totalXP = 0;
  
  for (let day = 1; day <= daysInMonth; day++) {
    totalXP += calculateXPFromHabits(habits, day);
  }
  
  // Add XP for mood entries
  totalXP += moods.filter(m => m.mood !== null).length * XP_REWARDS.moodLogged;
  
  // Add XP for screen time entries
  totalXP += screenTime.filter(s => s.hours > 0).length * XP_REWARDS.screenTimeLogged;
  
  return totalXP;
};

// Calculate level from XP
export const calculateLevelFromXP = (xp: number): { level: number; title: string; progress: number; xpToNext: number } => {
  let currentLevel = LEVELS[0];
  
  for (const levelInfo of LEVELS) {
    if (xp >= levelInfo.minXP) {
      currentLevel = levelInfo;
    } else {
      break;
    }
  }
  
  const xpInLevel = xp - currentLevel.minXP;
  const xpNeeded = currentLevel.maxXP - currentLevel.minXP;
  const progress = Math.min((xpInLevel / xpNeeded) * 100, 100);
  const xpToNext = Math.max(currentLevel.maxXP - xp, 0);
  
  return {
    level: currentLevel.level,
    title: currentLevel.title,
    progress,
    xpToNext,
  };
};

// Calculate average mood score
export const calculateAverageMood = (moods: MoodEntry[]): number => {
  const validMoods = moods.filter(m => m.mood !== null);
  if (validMoods.length === 0) return 0;
  
  const totalScore = validMoods.reduce((sum, m) => {
    if (m.mood && MOOD_EMOJIS[m.mood]) {
      return sum + MOOD_EMOJIS[m.mood].score;
    }
    return sum;
  }, 0);
  
  return Number((totalScore / validMoods.length).toFixed(1));
};

// Calculate average screen time
export const calculateAverageScreenTime = (screenTime: ScreenTimeEntry[]): number => {
  const validEntries = screenTime.filter(s => s.hours > 0);
  if (validEntries.length === 0) return 0;
  
  const total = validEntries.reduce((sum, s) => sum + s.hours, 0);
  return Number((total / validEntries.length).toFixed(1));
};

// Get screen time color based on hours
export const getScreenTimeColor = (hours: number): string => {
  if (hours <= SCREEN_TIME_THRESHOLDS.low) return 'text-success';
  if (hours <= SCREEN_TIME_THRESHOLDS.medium) return 'text-warning';
  return 'text-danger';
};

// Get screen time background color
export const getScreenTimeBgColor = (hours: number): string => {
  if (hours <= SCREEN_TIME_THRESHOLDS.low) return 'bg-green-500';
  if (hours <= SCREEN_TIME_THRESHOLDS.medium) return 'bg-yellow-500';
  return 'bg-red-500';
};

// Calculate habit consistency percentage
export const calculateHabitConsistency = (habit: Habit, daysInMonth: number, currentDay: number): number => {
  const daysToCheck = Math.min(currentDay, daysInMonth);
  if (daysToCheck === 0) return 0;
  
  let completed = 0;
  for (let day = 1; day <= daysToCheck; day++) {
    if (habit.dailyStatus[day] === 'check') {
      completed++;
    }
  }
  
  return Number(((completed / daysToCheck) * 100).toFixed(1));
};

// Find most and least consistent habits
export const findConsistentHabits = (habits: Habit[], daysInMonth: number, currentDay: number): { most: string; least: string } => {
  if (habits.length === 0) return { most: 'N/A', least: 'N/A' };
  
  const consistencies = habits.map(habit => ({
    name: habit.name,
    consistency: calculateHabitConsistency(habit, daysInMonth, currentDay),
  }));
  
  consistencies.sort((a, b) => b.consistency - a.consistency);
  
  return {
    most: consistencies[0]?.name || 'N/A',
    least: consistencies[consistencies.length - 1]?.name || 'N/A',
  };
};

// Generate monthly report
export const generateMonthlyReport = (
  currentHabits: Habit[],
  currentMoods: MoodEntry[],
  currentScreenTime: ScreenTimeEntry[],
  currentStreak: number,
  _previousHabits: Habit[] | null,
  _previousMoods: MoodEntry[] | null,
  previousScreenTime: ScreenTimeEntry[] | null,
  previousStreak: number,
  month: number,
  year: number
): MonthlyReport => {
  const daysInMonth = getDaysInMonthCount(month, year);
  const currentDay = Math.min(new Date().getDate(), daysInMonth);
  
  // Calculate total habits completed
  let totalCompleted = 0;
  for (let day = 1; day <= currentDay; day++) {
    totalCompleted += countCompletedHabits(currentHabits, day);
  }
  
  const totalPossible = currentHabits.length * currentDay;
  const completionPercentage = totalPossible > 0 ? Number(((totalCompleted / totalPossible) * 100).toFixed(1)) : 0;
  
  // Find consistent habits
  const { most, least } = findConsistentHabits(currentHabits, daysInMonth, currentDay);
  
  // Screen time
  const avgScreenTime = calculateAverageScreenTime(currentScreenTime);
  const prevAvgScreenTime = previousScreenTime ? calculateAverageScreenTime(previousScreenTime) : 0;
  const screenTimeChange = prevAvgScreenTime > 0 
    ? Number((((avgScreenTime - prevAvgScreenTime) / prevAvgScreenTime) * 100).toFixed(1))
    : 0;
  
  // Mood
  const avgMood = calculateAverageMood(currentMoods);
  
  // Count perfect days
  let perfectDays = 0;
  for (let day = 1; day <= currentDay; day++) {
    if (isPerfectDay(currentHabits, day)) {
      perfectDays++;
    }
  }
  
  return {
    totalHabitsCompleted: totalCompleted,
    completionPercentage,
    mostConsistentHabit: most,
    leastConsistentHabit: least,
    averageScreenTime: avgScreenTime,
    previousMonthScreenTime: prevAvgScreenTime,
    screenTimeChange,
    currentStreak,
    previousStreak,
    averageMoodScore: avgMood,
    totalDaysTracked: currentDay,
    perfectDays,
  };
};

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get mood emoji and info
export const getMoodInfo = (mood: MoodType) => {
  if (!mood || !MOOD_EMOJIS[mood]) return null;
  return MOOD_EMOJIS[mood];
};
