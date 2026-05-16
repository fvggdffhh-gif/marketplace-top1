import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create client if env vars are set
const isConfigured = !!(supabaseUrl && supabaseAnonKey && 
  supabaseUrl.startsWith('http') && 
  supabaseAnonKey.length > 10);

let _supabase: ReturnType<typeof createClient> | null = null;

export const getSupabase = () => {
  if (!_supabase && isConfigured) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
};

// Export supabase directly (will throw if used without env vars)
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    if (!isConfigured) {
      console.warn('Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
      return () => Promise.resolve({ data: null, error: new Error('Supabase not configured') });
    }
    if (!_supabase) {
      _supabase = createClient(supabaseUrl, supabaseAnonKey);
    }
    return (_supabase as any)[prop];
  }
});

export { isConfigured };
