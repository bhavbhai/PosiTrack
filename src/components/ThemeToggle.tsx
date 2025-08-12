'use client';

import { motion } from 'framer-motion';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    console.log('Before toggle - Current theme:', theme);
    console.log('Before toggle - HTML classList:', document.documentElement.classList.toString());
    
    try {
      toggleTheme();
      
      // Check after a short delay
      setTimeout(() => {
        console.log('After toggle - HTML classList:', document.documentElement.classList.toString());
        console.log('After toggle - Has dark class:', document.documentElement.classList.contains('dark'));
      }, 100);
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  console.log('ThemeToggle render - Current theme:', theme);

  return (
    <motion.button
      onClick={handleToggle}
      className="fixed top-6 right-6 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-3 shadow-xl border border-white/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        key={theme} // Force re-render when theme changes
        initial={{ rotate: 0, opacity: 0 }}
        animate={{ rotate: theme === 'dark' ? 180 : 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative w-6 h-6"
      >
        {theme === 'light' ? (
          <SunIcon className="w-6 h-6 text-yellow-500" />
        ) : (
          <MoonIcon className="w-6 h-6 text-blue-400" />
        )}
      </motion.div>
    </motion.button>
  );
} 