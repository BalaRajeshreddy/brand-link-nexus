
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface LoginFormProps {
  userType: string;
}

export function LoginForm({ userType }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Just simulating authentication for now
    setTimeout(() => {
      toast.success(`Successfully logged in as ${userType}`);
      setIsLoading(false);
      
      // In a real implementation, we would use Supabase authentication here
      // and redirect to the appropriate dashboard
      const redirectPath = userType === 'Brand' 
        ? '/dashboard/brand' 
        : userType === 'Admin' 
          ? '/dashboard/admin' 
          : '/dashboard/user';
          
      window.location.href = redirectPath;
    }, 1000);
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
