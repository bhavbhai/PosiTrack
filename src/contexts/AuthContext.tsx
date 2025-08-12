'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      console.log('AuthContext: Getting initial session...');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('AuthContext: Session result:', { session, error });
        
        if (error) {
          console.error('AuthContext: Session error:', error);
        }
        
        if (session?.user) {
          console.log('AuthContext: User found in session:', session.user);
          // Don't wait for ensureUserInDatabase - set user immediately
          setUser(session.user);
          // Run ensureUserInDatabase in background
          ensureUserInDatabase(session.user).catch(err => 
            console.error('Background user ensure failed:', err)
          );
        } else {
          console.log('AuthContext: No user in session');
          setUser(null);
        }
      } catch (error) {
        console.error('AuthContext: Error getting session:', error);
        setUser(null);
      } finally {
        console.log('AuthContext: Setting loading to false');
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthContext: Auth state change:', { event, session });
        
        if (session?.user && event === 'SIGNED_IN') {
          console.log('AuthContext: User signed in:', session.user);
          setUser(session.user);
          // Run ensureUserInDatabase in background
          ensureUserInDatabase(session.user).catch(err => 
            console.error('Background user ensure failed:', err)
          );
        } else {
          setUser(session?.user ?? null);
        }
        
        setLoading(false);
        
        if (event === 'SIGNED_IN') {
          router.push('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          router.push('/login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

    // Ensure user exists in database
  const ensureUserInDatabase = async (user: any) => {
    try {
      console.log('Ensuring user in database:', user.id, user.email);
      
      const { data: existingUser, error: fetchError } = await supabase
        .from('User')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code === 'PGRST116') {
        // User doesn't exist, create them
        const userData = {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email?.split('@')[0] || null,
          image: user.user_metadata?.avatar_url || null,
        };
        
        console.log('Creating user with data:', userData);
        
        const { data: newUser, error: insertError } = await supabase
          .from('User')
          .insert(userData)
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user in database:', insertError);
          
          // If it's a duplicate key error, the user already exists
          if (insertError.code === '23505') {
            console.log('User already exists (duplicate key), this is expected');
          }
        } else {
          console.log('User created successfully in database:', newUser);
        }
      } else if (existingUser) {
        console.log('User already exists in database:', existingUser);
      } else if (fetchError) {
        console.error('Error fetching user:', fetchError);
      }
    } catch (error) {
      console.error('Error ensuring user in database:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext: Attempting sign in with email:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log('AuthContext: Sign in result:', { data, error });
    return { error };
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
        },
      },
    });

    // If signup successful, ensure user is in database
    if (data.user && !error) {
      await ensureUserInDatabase(data.user);
    }

    return { error };
  };

  const signInWithGoogle = async () => {
    console.log('AuthContext: Attempting Google sign in...');
    console.log('AuthContext: Current origin:', window.location.origin);
    
    const redirectUrl = `${window.location.origin}/auth/callback`;
    console.log('AuthContext: Redirect URL:', redirectUrl);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    console.log('AuthContext: Google sign in result:', { data, error });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
