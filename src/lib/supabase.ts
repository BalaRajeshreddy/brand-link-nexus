import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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