import React, { useMemo } from 'react';
import { useTracker } from '../context/TrackerContext';
import { calculateLevelFromXP } from '../utils/calculations';
import { LEVELS } from '../utils/constants';
import { Star, Trophy, Zap } from 'lucide-react';

export const LevelDisplay: React.FC = () => {
  const { state } = useTracker();
  const { xp } = state;
  
  const levelInfo = useMemo(() => calculateLevelFromXP(xp), [xp]);
  
  // Get next level info
  const nextLevel = useMemo(() => {
    return LEVELS.find(l => l.level === levelInfo.level + 1) || LEVELS[LEVELS.length - 1];
  }, [levelInfo.level]);
  
  // Stars based on level
  const stars = useMemo(() => {
    return Math.min(Math.ceil(levelInfo.level / 3), 4);
  }, [levelInfo.level]);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-paper p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold dark:text-white flex items-center gap-2 mb-6">
        <span>🏆</span> MY LEVEL
      </h2>
      
      {/* Level badge */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
          
          {/* Level circle */}
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 
                        dark:from-gray-100 dark:to-gray-300 flex flex-col items-center justify-center 
                        border-4 border-yellow-500 shadow-lg">
            <span className="text-4xl font-black text-white dark:text-gray-900">
              {levelInfo.level}
            </span>
            <div className="flex gap-0.5 mt-1">
              {Array.from({ length: stars }).map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  className="text-yellow-400 fill-yellow-400" 
                />
              ))}
            </div>
          </div>
          
          {/* Trophy icon for high levels */}
          {levelInfo.level >= 5 && (
            <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-2 shadow-lg animate-bounce">
              <Trophy size={16} className="text-white" />
            </div>
          )}
        </div>
        
        <h3 className="text-2xl font-bold mt-4 dark:text-white">
          {levelInfo.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Keep pushing to reach {nextLevel.title}!
        </p>
      </div>
      
      {/* XP Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium dark:text-white flex items-center gap-1">
            <Zap size={14} className="text-yellow-500" />
            {xp} XP
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {levelInfo.xpToNext} XP to next level
          </span>
        </div>
        
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full 
                     transition-all duration-500 ease-out relative overflow-hidden"
            style={{ width: `${levelInfo.progress}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                          animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>Level {levelInfo.level}</span>
          <span>Level {levelInfo.level + 1}</span>
        </div>
      </div>
      
      {/* XP breakdown */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <h4 className="font-semibold mb-3 dark:text-white text-sm">How to earn XP</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between text-gray-600 dark:text-gray-300">
            <span>Complete a habit</span>
            <span className="font-medium text-green-500">+5 XP</span>
          </li>
          <li className="flex justify-between text-gray-600 dark:text-gray-300">
            <span>Perfect day (all habits)</span>
            <span className="font-medium text-green-500">+50 XP</span>
          </li>
          <li className="flex justify-between text-gray-600 dark:text-gray-300">
            <span>Log mood</span>
            <span className="font-medium text-green-500">+2 XP</span>
          </li>
          <li className="flex justify-between text-gray-600 dark:text-gray-300">
            <span>Log screen time</span>
            <span className="font-medium text-green-500">+2 XP</span>
          </li>
        </ul>
      </div>
      
      {/* Level milestones */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold mb-3 dark:text-white text-sm">Next Milestones</h4>
        <div className="space-y-2">
          {LEVELS.slice(levelInfo.level, levelInfo.level + 3).map(level => (
            <div 
              key={level.level}
              className="flex items-center gap-3 text-sm"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                            ${level.level === levelInfo.level + 1 
                              ? 'bg-yellow-500 text-white' 
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                {level.level}
              </div>
              <div className="flex-1">
                <p className="font-medium dark:text-white">{level.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{level.minXP} XP required</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LevelDisplay;
