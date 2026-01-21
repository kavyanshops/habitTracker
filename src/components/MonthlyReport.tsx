import React, { useMemo } from 'react';
import { useTracker } from '../context/TrackerContext';
import { generateMonthlyReport } from '../utils/calculations';
import { getDaysInMonthCount, formatMonthYear, getPreviousMonth } from '../utils/dateUtils';
import { loadFromStorage } from '../utils/storage';
import { 
  TrendingUp, 
  TrendingDown, 
  Trophy, 
  Target, 
  AlertTriangle,
  Award,
  Calendar,
  Flame,
  Star,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const MonthlyReport: React.FC = () => {
  const { state } = useTracker();
  const { habits, moods, screenTime, streak, currentMonth, currentYear } = state;
  
  // Load previous month data
  const previousMonthData = useMemo(() => {
    const prev = getPreviousMonth(currentMonth, currentYear);
    return loadFromStorage(prev.month, prev.year);
  }, [currentMonth, currentYear]);
  
  // Generate report
  const report = useMemo(() => {
    return generateMonthlyReport(
      habits,
      moods,
      screenTime,
      streak,
      previousMonthData?.habits || null,
      previousMonthData?.moods || null,
      previousMonthData?.screenTime || null,
      previousMonthData?.streak || 0,
      currentMonth,
      currentYear
    );
  }, [habits, moods, screenTime, streak, previousMonthData, currentMonth, currentYear]);
  
  // Get motivational message based on performance
  const getMotivationalMessage = (): { message: string; icon: React.ReactNode } => {
    if (report.completionPercentage >= 90) {
      return { 
        message: "🌟 Outstanding! You're crushing it this month! Keep this momentum!", 
        icon: <Trophy className="text-yellow-500" size={24} /> 
      };
    }
    if (report.completionPercentage >= 70) {
      return { 
        message: "💪 Great job! You're building solid habits. Push for excellence!", 
        icon: <Star className="text-green-500" size={24} /> 
      };
    }
    if (report.completionPercentage >= 50) {
      return { 
        message: "📈 Good progress! Focus on consistency to reach the next level.", 
        icon: <Target className="text-blue-500" size={24} /> 
      };
    }
    return { 
      message: "🎯 Every day is a new chance to improve. Start with one habit today!", 
      icon: <AlertTriangle className="text-orange-500" size={24} /> 
    };
  };
  
  const motivational = getMotivationalMessage();
  const daysInMonth = getDaysInMonthCount(currentMonth, currentYear);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-paper p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold dark:text-white flex items-center gap-2 mb-6">
        <span>📊</span> Monthly Performance Report
      </h2>
      
      {/* Month indicator */}
      <div className="flex items-center gap-2 mb-6 text-gray-600 dark:text-gray-400">
        <Calendar size={18} />
        <span>{formatMonthYear(currentMonth, currentYear)}</span>
        <span className="text-sm">({report.totalDaysTracked} days tracked)</span>
      </div>
      
      {/* Motivational message */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 
                    rounded-lg p-4 mb-6 flex items-center gap-4">
        {motivational.icon}
        <p className="text-gray-700 dark:text-gray-200 font-medium">{motivational.message}</p>
      </div>
      
      {/* Main stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Completion rate */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-3xl font-black text-green-500 mb-1">
            {report.completionPercentage}%
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
        </div>
        
        {/* Current streak */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-3xl font-black text-orange-500 mb-1">
            <Flame size={28} />
            {report.currentStreak}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
        </div>
        
        {/* Perfect days */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-3xl font-black text-purple-500 mb-1">
            {report.perfectDays}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Perfect Days</p>
        </div>
        
        {/* Total completed */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-3xl font-black text-blue-500 mb-1">
            {report.totalHabitsCompleted}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Habits Done</p>
        </div>
      </div>
      
      {/* Detailed breakdown */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Habit consistency */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="font-semibold mb-4 dark:text-white flex items-center gap-2">
            <Award size={18} />
            Habit Consistency
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" size={20} />
                <span className="text-sm dark:text-gray-300">Most Consistent</span>
              </div>
              <span className="font-bold text-green-600 dark:text-green-400">
                {report.mostConsistentHabit}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="text-red-500" size={20} />
                <span className="text-sm dark:text-gray-300">Needs Improvement</span>
              </div>
              <span className="font-bold text-red-600 dark:text-red-400">
                {report.leastConsistentHabit}
              </span>
            </div>
          </div>
        </div>
        
        {/* Screen time & mood */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="font-semibold mb-4 dark:text-white flex items-center gap-2">
            <Target size={18} />
            Other Metrics
          </h4>
          
          <div className="space-y-3">
            {/* Screen time */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Avg Screen Time</span>
              <div className="flex items-center gap-2">
                <span className="font-bold dark:text-white">{report.averageScreenTime}h/day</span>
                {report.screenTimeChange !== 0 && (
                  <span className={`text-xs flex items-center gap-0.5 ${
                    report.screenTimeChange > 0 ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {report.screenTimeChange > 0 ? (
                      <>
                        <TrendingUp size={12} />
                        +{report.screenTimeChange}%
                      </>
                    ) : (
                      <>
                        <TrendingDown size={12} />
                        {report.screenTimeChange}%
                      </>
                    )}
                  </span>
                )}
              </div>
            </div>
            
            {/* Average mood */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Average Mood</span>
              <span className="font-bold dark:text-white">
                {report.averageMoodScore > 0 ? `${report.averageMoodScore}/5` : 'No data'}
              </span>
            </div>
            
            {/* Streak comparison */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Previous Month Streak</span>
              <div className="flex items-center gap-2">
                <span className="font-bold dark:text-white">{report.previousStreak} days</span>
                {report.currentStreak > report.previousStreak && (
                  <span className="text-xs text-green-500">↑</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress visualization */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="font-semibold mb-4 dark:text-white">Monthly Progress</h4>
        
        {/* Overall progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">Overall Completion</span>
            <span className="font-bold dark:text-white">{report.completionPercentage}%</span>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                report.completionPercentage >= 70 
                  ? 'bg-green-500' 
                  : report.completionPercentage >= 40 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
              }`}
              style={{ width: `${report.completionPercentage}%` }}
            />
          </div>
        </div>
        
        {/* Perfect days progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">Perfect Days</span>
            <span className="font-bold dark:text-white">{report.perfectDays}/{daysInMonth}</span>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 rounded-full transition-all duration-1000"
              style={{ width: `${(report.perfectDays / daysInMonth) * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Insights */}
      {report.completionPercentage > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold mb-3 dark:text-white">💡 Insights</h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            {report.mostConsistentHabit !== 'N/A' && (
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                Your most consistent habit is <strong>{report.mostConsistentHabit}</strong>. Keep it up!
              </li>
            )}
            {report.leastConsistentHabit !== 'N/A' && report.leastConsistentHabit !== report.mostConsistentHabit && (
              <li className="flex items-start gap-2">
                <span className="text-orange-500">•</span>
                Focus more on <strong>{report.leastConsistentHabit}</strong> to improve your overall score.
              </li>
            )}
            {report.currentStreak >= 7 && (
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                Amazing! You have a {report.currentStreak}-day streak going! 🔥
              </li>
            )}
            {report.screenTimeChange > 10 && (
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                Screen time increased by {report.screenTimeChange}%. Consider setting daily limits.
              </li>
            )}
            {report.screenTimeChange < -10 && (
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                Great job reducing screen time by {Math.abs(report.screenTimeChange)}%!
              </li>
            )}
            {report.perfectDays >= 5 && (
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                You achieved {report.perfectDays} perfect days! That's impressive!
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MonthlyReport;
