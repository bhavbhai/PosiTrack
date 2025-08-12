'use client';

import { FireIcon, HeartIcon, PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DashboardPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome back! 
            </span>
            <SparklesIcon className="inline-block w-10 h-10 ml-2 text-yellow-500" />
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
            {currentDate}
          </p>
        </motion.div>

        {/* Daily Motivation Section */}
        <motion.div 
          className="mb-12"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="border-blue-200/50 dark:border-blue-700/30 bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-900/30 dark:to-purple-900/30">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4">
                <HeartIcon className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Daily Motivation</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <blockquote className="text-lg md:text-xl italic text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">
                "Your journey of self-discovery is beautiful. Every small step you take toward positivity creates ripples of joy in your life. Keep shining! ✨"
              </blockquote>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Current Streak */}
          <motion.div variants={cardVariants} whileHover={{ scale: 1.02, y: -4 }}>
            <Card className="h-full">
              <CardHeader className="flex-row items-center space-y-0 pb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mr-4">
                  <FireIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Current Streak</CardTitle>
                  <CardDescription>days of positivity</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-purple-600 dark:text-purple-400 mb-4">7</div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Today's Mood */}
          <motion.div variants={cardVariants} whileHover={{ scale: 1.02, y: -4 }}>
            <Card className="h-full">
              <CardHeader className="flex-row items-center space-y-0 pb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mr-4">
                  <HeartIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Today's Mood</CardTitle>
                  <CardDescription>How are you feeling?</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-4">Not set yet</div>
                <Button variant="secondary" className="w-full">
                  Set Mood
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Action */}
          <motion.div variants={cardVariants} whileHover={{ scale: 1.02, y: -4 }}>
            <Card className="h-full">
              <CardHeader className="flex-row items-center space-y-0 pb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mr-4">
                  <PlusIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Quick Action</CardTitle>
                  <CardDescription>Start your day right</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="success" size="lg" className="w-full">
                  + New Reflection
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Reflections</CardTitle>
                <Button variant="link" className="p-0">
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: '2024-01-15', type: 'Good Thing', content: 'Had a wonderful coffee with my friend Sarah', color: 'from-yellow-400 to-orange-500' },
                  { date: '2024-01-14', type: 'Positive Thought', content: 'I am becoming more confident in my abilities', color: 'from-purple-400 to-pink-500' },
                  { date: '2024-01-13', type: 'Manifestation', content: 'I will find joy in small daily moments', color: 'from-green-400 to-emerald-500' },
                ].map((entry, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50/80 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50"
                    whileHover={{ scale: 1.01, x: 4 }}
                  >
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${entry.color} mt-2 flex-shrink-0`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100/80 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                          {entry.type}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{entry.date}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">{entry.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 