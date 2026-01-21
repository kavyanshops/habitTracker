import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useTracker } from '../context/TrackerContext';
import { generateProgressData } from '../utils/calculations';
import { getDaysInMonthCount } from '../utils/dateUtils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const score = payload[0].value;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-semibold dark:text-white">Day {label}</p>
        <p className="text-lg font-bold" style={{ color: score >= 7 ? '#22c55e' : score >= 4 ? '#f59e0b' : '#ef4444' }}>
          Score: {score}/10
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {score >= 8 ? '🌟 Excellent!' : score >= 6 ? '👍 Good progress' : score >= 4 ? '💪 Keep pushing' : '🎯 Focus more'}
        </p>
      </div>
    );
  }
  return null;
};

export const ProgressChart: React.FC = () => {
  const { state } = useTracker();
  const { habits, currentMonth, currentYear } = state;
  
  const daysInMonth = useMemo(() => getDaysInMonthCount(currentMonth, currentYear), [currentMonth, currentYear]);
  const currentDay = Math.min(new Date().getDate(), daysInMonth);
  
  // Generate progress data
  const progressData = useMemo(() => {
    const data = generateProgressData(habits, daysInMonth);
    // Only show data up to current day
    return data.slice(0, currentDay);
  }, [habits, daysInMonth, currentDay]);
  
  // Calculate statistics
  const stats = useMemo(() => {
    if (progressData.length === 0) {
      return { average: 0, trend: 'neutral' as const, bestDay: 0, bestScore: 0 };
    }
    
    const scores = progressData.map(d => d.score);
    const average = Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1));
    
    // Calculate trend (last 7 days vs previous 7 days)
    let trend: 'up' | 'down' | 'neutral' = 'neutral';
    if (progressData.length >= 7) {
      const recent = progressData.slice(-7);
      const recentAvg = recent.reduce((a, b) => a + b.score, 0) / 7;
      
      if (progressData.length >= 14) {
        const previous = progressData.slice(-14, -7);
        const prevAvg = previous.reduce((a, b) => a + b.score, 0) / 7;
        trend = recentAvg > prevAvg + 0.5 ? 'up' : recentAvg < prevAvg - 0.5 ? 'down' : 'neutral';
      }
    }
    
    // Find best day
    const bestDayData = progressData.reduce((best, current) => 
      current.score > best.score ? current : best
    , { day: 0, score: 0 });
    
    return { 
      average, 
      trend, 
      bestDay: bestDayData.day, 
      bestScore: bestDayData.score 
    };
  }, [progressData]);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-paper p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold dark:text-white flex items-center gap-2">
          <span>📈</span> MY PROGRESS
        </h2>
        
        {/* Stats cards */}
        <div className="flex flex-wrap gap-3">
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Average</p>
            <p className="text-xl font-bold dark:text-white">{stats.average}<span className="text-sm font-normal">/10</span></p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Trend</p>
            <div className="flex items-center gap-1">
              {stats.trend === 'up' && <TrendingUp className="text-green-500" size={20} />}
              {stats.trend === 'down' && <TrendingDown className="text-red-500" size={20} />}
              {stats.trend === 'neutral' && <Minus className="text-gray-500" size={20} />}
              <span className={`font-bold ${
                stats.trend === 'up' ? 'text-green-500' : 
                stats.trend === 'down' ? 'text-red-500' : 
                'text-gray-500 dark:text-gray-400'
              }`}>
                {stats.trend === 'up' ? 'Rising' : stats.trend === 'down' ? 'Falling' : 'Stable'}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Best Day</p>
            <p className="text-xl font-bold dark:text-white">
              Day {stats.bestDay} <span className="text-sm font-normal text-green-500">({stats.bestScore})</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-64 md:h-80">
        {progressData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={progressData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e5e7eb" 
                className="dark:stroke-gray-700"
              />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[0, 10]} 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                ticks={[0, 2, 4, 6, 8, 10]}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine 
                y={7} 
                stroke="#22c55e" 
                strokeDasharray="5 5" 
                strokeOpacity={0.5}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#1f2937"
                strokeWidth={2.5}
                dot={{ fill: '#1f2937', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#1f2937', stroke: '#fff', strokeWidth: 2 }}
                className="dark:stroke-white"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <p className="text-lg">No data yet</p>
              <p className="text-sm">Start tracking your habits to see progress!</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Score guide */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          0-3: Needs Work
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          4-6: Improving
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          7-10: Excellent
        </span>
      </div>
    </div>
  );
};

export default ProgressChart;
