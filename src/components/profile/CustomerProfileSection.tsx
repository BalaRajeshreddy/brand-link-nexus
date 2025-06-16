import React, { useState, useEffect } from 'react';
import { CustomerProfile } from '@/types/profile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Heart, HeartOff, ExternalLink } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
}

const CustomerProfileSection: React.FC = () => {
  const [profile, setProfile] = useState<CustomerProfile>({
    firstName: '',
    lastName: '',
    age: 0,
    gender: '',
    mobileNumber: '',
    email: '',
  });
  const [savedBrands, setSavedBrands] = useState<Brand[]>([]);
  const [recentlyViewedBrands, setRecentlyViewedBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get name from user metadata
        const fullName = user.user_metadata.name || '';
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Fetch customer profile
        const { data: profileData, error: profileError } = await supabase
          .from('customer_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        if (profileData) {
          setProfile({
            firstName: profileData.first_name || firstName,
            lastName: profileData.last_name || lastName,
            age: profileData.age || 0,
            gender: profileData.gender || '',
            mobileNumber: profileData.mobile_number || '',
            email: user.email || '',
          });

          // Fetch saved brands
          if (profileData.saved_brands?.length > 0) {
            const { data: brands } = await supabase
              .from('brands')
              .select('id, name, logo, description')
              .in('id', profileData.saved_brands);
            
            if (brands) setSavedBrands(brands);
          }

          // Fetch recently viewed brands
          if (profileData.recently_viewed_brands?.length > 0) {
            const { data: brands } = await supabase
              .from('brands')
              .select('id, name, logo, description')
              .in('id', profileData.recently_viewed_brands);
            
            if (brands) setRecentlyViewedBrands(brands);
          }
        } else {
          setProfile({
            firstName,
            lastName,
            age: 0,
            gender: '',
            mobileNumber: '',
            email: user.email || '',
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to update your profile');
        return;
      }

      // Update user metadata with new name
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          name: `${profile.firstName} ${profile.lastName}`.trim()
        }
      });

      if (updateError) throw updateError;

      // Update profile in the database
      const { error: profileError } = await supabase
        .from('customer_profiles')
        .upsert({
          user_id: user.id,
          first_name: profile.firstName,
          last_name: profile.lastName,
          age: profile.age,
          gender: profile.gender,
          mobile_number: profile.mobileNumber,
          email: profile.email,
          saved_brands: savedBrands.map(brand => brand.id),
          recently_viewed_brands: recentlyViewedBrands.map(brand => brand.id)
        });

      if (profileError) throw profileError;

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value,
    }));
  };

  const toggleSaveBrand = async (brand: Brand) => {
    try {
      const isSaved = savedBrands.some(b => b.id === brand.id);
      const newSavedBrands = isSaved
        ? savedBrands.filter(b => b.id !== brand.id)
        : [...savedBrands, brand];

      setSavedBrands(newSavedBrands);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('customer_profiles')
        .update({
          saved_brands: newSavedBrands.map(b => b.id)
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success(isSaved ? 'Brand removed from saved' : 'Brand saved successfully');
    } catch (error) {
      console.error('Error toggling brand save:', error);
      toast.error('Failed to update saved brands');
      // Revert the state if there was an error
      setSavedBrands(savedBrands);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Profile Information</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                type="number"
                id="age"
                name="age"
                value={profile.age}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={profile.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email ID</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                className="bg-gray-50 cursor-not-allowed"
                disabled
                readOnly
              />
              <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">
              Save Profile
            </Button>
          </div>
        </form>
      </div>

      {/* Saved Brands Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Saved Brands</h2>
        {savedBrands.length === 0 ? (
          <p className="text-gray-500">No saved brands yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedBrands.map((brand) => (
              <Card key={brand.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {brand.logo && (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-medium">{brand.name}</h3>
                      <p className="text-sm text-gray-500">{brand.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleSaveBrand(brand)}
                  >
                    <Heart className="h-5 w-5 text-red-500" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recently Viewed Brands Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Recently Viewed Brands</h2>
        {recentlyViewedBrands.length === 0 ? (
          <p className="text-gray-500">No recently viewed brands</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyViewedBrands.map((brand) => (
              <Card key={brand.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {brand.logo && (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-medium">{brand.name}</h3>
                      <p className="text-sm text-gray-500">{brand.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleSaveBrand(brand)}
                  >
                    {savedBrands.some(b => b.id === brand.id) ? (
                      <Heart className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartOff className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProfileSection; 