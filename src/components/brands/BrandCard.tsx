import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, HeartOff, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BrandCardProps {
  brand: {
    id: string;
    name: string;
    logo: string;
    description: string;
    website?: string;
  };
  isSaved?: boolean;
  onSaveToggle?: (brandId: string) => void;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand, isSaved = false, onSaveToggle }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleSaveClick = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setIsDialogOpen(true);
      return;
    }

    if (onSaveToggle) {
      setIsSaving(true);
      try {
        await onSaveToggle(brand.id);
      } catch (error) {
        console.error('Error toggling save:', error);
        toast.error('Failed to update saved status');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSignIn = () => {
    setIsDialogOpen(false);
    navigate('/login');
  };

  const handleSignUp = () => {
    setIsDialogOpen(false);
    navigate('/signup');
  };

  return (
    <>
      <Card 
        className="overflow-hidden transition-all duration-300 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{brand.name}</h3>
                <p className="text-sm text-gray-500">{brand.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSaveClick}
              disabled={isSaving}
              className="transition-colors duration-200"
            >
              {isSaved ? (
                <Heart className="h-5 w-5 text-red-500" />
              ) : (
                <HeartOff className="h-5 w-5" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2">
            {isHovered && brand.website && (
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                Visit Website
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in to save brands</DialogTitle>
            <DialogDescription>
              Please sign in or create an account to save brands and access more features.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 mt-4">
            <Button onClick={handleSignIn} className="w-full">
              Sign In
            </Button>
            <Button onClick={handleSignUp} variant="outline" className="w-full">
              Create Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BrandCard; 