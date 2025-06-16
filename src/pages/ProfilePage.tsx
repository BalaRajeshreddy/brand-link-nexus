import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        console.log('Supabase getUser response:', { data, error });
        const user = data?.user;
        console.log('User object:', user);
        if (!user || typeof user !== 'object' || !('email' in user)) {
          console.log('Invalid user, redirecting to login');
          navigate('/login');
          return;
        }
        setUser(user);
        setName(user.user_metadata?.name || '');
        setEmail(user.email || '');
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleSave = async () => {
    try {
      setError(null);
      setSuccess(null);
      // Update user metadata (name)
      const { error: updateError } = await supabase.auth.updateUser({
        data: { name }
      });
      if (updateError) throw updateError;
      // Update email if changed
      if (email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email
        });
        if (emailError) throw emailError;
      }
      // Update password if provided
      if (password) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password
        });
        if (passwordError) throw passwordError;
      }
      setSuccess('Profile updated successfully');
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-lg">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow p-8">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mb-4">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <Input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <Input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            type="email"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">New Password</label>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            type="password"
          />
        </div>
        <Button className="w-full mt-4" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage; 