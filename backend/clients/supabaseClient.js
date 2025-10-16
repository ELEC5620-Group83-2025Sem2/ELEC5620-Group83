import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

let supabaseClientInstance; 

export function getSupabaseClient() {
  if (!supabaseClientInstance) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    supabaseClientInstance = createClient(
        supabaseUrl, 
        supabaseKey
    );
  }
  return supabaseClientInstance;
}

module.exports = {
    getSupabaseClient,
    supabase: getSupabaseClient(),
};


