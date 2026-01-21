import React, { useMemo, useState } from 'react';
import { useTracker } from '../context/TrackerContext';
import { getDayNumbers, isDayToday, isFutureDay } from '../utils/dateUtils';
import { calculateAverageMood } from '../utils/calculations';
import { MOOD_EMOJIS } from '../utils/constants';
import { MoodType } from '../types';

const moodOptions: NonNullable<MoodType>[] = ['very-happy', 'happy', 'neutral', 'sad', 'very-sad'];

export const MoodTracker: React.FC = () => {
  const { state, setMood } = useTracker();
  const { moods, currentMonth, currentYear } = state;
  
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  const days = useMemo(() => getDayNumbers(currentMonth, currentYear), [currentMonth, currentYear]);
  const averageMood = useMemo(() => calculateAverageMood(moods), [moods]);
  
  const getMoodForDay = (day: number): MoodType => {
    const entry = moods.find(m => m.day === day);
    return entry?.mood || null;
  };
  
  const handleDayClick = (day: number) => {
    if (!isFutureDay(day, currentMonth, currentYear)) {
      setSelectedDay(selectedDay === day ? null : day);
    }
  };
  
  const handleMoodSelect = (mood: NonNullable<MoodType>) => {
    if (selectedDay !== null) {
      setMood(selectedDay, mood);
      setSelectedDay(null);
    }
  };
  
  // Calculate mood distribution
  const moodDistribution = useMemo(() => {
    const distribution: Record<NonNullable<MoodType>, number> = {
      'very-happy': 0,
      'happy': 0,
      'neutral': 0,
      'sad': 0,
      'very-sad': 0,
    };
    
    moods.forEach(m => {
      if (m.mood) {
        distribution[m.mood]++;
      }
    });
    
    return distribution;
  }, [moods]);
  
  // Get mood label
  const getMoodLabel = (score: number): string => {
    if (score >= 4.5) return 'Excellent! 🌟';
    if (score >= 3.5) return 'Good';
    if (score >= 2.5) return 'Okay';
    if (score >= 1.5) return 'Could be better';
    return 'Needs attention';
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-paper p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold dark:text-white flex items-center gap-2">
          <span>🎭</span> Mood Tracker
        </h2>
        
        {averageMood > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Average Mood</p>
            <p className="text-lg font-bold dark:text-white">
              {averageMood}/5 <span className="text-sm font-normal">({getMoodLabel(averageMood)})</span>
            </p>
          </div>
        )}
      </div>
      
      {/* Mood selection popup */}
      {selectedDay !== null && (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg animate-fade-in">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            How did you feel on <strong>Day {selectedDay}</strong>?
          </p>
          <div className="flex flex-wrap gap-2">
            {moodOptions.map(mood => (
              <button
                key={mood}
                onClick={() => handleMoodSelect(mood)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all
                          hover:scale-105 ${
                            getMoodForDay(selectedDay) === mood
                              ? 'border-black dark:border-white bg-white dark:bg-gray-600'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-400'
                          }`}
              >
                <span className="text-2xl">{MOOD_EMOJIS[mood].emoji}</span>
                <span className="text-sm dark:text-white">{MOOD_EMOJIS[mood].label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Mood grid */}
      <div className="grid grid-cols-7 md:grid-cols-11 gap-2 mb-6">
        {days.map(day => {
          const mood = getMoodForDay(day);
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
                ${isFuture ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
                ${selectedDay === day ? 'border-black dark:border-white' : 'border-gray-200 dark:border-gray-600'}
                ${mood ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}
              `}
            >
              <span className="text-xs text-gray-500 dark:text-gray-400">{day}</span>
              {mood ? (
                <span className="text-xl md:text-2xl">{MOOD_EMOJIS[mood].emoji}</span>
              ) : (
                <span className="text-gray-300 dark:text-gray-600 text-lg">○</span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Mood distribution */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <h4 className="font-semibold mb-3 dark:text-white text-sm">Mood Distribution</h4>
        <div className="space-y-2">
          {moodOptions.map(mood => {
            const count = moodDistribution[mood];
            const percentage = moods.length > 0 ? (count / moods.length) * 100 : 0;
            
            return (
              <div key={mood} className="flex items-center gap-3">
                <span className="text-xl w-8">{MOOD_EMOJIS[mood].emoji}</span>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        mood === 'very-happy' || mood === 'happy' 
                          ? 'bg-green-500' 
                          : mood === 'neutral' 
                            ? 'bg-yellow-500' 
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300 w-12 text-right">
                  {count} days
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        {moodOptions.map(mood => (
          <span key={mood} className="flex items-center gap-1">
            <span>{MOOD_EMOJIS[mood].emoji}</span>
            <span>{MOOD_EMOJIS[mood].label}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default MoodTracker;
