'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PencilSquareIcon, SparklesIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function NewEntryPage() {
  const [formData, setFormData] = useState({
    goodThing: '',
    positiveThought: '',
    affirmation: '',
    mood: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const moods = [
    { emoji: '😊', label: 'Happy', value: 'happy', color: 'from-yellow-400 to-orange-500' },
    { emoji: '😌', label: 'Peaceful', value: 'peaceful', color: 'from-green-400 to-emerald-500' },
    { emoji: '🥰', label: 'Grateful', value: 'grateful', color: 'from-pink-400 to-purple-500' },
    { emoji: '💪', label: 'Motivated', value: 'motivated', color: 'from-blue-400 to-cyan-500' },
    { emoji: '🌟', label: 'Inspired', value: 'inspired', color: 'from-purple-400 to-pink-500' },
    { emoji: '😴', label: 'Tired', value: 'tired', color: 'from-gray-400 to-slate-500' },
    { emoji: '😔', label: 'Down', value: 'down', color: 'from-indigo-400 to-blue-500' },
    { emoji: '😰', label: 'Anxious', value: 'anxious', color: 'from-orange-400 to-red-500' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to database
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="max-w-md mx-auto">
                <CardHeader className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto mb-4">
                    <CheckIcon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Entry Saved!</CardTitle>
                  <CardDescription>
                    Your positive reflection has been recorded. Keep up the great work! ✨
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="success" className="w-full" onClick={() => setIsSubmitted(false)}>
                    Add Another Entry
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                New Reflection
              </span>
              <SparklesIcon className="inline-block w-10 h-10 ml-2 text-yellow-500" />
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
              Take a moment to reflect on your day and capture the positivity
            </p>
          </motion.div>

          {/* Form */}
          <motion.form 
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Good Thing */}
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">✨</span>
                    </div>
                    One Good Thing
                  </CardTitle>
                  <CardDescription>
                    What's that one GOOD thing that happened with you today? 
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    type="text"
                    placeholder="I had a wonderful conversation with a friend..."
                    value={formData.goodThing}
                    onChange={(e) => setFormData({...formData, goodThing: e.target.value})}
                    required
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Positive Thought */}
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">💭</span>
                    </div>
                    Positive Thought
                  </CardTitle>
                  <CardDescription>
                    Share a POSITIVE thought about yourself that you think of! 
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    type="text"
                    placeholder="I'm becoming more confident in my abilities..."
                    value={formData.positiveThought}
                    onChange={(e) => setFormData({...formData, positiveThought: e.target.value})}
                    required
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Affirmation */}
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">🌟</span>
                    </div>
                    Manifestation or Goal
                  </CardTitle>
                  <CardDescription>
                    Write an affirmation or something you MANIFEST yourself to become!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    type="text"
                    placeholder="I view myself at my best self, confident and successful..."
                    value={formData.affirmation}
                    onChange={(e) => setFormData({...formData, affirmation: e.target.value})}
                    required
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Mood Selection */}
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">😊</span>
                    </div>
                    How Are You Feeling?
                  </CardTitle>
                  <CardDescription>
                    Select the emoji that best represents your current mood
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-3">
                    {moods.map((mood) => (
                      <motion.button
                        key={mood.value}
                        type="button"
                        onClick={() => setFormData({...formData, mood: mood.value})}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          formData.mood === mood.value
                            ? `border-transparent bg-gradient-to-r ${mood.color} text-white shadow-lg scale-105`
                            : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="text-2xl mb-1">{mood.emoji}</div>
                        <div className={`text-xs font-medium ${
                          formData.mood === mood.value ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {mood.label}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Submit Button */}
            <motion.div 
              variants={cardVariants}
              className="flex justify-center"
            >
              <Button 
                type="submit" 
                size="lg"
                className="min-w-[200px]"
                disabled={!formData.goodThing || !formData.positiveThought || !formData.affirmation || !formData.mood}
              >
                <PencilSquareIcon className="w-5 h-5 mr-2" />
                Save Reflection
              </Button>
            </motion.div>
          </motion.form>
        </div>
      </main>
    </div>
  );
} 