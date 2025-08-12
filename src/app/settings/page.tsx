// earlier I was awaiting for ensuring whether the user was in DB or not, then turning authloading-false but now I am just fetching the data from the auth context(turning it false(KNOW THAT WE ARE LOGGED IN)) and then using that data to display the user information, DB ensure happens and takes its own time. 
// authLoading is a boolean that tells the app "Are we still checking if the user is logged in?"
// true = "Please wait, checking login status"
// false = "We know if you're logged in or not"
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Cog6ToothIcon, 
  UserCircleIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  TrashIcon, 
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  // All hooks must be declared first, before any conditional logic
  const { user, signOut, loading: authLoading } = useAuth();
  const supabase = createClient();
  const { theme, toggleTheme, mounted: themeMounted } = useTheme();
  const router = useRouter();
  
  // All useState hooks declared at the top
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    joinDate: ''
  });

  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyReport: true,
    motivationalMessages: false
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false); // Start as false

  // All useEffect hooks
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Load user data when component mounts
  useEffect(() => {
    // Don't fetch if we already have data
    if (userInfo.name && userInfo.email) {
      console.log('User data already loaded, skipping fetch');
      return;
    }

    // Don't fetch if no user or auth is loading
    if (!user || authLoading) {
      return;
    }

    console.log('Settings page - Starting data fetch for user:', user.id);
    setDataLoading(true);
    
    // Use auth data immediately as fallback - no database calls to prevent issues
    const fallbackData = {
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      joinDate: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : ''
    };
    
    // Set data immediately to prevent loading issues
    setUserInfo(fallbackData);
    setEditedName(fallbackData.name);
    setEditedEmail(fallbackData.email);
    setDataLoading(false);
    
    console.log('Settings page - User data loaded from auth');
  }, [user?.id, authLoading, userInfo.name, userInfo.email]);

  // NOW conditional rendering logic AFTER all hooks are declared
  // Simplified rendering - only wait for auth to load, then show content immediately
  console.log('Settings page render check:', { themeMounted, authLoading, user: !!user });

  if (authLoading) {
    console.log('Settings page: Auth is loading, showing spinner...');
    return (
      <div className="min-h-screen bg-white">
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading authentication...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    console.log('Settings page: No user, redirecting to login...');
    return (
      <div className="min-h-screen bg-white">
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Redirecting to login...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  console.log('Settings page: Rendering main content for user:', user.email);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Update user data in database
      const { error: dbError } = await supabase
        .from('User')
        .update({
          name: editedName,
          email: editedEmail
        })
        .eq('id', user.id);

      if (dbError) {
        console.error('Error updating user in database:', dbError);
        throw dbError;
      }

      // Also update user metadata in Supabase Auth (optional, for consistency)
      const { error: authError } = await supabase.auth.updateUser({
        data: { name: editedName }
      });

      if (authError) {
        console.warn('Could not update auth metadata:', authError);
        // Don't throw here since the database update succeeded
      }

      // Update local state
      setUserInfo({
        ...userInfo,
        name: editedName,
        email: editedEmail
      });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(userInfo.name);
    setEditedEmail(userInfo.email);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      toast.success('Signed out successfully!');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.'
    );
    
    if (!confirmed || !user) return;

    setLoading(true);
    try {
      // Call a server endpoint to handle account deletion
      // This is safer than doing it client-side
      const response = await fetch('/api/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      toast.success('Account deleted successfully. You will be redirected shortly.');
      
      // Sign out the user
      await signOut();
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const retryDataFetch = () => {
    // Re-trigger the useEffect by updating a dependency
    // This is a bit complex as we need to re-run the entire fetchUserData logic
    // For simplicity, we'll just set a flag to re-run the useEffect
    // A more robust solution would involve a global state or a custom hook
    // For now, we'll rely on the useEffect's dependency array to re-run
    console.log('Retrying data fetch...');
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-gray-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Settings
              </span>
              <SparklesIcon className="inline-block w-10 h-10 ml-2 text-yellow-500" />
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
              Manage your account, preferences, and app settings
            </p>
          </motion.div>

          {/* Error notification */}
          {/* This section is removed as per the new_code, as dataError is no longer declared */}

          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Profile Settings */}
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <UserCircleIcon className="w-5 h-5 text-white" />
                    </div>
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <UserCircleIcon className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{userInfo.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Member since {userInfo.joinDate ? new Date(userInfo.joinDate).toLocaleDateString() : 'Unknown'}
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Change Photo
                      </Button>
                    </div>
                  </div>

                  {/* Editable Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <Input
                        type="text"
                        value={isEditing ? editedName : userInfo.name}
                        onChange={(e) => setEditedName(e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={isEditing ? editedEmail : userInfo.email}
                        onChange={(e) => setEditedEmail(e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {isEditing ? (
                      <>
                        <Button onClick={handleSaveProfile} disabled={loading}>
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button variant="outline" onClick={handleCancelEdit} disabled={loading}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)} disabled={loading}>
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* App Preferences */}
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                      <Cog6ToothIcon className="w-5 h-5 text-white" />
                    </div>
                    App Preferences
                  </CardTitle>
                  <CardDescription>
                    Customize your PosiTrack experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Theme Setting */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                        {theme === 'light' ? (
                          <SunIcon className="w-4 h-4 text-white" />
                        ) : (
                          <MoonIcon className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Theme</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Current: {theme === 'light' ? 'Light' : 'Dark'} mode
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={toggleTheme}>
                      Switch to {theme === 'light' ? 'Dark' : 'Light'}
                    </Button>
                  </div>

                  {/* Data & Privacy */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">Data & Privacy</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Export my data</span>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Clear cache</span>
                        <Button variant="outline" size="sm">
                          Clear
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <BellIcon className="w-5 h-5 text-white" />
                    </div>
                    Notifications
                  </CardTitle>
                  <CardDescription>
                    Choose what notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, enabled]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {key === 'dailyReminder' && 'Get reminded to write your daily reflection'}
                            {key === 'weeklyReport' && 'Receive weekly progress summaries'}
                            {key === 'motivationalMessages' && 'Get inspiring quotes and messages'}
                          </p>
                        </div>
                        <Button
                          variant={enabled ? "default" : "outline"}
                          size="sm"
                          onClick={() => setNotifications(prev => ({
                            ...prev,
                            [key]: !prev[key as keyof typeof prev]
                          }))}
                        >
                          {enabled ? 'On' : 'Off'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Security */}
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full flex items-center justify-center">
                      <ShieldCheckIcon className="w-5 h-5 text-white" />
                    </div>
                    Security
                  </CardTitle>
                  <CardDescription>
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Change Password</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Update your account password
                        </p>
                      </div>
                      <Button variant="outline">
                        Change
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Add an extra layer of security
                        </p>
                      </div>
                      <Button variant="outline">
                        Enable
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Account Actions */}
            <motion.div variants={cardVariants}>
              <Card className="border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-red-700 dark:text-red-400">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                      <TrashIcon className="w-5 h-5 text-white" />
                    </div>
                    Account Actions
                  </CardTitle>
                  <CardDescription>
                    Manage your account status and data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Sign Out</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Sign out of your PosiTrack account
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleLogout} disabled={loading}>
                      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                      {loading ? 'Signing Out...' : 'Sign Out'}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                    <div>
                      <h3 className="font-medium text-red-700 dark:text-red-400">Delete Account</h3>
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button variant="destructive" onClick={handleDeleteAccount} disabled={loading}>
                      <TrashIcon className="w-4 h-4 mr-2" />
                      {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Support */}
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                  <CardDescription>
                    Get support or learn more about PosiTrack
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-auto py-4">
                      <div className="text-center">
                        <div className="text-2xl mb-2">📚</div>
                        <div className="font-medium">Help Center</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Browse articles</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-auto py-4">
                      <div className="text-center">
                        <div className="text-2xl mb-2">💬</div>
                        <div className="font-medium">Contact Support</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Get help</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-auto py-4">
                      <div className="text-center">
                        <div className="text-2xl mb-2">🌟</div>
                        <div className="font-medium">Feedback</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Share ideas</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}