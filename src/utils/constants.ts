import { Habit, MoodType, Quote, LevelInfo } from '../types';

// Default habits
export const DEFAULT_HABITS: Omit<Habit, 'dailyStatus' | 'createdAt'>[] = [
  { id: 'reading', name: 'Reading', isDefault: true },
  { id: 'meditation', name: 'Meditation', isDefault: true },
  { id: 'study', name: 'Study', isDefault: true },
  { id: 'gym', name: 'Gym', isDefault: true },
  { id: 'skill-dev', name: 'Skill Development', isDefault: true },
  { id: 'wake-early', name: 'Wake Up Early', isDefault: true },
  { id: 'water', name: 'Water Intake', isDefault: true },
  { id: 'exercise', name: 'Exercise', isDefault: true },
  { id: 'yoga', name: 'Yoga', isDefault: true },
  { id: 'dsa', name: 'DSA Practice', isDefault: true },
  { id: 'delayed-grat', name: 'Delayed Gratification', isDefault: true },
  { id: 'diary', name: 'Diary Writing', isDefault: true },
  { id: 'digital-detox', name: 'Digital Detox', isDefault: true },
  { id: 'anxiety', name: 'Anxiety Management', isDefault: true },
  { id: 'cold-shower', name: 'Cold Showers', isDefault: true },
  { id: 'communication', name: 'Learning Communication', isDefault: true },
];

// Mood emojis
export const MOOD_EMOJIS: Record<NonNullable<MoodType>, { emoji: string; label: string; score: number }> = {
  'very-happy': { emoji: '😊', label: 'Very Happy', score: 5 },
  'happy': { emoji: '🙂', label: 'Happy', score: 4 },
  'neutral': { emoji: '😐', label: 'Neutral', score: 3 },
  'sad': { emoji: '😞', label: 'Sad', score: 2 },
  'very-sad': { emoji: '😢', label: 'Very Sad', score: 1 },
};

// Level definitions
export const LEVELS: LevelInfo[] = [
  { level: 1, title: 'Beginner', minXP: 0, maxXP: 100 },
  { level: 2, title: 'Apprentice', minXP: 100, maxXP: 250 },
  { level: 3, title: 'Practitioner', minXP: 250, maxXP: 500 },
  { level: 4, title: 'Journeyman', minXP: 500, maxXP: 800 },
  { level: 5, title: 'Expert', minXP: 800, maxXP: 1200 },
  { level: 6, title: 'Master', minXP: 1200, maxXP: 1700 },
  { level: 7, title: 'Grandmaster', minXP: 1700, maxXP: 2300 },
  { level: 8, title: 'Legend', minXP: 2300, maxXP: 3000 },
  { level: 9, title: 'Champion', minXP: 3000, maxXP: 4000 },
  { level: 10, title: 'Discipline Master', minXP: 4000, maxXP: 5000 },
  { level: 11, title: 'Enlightened', minXP: 5000, maxXP: 7000 },
  { level: 12, title: 'Transcendent', minXP: 7000, maxXP: 10000 },
];

// Motivational quotes
export const QUOTES: Quote[] = [
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Motivation gets you going, but discipline keeps you growing.", author: "John C. Maxwell" },
  { text: "Self-discipline begins with the mastery of your thoughts.", author: "Napoleon Hill" },
  { text: "The pain of discipline is nothing like the pain of disappointment.", author: "Justin Langer" },
  { text: "Small disciplines repeated with consistency lead to great achievements.", author: "John C. Maxwell" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "Without self-discipline, success is impossible, period.", author: "Lou Holtz" },
  { text: "The successful person has the habit of doing what failures don't like to do.", author: "Thomas Edison" },
  { text: "Your habits will determine your future.", author: "Jack Canfield" },
  { text: "Champions keep playing until they get it right.", author: "Billie Jean King" },
  { text: "It's not what we do once in a while that shapes our lives, but what we do consistently.", author: "Tony Robbins" },
  { text: "First forget inspiration. Habit is more dependable.", author: "Octavia Butler" },
  { text: "You will never change your life until you change something you do daily.", author: "John C. Maxwell" },
  { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
  { text: "Discipline is the foundation upon which all success is built.", author: "Jim Rohn" },
  { text: "Make each day your masterpiece.", author: "John Wooden" },
  { text: "Progress is impossible without change.", author: "George Bernard Shaw" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Every day is a chance to get better.", author: "Unknown" },
  { text: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson" },
  { text: "Your limitation—it's only your imagination.", author: "Unknown" },
  { text: "Dream bigger. Do bigger.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Stay focused and never give up.", author: "Unknown" },
  { text: "The harder you work, the luckier you get.", author: "Gary Player" },
];

// Screen time thresholds (in hours)
export const SCREEN_TIME_THRESHOLDS = {
  low: 2,
  medium: 4,
  high: 6,
};

// XP rewards
export const XP_REWARDS = {
  habitComplete: 5,
  perfectDay: 50,
  streakBonus: (streak: number) => Math.min(streak * 2, 50),
  moodLogged: 2,
  screenTimeLogged: 2,
};
