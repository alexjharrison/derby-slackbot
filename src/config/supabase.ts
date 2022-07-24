import { createClient } from '@supabase/supabase-js';

export const db = createClient(
  process.env.supabaseURL || '',
  process.env.supabaseKey || ''
);
