'use client';

import { useEffect, useState } from 'react';
import Navigation from './Navigation';

export default function ClientNavigation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render the Navigation after component is mounted on client
  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                PosiTrack
              </span>
            </div>
            {/* Placeholder for nav items during SSR */}
            <div className="flex items-center space-x-1">
              <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
            {/* Placeholder for profile section */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return <Navigation />;
} 