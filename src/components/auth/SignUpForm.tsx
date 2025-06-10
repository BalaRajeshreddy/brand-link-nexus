import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface SignUpFormProps {
  userType: string;
}

export function SignUpForm({ userType }: SignUpFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const checkEmailExists = async (email: string) => {
    // Check in brands table
    const { data: brandData, error: brandError } = await supabase
      .from('brands')
      .select('email')
      .eq('email', email)
      .single();

    if (brandData) {
      return { exists: true, type: 'brand' };
    }

    // Check in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (userData) {
      return { exists: true, type: 'user' };
    }

    return { exists: false };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First check if email exists in either table
      const emailCheck = await checkEmailExists(email);
      if (emailCheck.exists) {
        toast.error(`This email is already registered as a ${emailCheck.type}. Please use a different email address.`);
        setIsLoading(false);
        return;
      }

      // Try to sign in with the email to check if it exists in auth
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy-password-for-check'
      });

      // If there's no error or the error is not "Invalid login credentials",
      // it means the email exists in auth
      if (!signInError || signInError.message !== 'Invalid login credentials') {
        toast.error('This email is already registered. Please use a different email address.');
        setIsLoading(false);
        return;
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            userType: userType.toLowerCase()
          }
        }
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to create account');
      }

      // Create record in appropriate table
      if (userType.toLowerCase() === 'brand') {
        const { error: brandError } = await supabase
          .from('brands')
          .insert([
            {
              user_id: authData.user.id,
              name,
              email,
              created_at: new Date().toISOString()
            }
          ]);

        if (brandError) {
          // If brand creation fails, delete the auth user
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw brandError;
        }
      } else if (userType.toLowerCase() === 'customer') {
        const { error: userError } = await supabase
          .from('users')
          .insert([
            {
              user_id: authData.user.id,
              name,
              email,
              created_at: new Date().toISOString()
            }
          ]);

        if (userError) {
          // If user creation fails, delete the auth user
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw userError;
        }
      }

      toast.success(`Successfully created ${userType} account`);
      
      // Redirect based on user type
      const redirectPath = userType === 'Brand' 
        ? '/dashboard/brand' 
        : userType === 'Admin' 
          ? '/dashboard/admin' 
          : '/dashboard/user';
          
      navigate(redirectPath);
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="name@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : `Sign up as ${userType}`}
      </Button>
    </form>
  );
} 