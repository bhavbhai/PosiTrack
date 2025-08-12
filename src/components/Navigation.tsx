'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  PencilSquareIcon, 
  ChatBubbleLeftRightIcon, 
  PhotoIcon, 
  Cog6ToothIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid, 
  PencilSquareIcon as PencilSquareIconSolid, 
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid, 
  PhotoIcon as PhotoIconSolid, 
  Cog6ToothIcon as Cog6ToothIconSolid
} from '@heroicons/react/24/solid';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, iconSolid: HomeIconSolid, color: 'from-pink-500 to-purple-600' },
  { name: 'New Entry', href: '/new-entry', icon: PencilSquareIcon, iconSolid: PencilSquareIconSolid, color: 'from-green-500 to-emerald-600' },
  { name: 'PosiBot', href: '/chat', icon: ChatBubbleLeftRightIcon, iconSolid: ChatBubbleLeftRightIconSolid, color: 'from-blue-500 to-cyan-600' },
  { name: 'Wallpaper', href: '/wallpaper', icon: PhotoIcon, iconSolid: PhotoIconSolid, color: 'from-purple-500 to-pink-600' },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, iconSolid: Cog6ToothIconSolid, color: 'from-gray-500 to-slate-600' },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [rotationKey, setRotationKey] = useState(0);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              PosiTrack
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = isActive ? item.iconSolid : item.icon;
              
              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    className={`relative px-4 py-2 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{item.name}</span>
                    </div>
                    
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        layoutId="activeNav"
                        transition={{ type: "spring", duration: 0.6 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Profile Section */}
          <div className="flex items-center space-x-3">
                                {/* Theme Toggle */}
                    <motion.button
                      onClick={() => {
                        toggleTheme();
                        setRotationKey(prev => prev + 1);
                      }}
                      className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Toggle theme"
                    >
                      <motion.div
                        key={rotationKey} // Force re-render on every toggle
                        initial={{ rotate: 0, opacity: 0 }}
                        animate={{ rotate: 180, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="relative w-5 h-5"
                      >
                        {theme === 'light' ? (
                          <SunIcon className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <MoonIcon className="w-5 h-5 text-blue-400" />
                        )}
                      </motion.div>
                    </motion.button>
            
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
            
            {/* Profile */}
            <motion.button
              onClick={() => router.push('/settings')}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={user ? `${user.user_metadata?.name || user.email || 'User'} - Go to Settings` : 'Profile Settings'}
            >
              <div className="flex items-center space-x-2">
                <UserCircleIcon className="w-8 h-8 text-gray-600 dark:text-gray-300" />
                {user && (
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                )}
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
} 