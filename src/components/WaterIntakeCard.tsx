import React from 'react';
import { Droplets, Plus, Minus } from 'lucide-react';
import { useTracker } from '../context/TrackerContext';

const WATER_GOAL = 8; // 8 glasses per day

export const WaterIntakeCard: React.FC = () => {
  const { state, setWaterIntake } = useTracker();
  const today = new Date().getDate();
  
  const todayEntry = state.waterIntake.find(entry => entry.day === today);
  const glasses = todayEntry?.glasses || 0;
  const progress = Math.min((glasses / WATER_GOAL) * 100, 100);

  const updateWater = (amount: number) => {
    const newGlasses = Math.max(0, glasses + amount);
    setWaterIntake(today, newGlasses);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <Droplets className="text-blue-500" size={24} />
          Water Intake
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Goal: {WATER_GOAL} glasses
        </span>
      </div>

      {/* Water glasses visualization */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {Array.from({ length: WATER_GOAL }, (_, i) => (
          <div
            key={i}
            className={`w-10 h-12 rounded-b-lg border-2 transition-all duration-300 ${
              i < glasses
                ? 'bg-blue-400 border-blue-500 shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
            }`}
            style={{
              clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0% 100%)',
            }}
          >
            {i < glasses && (
              <div className="w-full h-full flex items-center justify-center">
                <Droplets className="text-white" size={16} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={() => updateWater(-1)}
          disabled={glasses === 0}
          className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Minus size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        
        <div className="text-center">
          <span className="text-4xl font-bold text-blue-500">{glasses}</span>
          <span className="text-lg text-gray-500 dark:text-gray-400">/{WATER_GOAL}</span>
          <p className="text-sm text-gray-500 dark:text-gray-400">glasses</p>
        </div>

        <button
          onClick={() => updateWater(1)}
          className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-lg"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Motivational message */}
      {glasses >= WATER_GOAL && (
        <div className="mt-4 text-center text-green-500 font-medium animate-pulse">
          🎉 Great job! You've hit your water goal!
        </div>
      )}
      {glasses > 0 && glasses < WATER_GOAL && (
        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          {WATER_GOAL - glasses} more glasses to go!
        </p>
      )}
    </div>
  );
};
