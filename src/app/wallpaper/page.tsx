'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PhotoIcon, SparklesIcon, ArrowDownTrayIcon, PaintBrushIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface GeneratedWallpaper {
  id: number;
  imageUrl: string;
  prompt: string;
  createdAt: Date;
}

export default function WallpaperPage() {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentWallpaper, setCurrentWallpaper] = useState<GeneratedWallpaper | null>(null);
  const [wallpaperHistory, setWallpaperHistory] = useState<GeneratedWallpaper[]>([
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      prompt: 'Peaceful mountain landscape with positive energy',
      createdAt: new Date(Date.now() - 86400000)
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
      prompt: 'Serene ocean waves with inspirational quotes',
      createdAt: new Date(Date.now() - 172800000)
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
      prompt: 'Magical forest with motivational energy',
      createdAt: new Date(Date.now() - 259200000)
    }
  ]);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setIsGenerating(true);

    // Simulate API call
    setTimeout(() => {
      const newWallpaper: GeneratedWallpaper = {
        id: Date.now(),
        imageUrl: `https://images.unsplash.com/photo-${Date.now()}?w=800&h=600&fit=crop&sig=${Math.random()}`,
        prompt: input,
        createdAt: new Date()
      };

      setCurrentWallpaper(newWallpaper);
      setWallpaperHistory(prev => [newWallpaper, ...prev]);
      setIsGenerating(false);
    }, 3000);
  };

  const handleDownload = (wallpaper: GeneratedWallpaper) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = wallpaper.imageUrl;
    link.download = `positrackk-wallpaper-${wallpaper.id}.jpg`;
    link.click();
  };

  const suggestedPrompts = [
    "Peaceful sunrise with positive affirmations",
    "Minimalist zen garden with calming colors",
    "Cosmic space with inspirational quotes",
    "Watercolor flowers with motivational text",
    "Mountain peaks with success mantras",
    "Ocean waves with gratitude messages"
  ];

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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                AI Wallpaper Generator
              </span>
              <SparklesIcon className="inline-block w-10 h-10 ml-2 text-yellow-500" />
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
              Create beautiful, personalized wallpapers from your affirmations and positive thoughts
            </p>
          </motion.div>

          {/* Generator Section */}
          <motion.div
            className="mb-12"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <PaintBrushIcon className="w-5 h-5 text-white" />
                  </div>
                  Generate Your Wallpaper
                </CardTitle>
                <CardDescription>
                  Describe your ideal wallpaper or use one of our suggested prompts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Input Section */}
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="Describe your perfect wallpaper..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1"
                    disabled={isGenerating}
                  />
                  <Button
                    onClick={handleGenerate}
                    disabled={!input.trim() || isGenerating}
                    className="px-6"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <PaintBrushIcon className="w-4 h-4 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>

                {/* Suggested Prompts */}
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">Suggested prompts:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {suggestedPrompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setInput(prompt)}
                        className="text-left justify-start h-auto py-3 px-4"
                        disabled={isGenerating}
                      >
                        <span className="text-xs leading-relaxed">{prompt}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Current Generation */}
          {(currentWallpaper || isGenerating) && (
            <motion.div
              className="mb-12"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Latest Generation</CardTitle>
                </CardHeader>
                <CardContent>
                  {isGenerating ? (
                    <div className="aspect-video bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900 to-pink-900 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-purple-700 dark:text-purple-300 font-medium">Creating your perfect wallpaper...</p>
                        <p className="text-purple-600 dark:text-purple-400 text-sm mt-1">This may take a few moments</p>
                      </div>
                    </div>
                  ) : currentWallpaper && (
                    <div className="space-y-4">
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={currentWallpaper.imageUrl}
                          alt={currentWallpaper.prompt}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-white font-medium mb-2">"{currentWallpaper.prompt}"</p>
                          <p className="text-white/80 text-sm">Generated {currentWallpaper.createdAt.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                                                 <Button onClick={() => handleDownload(currentWallpaper)} className="flex-1">
                           <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                           Download HD
                         </Button>
                        <Button variant="secondary" onClick={() => setInput(currentWallpaper.prompt)}>
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* History Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <PhotoIcon className="w-4 h-4 text-white" />
                    </div>
                    Your Wallpaper Gallery
                  </CardTitle>
                  <CardDescription>
                    Browse and download your previously generated wallpapers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {wallpaperHistory.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wallpaperHistory.map((wallpaper) => (
                        <motion.div
                          key={wallpaper.id}
                          variants={cardVariants}
                          whileHover={{ scale: 1.02, y: -4 }}
                          className="group cursor-pointer"
                        >
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg">
                            <img
                              src={wallpaper.imageUrl}
                              alt={wallpaper.prompt}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            {/* Overlay Content */}
                            <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="text-white space-y-2">
                                <p className="font-medium text-sm line-clamp-2">"{wallpaper.prompt}"</p>
                                <p className="text-white/80 text-xs">
                                  {wallpaper.createdAt.toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            {/* Action Button */}
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                             <Button
                                 size="sm"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   handleDownload(wallpaper);
                                 }}
                                 className="bg-white/90 hover:bg-white text-gray-900 shadow-lg"
                               >
                                 <ArrowDownTrayIcon className="w-3 h-3" />
                               </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <PhotoIcon className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 font-medium">No wallpapers generated yet</p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm">Create your first wallpaper to get started!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Tips Section */}
          <motion.div
            className="mt-8"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <SparklesIcon className="w-4 h-4 text-white" />
                  </div>
                  Tips for Better Wallpapers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Be specific with colors and mood (e.g., "soft pastels, calming")</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Include your favorite affirmations or quotes</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Mention the style you prefer (minimalist, nature, abstract)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Try different times of day (sunrise, golden hour, night sky)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 