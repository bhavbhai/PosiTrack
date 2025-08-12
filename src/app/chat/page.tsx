'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon, SparklesIcon, HeartIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm PosiBot, your wellness companion. I'm here to support you on your journey of positivity and growth. How are you feeling today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponses = [
        "That's wonderful! Remember, every small step counts toward your wellness journey. What's one thing you're grateful for today?",
        "I hear you, and your feelings are completely valid. Sometimes the most powerful thing we can do is simply acknowledge where we are. You're being incredibly brave by sharing with me.",
        "It sounds like you're going through something meaningful. Remember that growth often comes from challenging moments. What's one small thing that brought you comfort today?",
        "Thank you for being so open with me. Your willingness to reflect and grow is truly inspiring. How can I support you right now?",
        "I love your perspective! Positivity is a practice, and you're doing great. What's one affirmation that resonates with you today?"
      ];

      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const suggestedMessages = [
    "I'm feeling anxious today",
    "Help me find motivation",
    "I need some encouragement",
    "Share a mindfulness tip"
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-cyan-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Chat with PosiBot
              </span>
              <SparklesIcon className="inline-block w-10 h-10 ml-2 text-yellow-500" />
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
              Your AI wellness companion for support, motivation, and mindfulness
            </p>
          </motion.div>

          {/* Chat Container */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b border-gray-200/50 dark:border-gray-700/50">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                  </div>
                  PosiBot
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </CardTitle>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.isUser ? 'order-1' : 'order-2'}`}>
                      {!message.isUser && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                            <HeartIcon className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">PosiBot</span>
                        </div>
                      )}
                      
                      <div
                        className={`p-4 rounded-2xl ${
                          message.isUser
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                            : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-gray-100'
                        } shadow-lg`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className={`text-xs mt-2 ${
                          message.isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      
                      {message.isUser && (
                        <div className="flex items-center justify-end gap-2 mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">You</span>
                          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">You</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[80%]">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                          <HeartIcon className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">PosiBot is typing...</span>
                      </div>
                      
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-4 rounded-2xl shadow-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input Area */}
              <div className="border-t border-gray-200/50 dark:border-gray-700/50 p-6">
                {/* Suggested Messages */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">Quick suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedMessages.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setInput(suggestion)}
                        className="text-xs"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="Share what's on your mind..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="px-4"
                  >
                    <PaperAirplaneIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Help Section */}
          <motion.div
            className="mt-8"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                    <HeartIcon className="w-4 h-4 text-white" />
                  </div>
                  How PosiBot Can Help
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Provide emotional support and encouragement</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Share mindfulness and wellness tips</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Help you process difficult emotions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Offer positive affirmations and motivation</span>
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