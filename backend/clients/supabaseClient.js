import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

let supabaseClientInstance; 

function getSupabaseClient() {
  if (!supabaseClientInstance) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    
    // Validate environment variables
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL and SUPABASE_KEY must be set in environment variables');
    }
    
    // Create client with service role options
    supabaseClientInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    });
    
    console.log('✅ Supabase client initialized');
    console.log('📍 URL:', supabaseUrl);
    console.log('🔑 Key type:', supabaseKey.substring(0, 20) + '...');
  }
  return supabaseClientInstance;
}

export {
    getSupabaseClient
};


