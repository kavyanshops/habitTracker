import React from 'react';
import { Toaster } from 'react-hot-toast';
import { TrackerProvider } from './context/TrackerContext';
import Header from './components/Header';
import HabitGrid from './components/HabitGrid';
import ProgressChart from './components/ProgressChart';
import LevelDisplay from './components/LevelDisplay';
import MoodTracker from './components/MoodTracker';
import ScreenTimeCard from './components/ScreenTimeCard';
import MonthlyReport from './components/MonthlyReport';
import StreakCounter from './components/StreakCounter';
import MotivationalQuote from './components/MotivationalQuote';
import TodaySummary from './components/TodaySummary';

const App: React.FC = () => {
  return (
    <TrackerProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 grid-pattern transition-colors duration-300">
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1f2937',
              color: '#fff',
              fontWeight: 500,
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        {/* Header */}
        <Header />
        
        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* Top row - Quote and Today Summary */}
          <div className="grid lg:grid-cols-2 gap-6">
            <MotivationalQuote />
            <TodaySummary />
          </div>
          
          {/* Habit Grid - Full width */}
          <HabitGrid />
          
          {/* Second row - Progress and Level */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProgressChart />
            </div>
            <div className="space-y-6">
              <LevelDisplay />
            </div>
          </div>
          
          {/* Third row - Streak Counter */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StreakCounter />
            <div className="md:col-span-1 lg:col-span-2">
              <MoodTracker />
            </div>
          </div>
          
          {/* Fourth row - Screen Time */}
          <ScreenTimeCard />
          
          {/* Monthly Report */}
          <MonthlyReport />
          
          {/* Footer */}
          <footer className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
            <p>Built with discipline 💪</p>
            <p className="mt-1">
              Track your habits. Build your future.
            </p>
          </footer>
        </main>
      </div>
    </TrackerProvider>
  );
};

export default App;
