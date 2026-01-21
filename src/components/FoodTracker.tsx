import React, { useState } from 'react';
import { UtensilsCrossed, Plus, Trash2, ChevronDown, ChevronUp, Flame, Target } from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { FoodEntry, MealType } from '../types';

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

const MEAL_ICONS: Record<MealType, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍪',
};

export const FoodTracker: React.FC = () => {
  const { state, addFoodEntry, removeFoodEntry, setCalorieTarget } = useTracker();
  const today = new Date().getDate();
  
  const todayLog = state.foodLogs.find(log => log.day === today);
  const entries: FoodEntry[] = todayLog?.foods || [];
  const calorieTarget = state.calorieTarget;

  const [isAdding, setIsAdding] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showTargetEdit, setShowTargetEdit] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<FoodEntry>>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    mealType: 'breakfast',
  });

  const handleAddEntry = () => {
    if (!newEntry.name?.trim() || !newEntry.calories) return;

    const entry: FoodEntry = {
      id: Date.now().toString(),
      name: newEntry.name.trim(),
      calories: newEntry.calories || 0,
      protein: newEntry.protein,
      carbs: newEntry.carbs,
      fats: newEntry.fats,
      mealType: newEntry.mealType || 'snack',
    };

    addFoodEntry(today, entry);
    setNewEntry({
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      mealType: 'breakfast',
    });
    setIsAdding(false);
  };

  const handleRemoveEntry = (entryId: string) => {
    removeFoodEntry(today, entryId);
  };

  const totalCalories = entries.reduce((sum: number, e: FoodEntry) => sum + e.calories, 0);
  const totalProtein = entries.reduce((sum: number, e: FoodEntry) => sum + (e.protein || 0), 0);
  const totalCarbs = entries.reduce((sum: number, e: FoodEntry) => sum + (e.carbs || 0), 0);
  const totalFats = entries.reduce((sum: number, e: FoodEntry) => sum + (e.fats || 0), 0);
  
  const calorieProgress = Math.min((totalCalories / calorieTarget) * 100, 100);
  const isOverTarget = totalCalories > calorieTarget;

  const entriesByMeal = MEAL_TYPES.reduce((acc, meal) => {
    acc[meal] = entries.filter((e: FoodEntry) => e.mealType === meal);
    return acc;
  }, {} as Record<MealType, FoodEntry[]>);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div 
        className="flex items-center justify-between mb-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <UtensilsCrossed className="text-green-500" size={24} />
          Food & Calories
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {totalCalories} / {calorieTarget} kcal
          </span>
          {isExpanded ? (
            <ChevronUp size={20} className="text-gray-500" />
          ) : (
            <ChevronDown size={20} className="text-gray-500" />
          )}
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Calorie progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Flame className={`${isOverTarget ? 'text-red-500' : 'text-orange-500'}`} size={20} />
                <span className={`text-2xl font-bold ${isOverTarget ? 'text-red-500' : 'text-green-500'}`}>
                  {totalCalories}
                </span>
                <span className="text-gray-500 dark:text-gray-400">/ {calorieTarget} kcal</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTargetEdit(!showTargetEdit);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <Target size={16} className="text-gray-500" />
              </button>
            </div>
            
            {showTargetEdit && (
              <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <label className="text-sm text-gray-600 dark:text-gray-300">Daily target:</label>
                <input
                  type="number"
                  value={calorieTarget}
                  onChange={(e) => setCalorieTarget(parseInt(e.target.value) || 2000)}
                  className="w-24 px-2 py-1 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white text-center"
                  min="500"
                  max="10000"
                  step="100"
                />
                <span className="text-sm text-gray-500">kcal</span>
              </div>
            )}

            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                  isOverTarget
                    ? 'bg-gradient-to-r from-red-400 to-red-600'
                    : 'bg-gradient-to-r from-green-400 to-green-600'
                }`}
                style={{ width: `${calorieProgress}%` }}
              />
            </div>
            {isOverTarget && (
              <p className="text-sm text-red-500 mt-1">
                {totalCalories - calorieTarget} kcal over target
              </p>
            )}
          </div>

          {/* Macros summary */}
          <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <p className="text-lg font-bold text-blue-500">{totalProtein}g</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Protein</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-yellow-500">{totalCarbs}g</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Carbs</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-pink-500">{totalFats}g</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Fat</p>
            </div>
          </div>

          {/* Meals */}
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {MEAL_TYPES.map((mealType) => {
              const mealEntries = entriesByMeal[mealType];
              if (mealEntries.length === 0) return null;
              
              const mealCalories = mealEntries.reduce((sum: number, e: FoodEntry) => sum + e.calories, 0);
              
              return (
                <div key={mealType} className="border-l-4 border-green-400 pl-3">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 capitalize flex items-center gap-2">
                      <span>{MEAL_ICONS[mealType]}</span>
                      {mealType}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {mealCalories} kcal
                    </span>
                  </div>
                  {mealEntries.map((entry: FoodEntry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between py-1 pl-2 text-sm group"
                    >
                      <div className="flex-1">
                        <span className="text-gray-800 dark:text-gray-200">{entry.name}</span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                          {entry.calories} kcal
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveEntry(entry.id)}
                        className="p-1 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
            
            {entries.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No food logged yet. Track your meals!
              </p>
            )}
          </div>

          {/* Add food form */}
          {isAdding ? (
            <div className="space-y-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <input
                type="text"
                placeholder="Food name (e.g., Grilled Chicken)"
                value={newEntry.name}
                onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                autoFocus
              />
              
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Calories*</label>
                  <input
                    type="number"
                    value={newEntry.calories || ''}
                    onChange={(e) => setNewEntry({ ...newEntry, calories: parseInt(e.target.value) || 0 })}
                    className="w-full px-2 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center"
                    min="0"
                    placeholder="kcal"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Protein</label>
                  <input
                    type="number"
                    value={newEntry.protein || ''}
                    onChange={(e) => setNewEntry({ ...newEntry, protein: parseInt(e.target.value) || 0 })}
                    className="w-full px-2 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center"
                    min="0"
                    placeholder="g"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Carbs</label>
                  <input
                    type="number"
                    value={newEntry.carbs || ''}
                    onChange={(e) => setNewEntry({ ...newEntry, carbs: parseInt(e.target.value) || 0 })}
                    className="w-full px-2 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center"
                    min="0"
                    placeholder="g"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Fat</label>
                  <input
                    type="number"
                    value={newEntry.fats || ''}
                    onChange={(e) => setNewEntry({ ...newEntry, fats: parseInt(e.target.value) || 0 })}
                    className="w-full px-2 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center"
                    min="0"
                    placeholder="g"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">Meal</label>
                <div className="flex gap-2 mt-1">
                  {MEAL_TYPES.map((meal) => (
                    <button
                      key={meal}
                      onClick={() => setNewEntry({ ...newEntry, mealType: meal })}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm capitalize transition-colors ${
                        newEntry.mealType === meal
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {MEAL_ICONS[meal]} {meal}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddEntry}
                  disabled={!newEntry.name?.trim() || !newEntry.calories}
                  className="flex-1 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                >
                  Add Food
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-3 border-2 border-dashed border-green-300 dark:border-green-700 text-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Log Food
            </button>
          )}
        </>
      )}
    </div>
  );
};
