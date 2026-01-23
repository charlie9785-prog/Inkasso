import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = 'https://bosofhcunxbvfusvllsm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvc29maGN1bnhidmZ1c3ZsbHNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMzAwODksImV4cCI6MjA4NDYwNjA4OX0.JktnLgmno5up9aTKBhexRf0DPPZsFq1LnKrL5PHAINc';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'zylora-auth',
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
