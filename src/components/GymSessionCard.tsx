import React, { useState } from 'react';
import { Dumbbell, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { Exercise } from '../types';

export const GymSessionCard: React.FC = () => {
  const { state, setGymSession } = useTracker();
  const today = new Date().getDate();
  
  const todaySession = state.gymSessions.find(session => session.day === today);
  const exercises = todaySession?.exercises || [];
  const totalDuration = todaySession?.duration || 0;

  const [isAdding, setIsAdding] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [newExercise, setNewExercise] = useState<Partial<Exercise>>({
    name: '',
    sets: 3,
    reps: 10,
    weight: 0,
  });

  const addExercise = () => {
    if (!newExercise.name?.trim()) return;

    const exercise: Exercise = {
      id: Date.now().toString(),
      name: newExercise.name.trim(),
      sets: newExercise.sets || 3,
      reps: newExercise.reps || 10,
      weight: newExercise.weight || 0,
    };

    const updatedExercises = [...exercises, exercise];
    setGymSession(today, updatedExercises, totalDuration);
    setNewExercise({ name: '', sets: 3, reps: 10, weight: 0 });
    setIsAdding(false);
  };

  const removeExercise = (id: string) => {
    const updatedExercises = exercises.filter(ex => ex.id !== id);
    setGymSession(today, updatedExercises, totalDuration);
  };

  const updateDuration = (minutes: number) => {
    setGymSession(today, exercises, Math.max(0, minutes));
  };

  const totalVolume = exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps * ex.weight), 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div 
        className="flex items-center justify-between mb-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <Dumbbell className="text-orange-500" size={24} />
          Gym Session
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {exercises.length} exercises
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
          {/* Duration input */}
          <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Session Duration:
            </label>
            <input
              type="number"
              value={totalDuration}
              onChange={(e) => updateDuration(parseInt(e.target.value) || 0)}
              className="w-20 px-3 py-1 border rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white text-center"
              min="0"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">minutes</span>
          </div>

          {/* Exercise list */}
          <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
            {exercises.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No exercises logged yet. Add your first exercise!
              </p>
            ) : (
              exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      {exercise.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {exercise.sets} sets × {exercise.reps} reps
                      {exercise.weight > 0 && ` @ ${exercise.weight}kg`}
                    </p>
                  </div>
                  <button
                    onClick={() => removeExercise(exercise.id)}
                    className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add exercise form */}
          {isAdding ? (
            <div className="space-y-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <input
                type="text"
                placeholder="Exercise name (e.g., Bench Press)"
                value={newExercise.name}
                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                autoFocus
              />
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Sets</label>
                  <input
                    type="number"
                    value={newExercise.sets}
                    onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center"
                    min="1"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Reps</label>
                  <input
                    type="number"
                    value={newExercise.reps}
                    onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center"
                    min="1"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Weight (kg)</label>
                  <input
                    type="number"
                    value={newExercise.weight}
                    onChange={(e) => setNewExercise({ ...newExercise, weight: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center"
                    min="0"
                    step="0.5"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addExercise}
                  disabled={!newExercise.name?.trim()}
                  className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                >
                  Add Exercise
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
              className="w-full py-3 border-2 border-dashed border-orange-300 dark:border-orange-700 text-orange-500 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Exercise
            </button>
          )}

          {/* Stats */}
          {exercises.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-500">{exercises.length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Exercises</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-500">{totalVolume.toLocaleString()}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Volume (kg)</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
