import React, { useMemo, useState } from 'react';
import { useTracker } from '../context/TrackerContext';
import { getDayNumbers, isDayToday, isFutureDay } from '../utils/dateUtils';
import { calculateAverageScreenTime, getScreenTimeColor, getScreenTimeBgColor } from '../utils/calculations';
import { SCREEN_TIME_THRESHOLDS } from '../utils/constants';
import { Smartphone, TrendingUp, TrendingDown, Clock, AlertTriangle } from 'lucide-react';

export const ScreenTimeCard: React.FC = () => {
  const { state, setScreenTime } = useTracker();
  const { screenTime, currentMonth, currentYear } = state;
  
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  
  const days = useMemo(() => getDayNumbers(currentMonth, currentYear), [currentMonth, currentYear]);
  const averageScreenTime = useMemo(() => calculateAverageScreenTime(screenTime), [screenTime]);
  
  const getScreenTimeForDay = (day: number): number => {
    const entry = screenTime.find(s => s.day === day);
    return entry?.hours || 0;
  };
  
  const handleDayClick = (day: number) => {
    if (!isFutureDay(day, currentMonth, currentYear)) {
      setSelectedDay(selectedDay === day ? null : day);
      setInputValue(getScreenTimeForDay(day).toString() || '');
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDay !== null) {
      const hours = parseFloat(inputValue) || 0;
      setScreenTime(selectedDay, Math.min(Math.max(hours, 0), 24));
      setSelectedDay(null);
      setInputValue('');
    }
  };
  
  // Calculate weekly averages
  const weeklyData = useMemo(() => {
    const weeks: { week: number; average: number; total: number }[] = [];
    
    for (let i = 0; i < 5; i++) {
      const startDay = i * 7 + 1;
      const endDay = Math.min((i + 1) * 7, days.length);
      const weekEntries = screenTime.filter(s => s.day >= startDay && s.day <= endDay && s.hours > 0);
      
      if (weekEntries.length > 0) {
        const total = weekEntries.reduce((sum, e) => sum + e.hours, 0);
        weeks.push({
          week: i + 1,
          average: Number((total / weekEntries.length).toFixed(1)),
          total: Number(total.toFixed(1)),
        });
      }
    }
    
    return weeks;
  }, [screenTime, days.length]);
  
  // Calculate trend
  const trend = useMemo(() => {
    if (screenTime.length < 7) return null;
    
    const recent = screenTime.slice(-7);
    const previous = screenTime.slice(-14, -7);
    
    if (previous.length === 0) return null;
    
    const recentAvg = recent.reduce((sum, e) => sum + e.hours, 0) / recent.length;
    const prevAvg = previous.reduce((sum, e) => sum + e.hours, 0) / previous.length;
    
    const change = ((recentAvg - prevAvg) / prevAvg) * 100;
    return { direction: change > 5 ? 'up' : change < -5 ? 'down' : 'stable', percentage: Math.abs(change) };
  }, [screenTime]);
  
  // Get color class based on hours
  const getColorClass = (hours: number): string => {
    if (hours <= SCREEN_TIME_THRESHOLDS.low) return 'bg-green-100 dark:bg-green-900/30 border-green-300';
    if (hours <= SCREEN_TIME_THRESHOLDS.medium) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300';
    return 'bg-red-100 dark:bg-red-900/30 border-red-300';
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-paper p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold dark:text-white flex items-center gap-2">
          <Smartphone className="text-gray-500" />
          Screen Time Tracker
        </h2>
        
        <div className="flex flex-wrap gap-3">
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Daily Average</p>
            <p className={`text-lg font-bold ${getScreenTimeColor(averageScreenTime)}`}>
              {averageScreenTime}h
            </p>
          </div>
          
          {trend && trend.direction !== 'stable' && (
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Weekly Trend</p>
              <div className="flex items-center gap-1">
                {trend.direction === 'up' ? (
                  <>
                    <TrendingUp className="text-red-500" size={18} />
                    <span className="text-red-500 font-bold">+{trend.percentage.toFixed(0)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="text-green-500" size={18} />
                    <span className="text-green-500 font-bold">-{trend.percentage.toFixed(0)}%</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Input for selected day */}
      {selectedDay !== null && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg animate-fade-in">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Enter screen time for <strong>Day {selectedDay}</strong>
          </p>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Hours..."
                className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
                         dark:bg-gray-600 dark:text-white"
                autoFocus
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">hrs</span>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black 
                       rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 font-semibold"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => { setSelectedDay(null); setInputValue(''); }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 
                       rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      
      {/* Screen time grid */}
      <div className="grid grid-cols-7 md:grid-cols-11 gap-2 mb-6">
        {days.map(day => {
          const hours = getScreenTimeForDay(day);
          const isToday = isDayToday(day, currentMonth, currentYear);
          const isFuture = isFutureDay(day, currentMonth, currentYear);
          
          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              disabled={isFuture}
              className={`
                aspect-square rounded-lg flex flex-col items-center justify-center p-1
                transition-all duration-200 border-2
                ${isToday ? 'ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-gray-800' : ''}
                ${isFuture ? 'opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600' : 'hover:scale-105 cursor-pointer'}
                ${selectedDay === day ? 'border-black dark:border-white' : ''}
                ${!isFuture && hours > 0 ? getColorClass(hours) : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600'}
              `}
            >
              <span className="text-xs text-gray-500 dark:text-gray-400">{day}</span>
              {hours > 0 ? (
                <span className={`text-sm font-bold ${getScreenTimeColor(hours)}`}>
                  {hours}h
                </span>
              ) : (
                <span className="text-gray-300 dark:text-gray-600 text-lg">-</span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Weekly breakdown */}
      {weeklyData.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-3 dark:text-white text-sm flex items-center gap-2">
            <Clock size={16} />
            Weekly Breakdown
          </h4>
          <div className="space-y-3">
            {weeklyData.map(week => (
              <div key={week.week} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-300 w-20">
                  Week {week.week}
                </span>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${getScreenTimeBgColor(week.average)}`}
                      style={{ width: `${Math.min((week.average / 8) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <span className={`text-sm font-bold w-16 text-right ${getScreenTimeColor(week.average)}`}>
                  {week.average}h avg
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Warning if high screen time */}
      {averageScreenTime > SCREEN_TIME_THRESHOLDS.medium && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                      rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-red-700 dark:text-red-400">High Screen Time Detected</p>
            <p className="text-sm text-red-600 dark:text-red-300">
              Your average screen time is above {SCREEN_TIME_THRESHOLDS.medium} hours. Consider taking more breaks!
            </p>
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-500"></span>
          Low (≤{SCREEN_TIME_THRESHOLDS.low}h)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-yellow-500"></span>
          Medium ({SCREEN_TIME_THRESHOLDS.low}-{SCREEN_TIME_THRESHOLDS.medium}h)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-500"></span>
          High ({'>'}{SCREEN_TIME_THRESHOLDS.medium}h)
        </span>
      </div>
    </div>
  );
};

export default ScreenTimeCard;
