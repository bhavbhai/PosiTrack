'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Update isDark state when component mounts or theme changes
    const updateDarkState = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    updateDarkState();
    
    // Watch for class changes on the html element
    const observer = new MutationObserver(updateDarkState);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  const testDarkMode = () => {
    const html = document.documentElement;
    const currentlyDark = html.classList.contains('dark');
    
    if (currentlyDark) {
      html.classList.remove('dark');
      console.log('Removed dark class manually');
    } else {
      html.classList.add('dark');
      console.log('Added dark class manually');
    }
    
    console.log('HTML classList after manual toggle:', html.classList.toString());
    console.log('Document body background color:', window.getComputedStyle(document.body).backgroundColor);
    console.log('Main element background color:', window.getComputedStyle(document.querySelector('main')).backgroundColor);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <main className="min-h-screen p-8">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to PosiTrack
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Your digital wellness journal
            </p>
          </div>
          
          {/* Test buttons section */}
          <div className="bg-yellow-100 dark:bg-yellow-900 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-200 mb-4">
              Dark Mode Tests
            </h2>
            
            <div className="space-y-4">
              <button 
                onClick={testDarkMode}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-lg"
              >
                🔴 Manual Dark Mode Toggle (Check Console)
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Test Box 1</h3>
                  <p className="text-gray-600 dark:text-gray-400">Should be light gray → dark gray</p>
                </div>
                
                <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Test Box 2</h3>
                  <p className="text-blue-600 dark:text-blue-400">Should be light blue → dark blue</p>
                </div>
              </div>
              
              {/* Safe inline style test - no SSR issues */}
              <div 
                className="p-4 rounded transition-all duration-300 bg-gray-200 dark:bg-gray-700"
              >
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Tailwind Dark Mode Test
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Current theme state: {isDark ? 'Dark' : 'Light'} mode
                </p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="text-center space-y-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Navigate to App Pages
              </h3>
              <div className="space-y-3">
                <a 
                  href="/dashboard" 
                  className="block bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  📊 Dashboard
                </a>
                <a 
                  href="/new-entry" 
                  className="block bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  ✍️ New Entry
                </a>
                <a 
                  href="/chat" 
                  className="block bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  💬 Chat
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
