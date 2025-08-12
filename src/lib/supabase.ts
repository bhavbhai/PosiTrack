import { createBrowserClient } from '@supabase/ssr'

// For client components
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:', {
      url: supabaseUrl ? 'Set' : 'Missing',
      key: supabaseAnonKey ? 'Set' : 'Missing'
    });
  }
  
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}

// Simple client export for convenience
export const supabase = createClient() 