import React from 'react';
import { useTracker } from '../context/TrackerContext';
import { formatMonthYear, isCurrentMonth } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight, Moon, Sun, Download, RotateCcw } from 'lucide-react';
import { exportMonthData, downloadFile, generateHabitCSV } from '../utils/storage';
import toast from 'react-hot-toast';

export const Header: React.FC = () => {
  const { state, navigateMonth, toggleDarkMode, dispatch } = useTracker();
  const { currentMonth, currentYear, darkMode, streak } = state;
  
  const isViewingCurrentMonth = isCurrentMonth(currentMonth, currentYear);
  
  const handleExportJSON = () => {
    const data = exportMonthData(state);
    const filename = `habit-tracker-${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}.json`;
    downloadFile(data, filename);
    toast.success('Data exported as JSON');
  };
  
  const handleExportCSV = () => {
    const csv = generateHabitCSV(state);
    const filename = `habit-tracker-${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}.csv`;
    downloadFile(csv, filename, 'text/csv');
    toast.success('Data exported as CSV');
  };
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset this month? All data will be lost.')) {
      dispatch({ type: 'RESET_MONTH' });
      toast.success('Month reset successfully');
    }
  };
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-paper sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Main header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo and title */}
          <div className="flex items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight dark:text-white">
              DISCIPLINE
            </h1>
            {streak > 0 && (
              <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 
                            px-3 py-1 rounded-full">
                <span className="text-orange-500">🔥</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  {streak} day streak
                </span>
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Export dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 
                         dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 
                         dark:text-white text-sm"
              >
                <Download size={16} />
                Export
              </button>
              <div className="absolute right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg 
                            border border-gray-200 dark:border-gray-700 opacity-0 invisible 
                            group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button
                  onClick={handleExportJSON}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 
                           dark:hover:bg-gray-700 dark:text-white text-sm rounded-t-lg"
                >
                  Export as JSON
                </button>
                <button
                  onClick={handleExportCSV}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 
                           dark:hover:bg-gray-700 dark:text-white text-sm rounded-b-lg"
                >
                  Export as CSV
                </button>
              </div>
            </div>
            
            {/* Reset button */}
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 
                       dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 
                       dark:text-white text-sm"
              title="Reset month"
            >
              <RotateCcw size={16} />
            </button>
            
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 
                       dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 
                       dark:text-white"
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
        
        {/* Month navigation */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                     transition-colors dark:text-white"
            title="Previous month"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="text-center min-w-[200px]">
            <h2 className="text-xl md:text-2xl font-bold dark:text-white">
              {formatMonthYear(currentMonth, currentYear)}
            </h2>
            {!isViewingCurrentMonth && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Viewing past month (read-only for past dates)
              </p>
            )}
          </div>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                     transition-colors dark:text-white"
            title="Next month"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
