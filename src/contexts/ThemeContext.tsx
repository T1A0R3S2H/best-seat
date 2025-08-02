'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isNight: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [isNight, setIsNight] = useState(false);

  // Determine if it's night time (6 PM to 6 AM)
  const checkNightTime = () => {
    const hour = new Date().getHours();
    const isNightTime = hour >= 18 || hour < 6;
    setIsNight(isNightTime);
    
    // Auto-switch theme based on time
    if (isNightTime && theme === 'light') {
      setTheme('dark');
    } else if (!isNightTime && theme === 'dark') {
      setTheme('light');
    }
  };

  useEffect(() => {
    checkNightTime();
    const interval = setInterval(checkNightTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, isNight, toggleTheme }}>
      <motion.div
        className={`min-h-screen transition-colors duration-1000 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' 
            : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 text-gray-900'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 