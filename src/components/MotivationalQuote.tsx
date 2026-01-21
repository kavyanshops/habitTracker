import React, { useState, useEffect, useMemo } from 'react';
import { QUOTES } from '../utils/constants';
import { Quote } from '../types';
import { RefreshCw, Quote as QuoteIcon } from 'lucide-react';

export const MotivationalQuote: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Get today's quote based on date
  const todaysQuote = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const index = dayOfYear % QUOTES.length;
    return QUOTES[index];
  }, []);
  
  useEffect(() => {
    setCurrentQuote(todaysQuote);
  }, [todaysQuote]);
  
  const handleRefresh = () => {
    setIsAnimating(true);
    
    // Get a random quote different from current
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * QUOTES.length);
    } while (QUOTES[newIndex] === currentQuote && QUOTES.length > 1);
    
    setTimeout(() => {
      setCurrentQuote(QUOTES[newIndex]);
      setIsAnimating(false);
    }, 300);
  };
  
  if (!currentQuote) return null;
  
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 
                    text-white rounded-xl p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 opacity-10">
        <QuoteIcon size={120} className="transform rotate-180" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2 text-gray-300">
            <span>💭</span> Daily Inspiration
          </h3>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Get new quote"
          >
            <RefreshCw 
              size={18} 
              className={`text-gray-400 ${isAnimating ? 'animate-spin' : ''}`} 
            />
          </button>
        </div>
        
        <blockquote className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          <p className="text-xl md:text-2xl font-medium leading-relaxed mb-4">
            "{currentQuote.text}"
          </p>
          <footer className="text-gray-400 text-sm">
            — {currentQuote.author}
          </footer>
        </blockquote>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-500/20 to-transparent rounded-full blur-2xl" />
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-2xl" />
    </div>
  );
};

export default MotivationalQuote;
