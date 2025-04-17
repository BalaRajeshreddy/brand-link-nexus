
import { createClient } from '@supabase/supabase-js';

// Use direct values from .env since we're in a Vite app
// Vite exposes environment variables on import.meta.env instead of process.env
const supabaseUrl = 'https://cbjbnfcmzkkubkklqqlc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiamJuZmNtemtrdWJra2xxcWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNTgzMDIsImV4cCI6MjA1OTgzNDMwMn0.pOfIG_TkxLsajAGAPSYTD6395akldm_enPrvGIg1NKQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get user session
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

// Helper function to get user profile
export const getUserProfile = async () => {
  const session = await getSession();
  if (!session) return null;

  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error) throw error;
  return profile;
};

// Helper function to get user role-specific profile
export const getUserRoleProfile = async () => {
  const session = await getSession();
  if (!session) return null;

  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (!user) return null;

  switch (user.role) {
    case 'CUSTOMER':
      const { data: customerProfile } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      return customerProfile;

    case 'BRAND':
      const { data: brandProfile } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      return brandProfile;

    case 'ADMIN':
      const { data: adminProfile } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      return adminProfile;

    default:
      return null;
  }
};
