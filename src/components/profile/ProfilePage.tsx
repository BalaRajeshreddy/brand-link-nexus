import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import BrandProfileSection from './BrandProfileSection';
import AdminProfileSection from './AdminProfileSection';
import CustomerProfileSection from './CustomerProfileSection';

type UserType = 'customer' | 'brand' | 'admin';

const ProfilePage: React.FC = () => {
  const [userType, setUserType] = useState<UserType>('customer');
  const [activeSection, setActiveSection] = useState<string>('basic');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        if (!session) {
          toast.error('You need to be logged in to view this page');
          navigate('/auth');
          return;
        }

        // Get user metadata which contains the userType
        const userType = session.user.user_metadata.userType?.toLowerCase() as UserType;
        if (userType) {
          setUserType(userType);
        } else {
          // Fallback to checking the role in the users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (userError) throw userError;
          if (userData) {
            setUserType(userData.role.toLowerCase() as UserType);
          }
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [navigate]);

  const renderProfileSection = () => {
    if (loading) {
      return <div className="text-center py-8">Loading profile...</div>;
    }

    switch (userType) {
      case 'customer':
        return <CustomerProfileSection />;
      case 'brand':
        return <BrandProfileSection activeSection={activeSection} onSectionChange={setActiveSection} />;
      case 'admin':
        return <AdminProfileSection />;
      default:
        return <div className="text-center py-8">No profile type found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Profile Management</h1>
            </div>
            {renderProfileSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 