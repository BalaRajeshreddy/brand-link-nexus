import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  userType: string;
}

export function LoginForm({ userType }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Authentication failed');
      }

      // Validate user exists in the appropriate table based on userType
      if (userType.toLowerCase() === 'brand') {
        const { data: brandData, error: brandError } = await supabase
          .from('brands')
          .select('id')
          .eq('email', email)
          .single();

        if (brandError || !brandData) {
          await supabase.auth.signOut();
          throw new Error('No brand account found with this email');
        }
      } else if (userType.toLowerCase() === 'customer') {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('email', email)
          .single();

        if (userError || !userData) {
          await supabase.auth.signOut();
          throw new Error('No user account found with this email');
        }
      }

      toast.success(`Successfully logged in as ${userType}`);
      
      // Redirect based on user type
      const redirectPath = userType === 'Brand' 
        ? '/dashboard/brand' 
        : userType === 'Admin' 
          ? '/dashboard/admin' 
          : '/dashboard/user';
          
      navigate(redirectPath);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error instanceof Error ? error.message : "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="text-sm text-right">
        <a href="#" className="text-primary hover:underline">
          Forgot password?
        </a>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in..." : `Login as ${userType}`}
      </Button>
    </form>
  );
}
