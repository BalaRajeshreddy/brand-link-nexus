
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface RegisterFormProps {
  userType: string;
}

export function RegisterForm({ userType }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const categories = [
    'Food & Beverages', 
    'Retail', 
    'Technology', 
    'Healthcare',
    'Education',
    'Entertainment',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Just simulating registration for now
    setTimeout(() => {
      toast.success(`Successfully registered as ${userType}`);
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
        <Label htmlFor="name">{userType === 'Brand' ? 'Brand Name' : 'Full Name'}</Label>
        <Input
          id="name"
          placeholder={userType === 'Brand' ? 'Your brand name' : 'John Doe'}
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
      
      {userType === 'Brand' && (
        <div className="space-y-2">
          <Label htmlFor="category">Business Category</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
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
        {isLoading ? "Creating Account..." : `Register as ${userType}`}
      </Button>
    </form>
  );
}
