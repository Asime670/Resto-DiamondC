// Supabase Client Helper
// If configured via .env.local, connects to your cloud database.
// Otherwise falls back to resilient local storage / in-memory store.

let supabase = null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseAnonKey) {
  try {
    const { createClient } = require('@supabase/supabase-js');
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('Supabase client failed to initialize, using local store:', err.message);
  }
}

export { supabase };
