'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Auth callback: Starting...');
        console.log('Auth callback: URL params:', Object.fromEntries(searchParams.entries()));
        
        // Check if there are any error parameters
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (error) {
          console.error('Auth callback error from URL:', { error, errorDescription });
          router.push(`/login?error=${error}&description=${errorDescription}`);
          return;
        }

        // Try to get the session
        console.log('Auth callback: Getting session...');
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        console.log('Auth callback: Session result:', { data, sessionError });
        
        if (sessionError) {
          console.error('Auth callback session error:', sessionError);
          router.push('/login?error=session_error');
          return;
        }

        if (data.session) {
          console.log('Auth callback successful, session found:', data.session);
          console.log('Auth callback: User:', data.session.user);
          router.push('/dashboard');
        } else {
          console.log('Auth callback: no session found, trying to refresh...');
          
          // Try to refresh the session
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          console.log('Auth callback: Refresh result:', { refreshData, refreshError });
          
          if (refreshData.session) {
            console.log('Auth callback: Session refreshed successfully:', refreshData.session);
            router.push('/dashboard');
            return;
          }
          
          // Try to get the user directly
          const { data: userData, error: userError } = await supabase.auth.getUser();
          console.log('Auth callback: User check:', { userData, userError });
          
          if (userData.user) {
            console.log('Auth callback: User found but no session, forcing redirect:', userData.user);
            // Force a page reload to trigger AuthContext to pick up the user
            window.location.href = '/dashboard';
          } else {
            console.log('Auth callback: No user found, redirecting to login');
            router.push('/login?error=no_session');
          }
        }
      } catch (error) {
        console.error('Auth callback exception:', error);
        router.push('/login?error=callback_exception');
      }
    };

    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('Auth callback: Timeout reached, forcing redirect to dashboard');
      window.location.href = '/dashboard';
    }, 10000); // 10 seconds timeout

    handleAuthCallback();

    return () => clearTimeout(timeout);
  }, [router, supabase.auth, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing sign in...</h2>
        <p className="text-gray-600">Please wait while we set up your session.</p>
        <p className="text-sm text-gray-500 mt-2">Check the browser console for details.</p>
      </div>
    </div>
  );
} 