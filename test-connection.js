import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('users').select('count');
    
    if (error) {
      console.error('Connection error:', error);
      return;
    }
    
    console.log('Connection successful! 🎉');
    console.log('Data:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testConnection(); 