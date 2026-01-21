import React from 'react';
import { useTracker } from '../context/TrackerContext';
import { isPerfectDay, countCompletedHabits, calculateDailyScore } from '../utils/calculations';
import { isDayToday } from '../utils/dateUtils';
import { Target, Calendar } from 'lucide-react';

export const TodaySummary: React.FC = () => {
  const { state } = useTracker();
  const { habits, currentMonth, currentYear } = state;
  
  const today = new Date().getDate();
  const isViewingToday = isDayToday(today, currentMonth, currentYear);
  
  if (!isViewingToday) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 
                    rounded-xl p-4 text-center">
        <Calendar className="mx-auto mb-2 text-blue-500" size={24} />
        <p className="text-blue-700 dark:text-blue-300">
          Navigate to current month to see today's summary
        </p>
      </div>
    );
  }
  
  const completedToday = countCompletedHabits(habits, today);
  const totalHabits = habits.length;
  const isPerfect = isPerfectDay(habits, today);
  const todayScore = calculateDailyScore(habits, today);
  const completionPercentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  
  return (
    <div className={`rounded-xl p-4 md:p-6 ${
      isPerfect 
        ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white' 
        : 'bg-white dark:bg-gray-800'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-bold flex items-center gap-2 ${
          isPerfect ? 'text-white' : 'dark:text-white'
        }`}>
          <Target size={20} className={isPerfect ? 'text-white' : 'text-blue-500'} />
          Today's Progress
        </h3>
        {isPerfect && (
          <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
            🎉 PERFECT DAY!
          </span>
        )}
      </div>
      
      {/* Progress ring */}
      <div className="flex items-center gap-6 mb-4">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={isPerfect ? 'rgba(255,255,255,0.3)' : '#e5e7eb'}
              strokeWidth="10"
              className="dark:stroke-gray-700"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={isPerfect ? 'white' : '#22c55e'}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${completionPercentage * 2.83} 283`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          {/* Percentage text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-black ${
              isPerfect ? 'text-white' : 'dark:text-white'
            }`}>
              {completionPercentage}%
            </span>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isPerfect ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
              Completed
            </span>
            <span className={`font-bold ${isPerfect ? 'text-white' : 'dark:text-white'}`}>
              {completedToday}/{totalHabits}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isPerfect ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
              Score
            </span>
            <span className={`font-bold ${isPerfect ? 'text-white' : 'dark:text-white'}`}>
              {todayScore}/10
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isPerfect ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
              Remaining
            </span>
            <span className={`font-bold ${isPerfect ? 'text-white' : 'dark:text-white'}`}>
              {totalHabits - completedToday} habits
            </span>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className={`h-3 rounded-full overflow-hidden ${
        isPerfect ? 'bg-white/30' : 'bg-gray-200 dark:bg-gray-700'
      }`}>
        <div 
          className={`h-full rounded-full transition-all duration-500 ${
            isPerfect ? 'bg-white' : 'bg-green-500'
          }`}
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      
      {/* Message */}
      <p className={`text-center text-sm mt-4 ${
        isPerfect ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
      }`}>
        {isPerfect 
          ? "Amazing! You've completed all habits today! 🌟"
          : completionPercentage >= 70
            ? "You're doing great! Keep going! 💪"
            : completionPercentage >= 40
              ? "Good progress! Complete a few more! 📈"
              : "Start checking off those habits! 🎯"
        }
      </p>
    </div>
  );
};

export default TodaySummary;
