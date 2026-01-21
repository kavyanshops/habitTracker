import React, { useMemo } from 'react';
import { useTracker } from '../context/TrackerContext';
import { Flame, Star, Target, Zap } from 'lucide-react';

export const StreakCounter: React.FC = () => {
  const { state } = useTracker();
  const { streak } = state;
  
  // Get streak milestones
  const milestones = [7, 14, 21, 30, 60, 90, 100, 365];
  const nextMilestone = useMemo(() => {
    return milestones.find(m => m > streak) || streak + 10;
  }, [streak]);
  
  // Calculate days to next milestone
  const daysToMilestone = nextMilestone - streak;
  
  // Get streak tier
  const getStreakTier = (): { name: string; color: string; bgColor: string } => {
    if (streak >= 100) return { name: 'Legendary', color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/30' };
    if (streak >= 60) return { name: 'Master', color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' };
    if (streak >= 30) return { name: 'Expert', color: 'text-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900/30' };
    if (streak >= 14) return { name: 'Committed', color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/30' };
    if (streak >= 7) return { name: 'Building', color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/30' };
    return { name: 'Starting', color: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-700' };
  };
  
  const tier = getStreakTier();
  
  return (
    <div className={`${tier.bgColor} rounded-xl p-4 md:p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold dark:text-white flex items-center gap-2">
          <Flame className="text-orange-500" size={20} />
          Current Streak
        </h3>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${tier.color} ${tier.bgColor}`}>
          {tier.name}
        </span>
      </div>
      
      {/* Main streak display */}
      <div className="text-center mb-4">
        <div className={`text-5xl md:text-6xl font-black ${tier.color}`}>
          {streak}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          consecutive perfect days
        </p>
      </div>
      
      {/* Progress to next milestone */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Next milestone
          </span>
          <span className="text-sm font-bold dark:text-white flex items-center gap-1">
            <Target size={14} />
            {nextMilestone} days
          </span>
        </div>
        
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((streak / nextMilestone) * 100, 100)}%` }}
          />
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
          {daysToMilestone} more {daysToMilestone === 1 ? 'day' : 'days'} to go!
        </p>
      </div>
      
      {/* Streak benefits */}
      {streak > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Zap size={14} className="text-yellow-500" />
            <span>+{Math.min(streak * 2, 50)} bonus XP from streak</span>
          </div>
          {streak >= 7 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Star size={14} className="text-purple-500" />
              <span>Week streak achieved! 🎉</span>
            </div>
          )}
        </div>
      )}
      
      {/* No streak message */}
      {streak === 0 && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Complete all habits today to start your streak!
        </p>
      )}
    </div>
  );
};

export default StreakCounter;
