import React, { useState, useCallback, useMemo, memo } from 'react';
import { useTracker } from '../context/TrackerContext';
import { getDayNumbers, isDayToday, isFutureDay } from '../utils/dateUtils';
import { calculateHabitStreak, isPerfectDay, countCompletedHabits } from '../utils/calculations';
import { Plus, Edit2, Trash2, X, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

// Memoized habit cell component
const HabitCell = memo(({ 
  habitId, 
  day, 
  status, 
  isToday, 
  isFuture, 
  onToggle 
}: { 
  habitId: string; 
  day: number; 
  status: 'empty' | 'check' | 'cross'; 
  isToday: boolean;
  isFuture: boolean;
  onToggle: (habitId: string, day: number) => void;
}) => {
  const handleClick = () => {
    if (!isFuture) {
      onToggle(habitId, day);
    }
  };
  
  return (
    <td 
      onClick={handleClick}
      className={`
        border border-gray-200 dark:border-gray-700 p-0 text-center cursor-pointer
        transition-all duration-200 ease-in-out
        ${isToday ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-400 ring-inset' : ''}
        ${isFuture ? 'bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed opacity-50' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
        ${status === 'check' ? 'bg-green-50 dark:bg-green-900/20' : ''}
        ${status === 'cross' ? 'bg-red-50 dark:bg-red-900/20' : ''}
      `}
      style={{ width: '30px', height: '30px', minWidth: '30px' }}
    >
      {status === 'check' && (
        <span className="text-green-500 font-bold text-lg animate-bounce-once">✓</span>
      )}
      {status === 'cross' && (
        <span className="text-red-500 font-bold text-lg">✗</span>
      )}
    </td>
  );
});

HabitCell.displayName = 'HabitCell';

// Add habit modal component
const AddHabitModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
  editingHabit?: { id: string; name: string } | null;
  onEdit?: (id: string, name: string) => void;
}> = ({ isOpen, onClose, onAdd, editingHabit, onEdit }) => {
  const [habitName, setHabitName] = useState(editingHabit?.name || '');
  
  React.useEffect(() => {
    setHabitName(editingHabit?.name || '');
  }, [editingHabit]);
  
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habitName.trim()) {
      if (editingHabit && onEdit) {
        onEdit(editingHabit.id, habitName.trim());
      } else {
        onAdd(habitName.trim());
      }
      setHabitName('');
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold dark:text-white">
            {editingHabit ? 'Edit Habit' : 'Add New Habit'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            placeholder="Enter habit name..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
                     dark:bg-gray-700 dark:text-white text-lg"
            autoFocus
          />
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 
                       rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black 
                       rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 font-semibold"
            >
              {editingHabit ? 'Save' : 'Add Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main HabitGrid component
export const HabitGrid: React.FC = () => {
  const { state, toggleHabit, addHabit, editHabit, deleteHabit } = useTracker();
  const { habits, currentMonth, currentYear } = state;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<{ id: string; name: string } | null>(null);
  const [hoveredHabit, setHoveredHabit] = useState<string | null>(null);
  
  const days = useMemo(() => getDayNumbers(currentMonth, currentYear), [currentMonth, currentYear]);
  const currentDay = new Date().getDate();
  
  // Check for perfect day and trigger confetti
  const handleToggle = useCallback((habitId: string, day: number) => {
    toggleHabit(habitId, day);
    
    // Check if this toggle completes a perfect day
    setTimeout(() => {
      const habit = habits.find(h => h.id === habitId);
      if (habit) {
        const newStatus = habit.dailyStatus[day] === 'empty' || habit.dailyStatus[day] === 'cross' ? 'check' : 
                         habit.dailyStatus[day] === 'check' ? 'cross' : 'empty';
        
        if (newStatus === 'check') {
          // Count completed habits after this toggle
          const willBeCompleted = habits.filter(h => {
            if (h.id === habitId) return true;
            return h.dailyStatus[day] === 'check';
          }).length;
          
          if (willBeCompleted === habits.length) {
            // Perfect day achieved!
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
            toast.success('🎉 Perfect Day! All habits completed!', {
              duration: 3000,
              style: {
                background: '#10B981',
                color: 'white',
                fontWeight: 'bold',
              },
            });
          }
        }
      }
    }, 100);
  }, [habits, toggleHabit]);
  
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteHabit(id);
      toast.success('Habit deleted');
    }
  };
  
  const handleEdit = (habit: { id: string; name: string }) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHabit(null);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-paper p-4 md:p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold dark:text-white flex items-center gap-2">
          <span>📋</span> Monthly Habit Protocol
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white 
                   text-white dark:text-black rounded-lg hover:bg-gray-800 
                   dark:hover:bg-gray-200 transition-colors font-semibold text-sm"
        >
          <Plus size={18} />
          Add Habit
        </button>
      </div>
      
      {/* Daily completion summary */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-center gap-4 text-sm">
          <span className="dark:text-gray-300">
            Today: <strong className="text-green-500">{countCompletedHabits(habits, currentDay)}</strong>/{habits.length} completed
          </span>
          {isPerfectDay(habits, currentDay) && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
              🌟 Perfect Day!
            </span>
          )}
        </div>
      </div>
      
      {/* Grid table */}
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="min-w-max px-4 md:px-0">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-100 
                             dark:bg-gray-700 text-left font-semibold dark:text-white sticky left-0 z-10"
                    style={{ minWidth: '180px' }}>
                  Habits
                </th>
                {days.map(day => (
                  <th 
                    key={day}
                    className={`border border-gray-200 dark:border-gray-700 p-1 bg-gray-100 
                              dark:bg-gray-700 text-center font-medium dark:text-white
                              ${isDayToday(day, currentMonth, currentYear) ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}
                    style={{ width: '30px', minWidth: '30px' }}
                  >
                    {day}
                  </th>
                ))}
                <th className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-100 
                             dark:bg-gray-700 text-center font-semibold dark:text-white"
                    style={{ minWidth: '60px' }}>
                  🔥
                </th>
              </tr>
            </thead>
            <tbody>
              {habits.map(habit => {
                const streak = calculateHabitStreak(habit, currentDay);
                return (
                  <tr 
                    key={habit.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    onMouseEnter={() => setHoveredHabit(habit.id)}
                    onMouseLeave={() => setHoveredHabit(null)}
                  >
                    <td className="border border-gray-200 dark:border-gray-700 p-2 font-medium 
                                 dark:text-white sticky left-0 bg-white dark:bg-gray-800 z-10">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">{habit.name}</span>
                        {hoveredHabit === habit.id && (
                          <div className="flex gap-1 animate-fade-in">
                            <button
                              onClick={() => handleEdit({ id: habit.id, name: habit.name })}
                              className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            {!habit.isDefault && (
                              <button
                                onClick={() => handleDelete(habit.id, habit.name)}
                                className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    {days.map(day => (
                      <HabitCell
                        key={`${habit.id}-${day}`}
                        habitId={habit.id}
                        day={day}
                        status={habit.dailyStatus[day] || 'empty'}
                        isToday={isDayToday(day, currentMonth, currentYear)}
                        isFuture={isFutureDay(day, currentMonth, currentYear)}
                        onToggle={handleToggle}
                      />
                    ))}
                    <td className="border border-gray-200 dark:border-gray-700 p-2 text-center 
                                 font-bold dark:text-white">
                      {streak > 0 && (
                        <span className="flex items-center justify-center gap-1 text-orange-500">
                          <Flame size={14} className={streak >= 7 ? 'animate-pulse' : ''} />
                          {streak}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-green-50 border border-green-200 rounded flex items-center justify-center text-green-500 text-xs">✓</span>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-red-50 border border-red-200 rounded flex items-center justify-center text-red-500 text-xs">✗</span>
          <span>Skipped</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-white border border-gray-200 rounded"></span>
          <span>Not tracked</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-blue-50 border-2 border-blue-400 rounded"></span>
          <span>Today</span>
        </div>
      </div>
      
      <AddHabitModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAdd={addHabit}
        editingHabit={editingHabit}
        onEdit={editHabit}
      />
    </div>
  );
};

export default HabitGrid;
