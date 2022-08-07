import { createClient } from '@supabase/supabase-js';
import { Console } from 'console';

export const db = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);
