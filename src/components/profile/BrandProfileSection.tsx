import React, { useState, useEffect } from 'react';
import { BrandProfile } from '@/types/profile';
import { supabase, setupStorageBuckets } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BrandProfileSectionProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const BrandProfileSection: React.FC<BrandProfileSectionProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const [profile, setProfile] = useState<BrandProfile>({
    basicInfo: {
      brandName: '',
      logo: '',
      tagline: '',
      description: '',
      brandVideo: '',
      missionVision: '',
      foundingYear: 0,
    },
    contactInfo: {
      email: '',
      phone: '',
      address: '',
    },
    socialLinks: {
      website: '',
      facebook: '',
      instagram: '',
      linkedin: '',
    },
    certifications: [],
    awards: [],
    campaigns: [],
    featuredProducts: [],
    newLaunchProducts: [],
    reviews: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Set up storage buckets
        await setupStorageBuckets();

        // Fetch user profile
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error('Please login to view your profile');
          return;
        }

        const { data, error } = await supabase
          .from('brands')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error initializing profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, productIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only JPEG, PNG, and WebP images are allowed');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        if (uploadError.message.includes('duplicate')) {
          toast.error('A file with this name already exists');
        } else {
          throw uploadError;
        }
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // Update profile with new image
      const newProducts = [...profile.featuredProducts];
      newProducts[productIndex] = {
        ...newProducts[productIndex],
        images: [...(newProducts[productIndex].images || []), publicUrl]
      };
      setProfile(prev => ({ ...prev, featuredProducts: newProducts }));
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to update your profile');
        return;
      }

      // Validate required fields
      if (!profile.basicInfo.brandName) {
        toast.error('Brand name is required');
        return;
      }

      if (!profile.contactInfo.email) {
        toast.error('Email is required');
        return;
      }

      // Update profile
      const { error } = await supabase
        .from('brands')
        .upsert({
          user_id: user.id,
          ...profile,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error updating profile:', error);
        if (error.code === '23505') {
          toast.error('A profile with this email already exists');
        } else {
          toast.error('Failed to update profile. Please try again.');
        }
        return;
      }

      toast.success('Profile updated successfully');
      
      // Update URL with brand name
      const brandSlug = profile.basicInfo.brandName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      window.history.pushState({}, '', `/brand/${brandSlug}`);
    } catch (error) {
      console.error('Error updating brand profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    setProfile((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof BrandProfile],
        [field]: value,
      },
    }));
  };

  const sections = [
    { id: 'basic', name: 'Basic Info' },
    { id: 'contact', name: 'Contact Info' },
    { id: 'social', name: 'Social Links' },
    { id: 'certifications', name: 'Certifications' },
    { id: 'awards', name: 'Awards' },
    { id: 'campaigns', name: 'Campaigns' },
    { id: 'products', name: 'Products' },
    { id: 'reviews', name: 'Reviews' },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'basic':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Brand Name</label>
                <input
                  type="text"
                  name="basicInfo.brandName"
                  value={profile.basicInfo.brandName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 block w-full"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Tagline</label>
                <input
                  type="text"
                  name="basicInfo.tagline"
                  value={profile.basicInfo.tagline}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="basicInfo.description"
                  value={profile.basicInfo.description}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Brand Video</label>
                <input
                  type="file"
                  accept="video/*"
                  className="mt-1 block w-full"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Mission & Vision</label>
                <textarea
                  name="basicInfo.missionVision"
                  value={profile.basicInfo.missionVision}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Founding Year</label>
                <input
                  type="number"
                  name="basicInfo.foundingYear"
                  value={profile.basicInfo.foundingYear}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Contact Information</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="contactInfo.email"
                  value={profile.contactInfo.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="contactInfo.phone"
                  value={profile.contactInfo.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Physical Address</label>
                <textarea
                  name="contactInfo.address"
                  value={profile.contactInfo.address}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );
      case 'social':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Social Links</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input
                  type="url"
                  name="socialLinks.website"
                  value={profile.socialLinks.website}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Facebook</label>
                <input
                  type="url"
                  name="socialLinks.facebook"
                  value={profile.socialLinks.facebook}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Instagram</label>
                <input
                  type="url"
                  name="socialLinks.instagram"
                  value={profile.socialLinks.instagram}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                <input
                  type="url"
                  name="socialLinks.linkedin"
                  value={profile.socialLinks.linkedin}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );
      case 'certifications':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Certifications</h3>
            <div className="space-y-4">
              {profile.certifications.map((cert, index) => (
                <div key={index} className="grid grid-cols-1 gap-6 sm:grid-cols-2 border p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Certification Name</label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => {
                        const newCerts = [...profile.certifications];
                        newCerts[index] = { ...cert, name: e.target.value };
                        setProfile(prev => ({ ...prev, certifications: newCerts }));
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Issuing Organization</label>
                    <input
                      type="text"
                      value={cert.issuingOrganization}
                      onChange={(e) => {
                        const newCerts = [...profile.certifications];
                        newCerts[index] = { ...cert, issuingOrganization: e.target.value };
                        setProfile(prev => ({ ...prev, certifications: newCerts }));
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={cert.description}
                      onChange={(e) => {
                        const newCerts = [...profile.certifications];
                        newCerts[index] = { ...cert, description: e.target.value };
                        setProfile(prev => ({ ...prev, certifications: newCerts }));
                      }}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setProfile(prev => ({
                  ...prev,
                  certifications: [...prev.certifications, { name: '', issuingOrganization: '', description: '' }]
                }))}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                Add Certification
              </button>
            </div>
          </div>
        );
      case 'awards':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Awards</h3>
            <div className="space-y-4">
              {profile.awards.map((award, index) => (
                <div key={index} className="grid grid-cols-1 gap-6 sm:grid-cols-2 border p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Award Name</label>
                    <input
                      type="text"
                      value={award.name}
                      onChange={(e) => {
                        const newAwards = [...profile.awards];
                        newAwards[index] = { ...award, name: e.target.value };
                        setProfile(prev => ({ ...prev, awards: newAwards }));
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Year Received</label>
                    <input
                      type="number"
                      value={award.year}
                      onChange={(e) => {
                        const newAwards = [...profile.awards];
                        newAwards[index] = { ...award, year: parseInt(e.target.value) };
                        setProfile(prev => ({ ...prev, awards: newAwards }));
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={award.description}
                      onChange={(e) => {
                        const newAwards = [...profile.awards];
                        newAwards[index] = { ...award, description: e.target.value };
                        setProfile(prev => ({ ...prev, awards: newAwards }));
                      }}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setProfile(prev => ({
                  ...prev,
                  awards: [...prev.awards, { name: '', year: new Date().getFullYear(), description: '' }]
                }))}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                Add Award
              </button>
            </div>
          </div>
        );
      case 'campaigns':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Campaigns</h3>
            <div className="space-y-4">
              {profile.campaigns.map((campaign, index) => (
                <div key={index} className="grid grid-cols-1 gap-6 sm:grid-cols-2 border p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Campaign Name</label>
                    <input
                      type="text"
                      value={campaign.name}
                      onChange={(e) => {
                        const newCampaigns = [...profile.campaigns];
                        newCampaigns[index] = { ...campaign, name: e.target.value };
                        setProfile(prev => ({ ...prev, campaigns: newCampaigns }));
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      value={campaign.startDate}
                      onChange={(e) => {
                        const newCampaigns = [...profile.campaigns];
                        newCampaigns[index] = { ...campaign, startDate: e.target.value };
                        setProfile(prev => ({ ...prev, campaigns: newCampaigns }));
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                      type="date"
                      value={campaign.endDate}
                      onChange={(e) => {
                        const newCampaigns = [...profile.campaigns];
                        newCampaigns[index] = { ...campaign, endDate: e.target.value };
                        setProfile(prev => ({ ...prev, campaigns: newCampaigns }));
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={campaign.description}
                      onChange={(e) => {
                        const newCampaigns = [...profile.campaigns];
                        newCampaigns[index] = { ...campaign, description: e.target.value };
                        setProfile(prev => ({ ...prev, campaigns: newCampaigns }));
                      }}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setProfile(prev => ({
                  ...prev,
                  campaigns: [...prev.campaigns, { name: '', startDate: '', endDate: '', description: '' }]
                }))}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                Add Campaign
              </button>
            </div>
          </div>
        );
      case 'products':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Products</h3>
            <div className="space-y-4">
              {profile.featuredProducts.map((product, index) => (
                <div key={index} className="grid grid-cols-1 gap-6 sm:grid-cols-2 border p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => {
                        const newProducts = [...profile.featuredProducts];
                        newProducts[index] = { ...product, name: e.target.value };
                        setProfile(prev => ({ ...prev, featuredProducts: newProducts }));
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) => {
                        const newProducts = [...profile.featuredProducts];
                        newProducts[index] = { ...product, price: parseFloat(e.target.value) };
                        setProfile(prev => ({ ...prev, featuredProducts: newProducts }));
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={product.description}
                      onChange={(e) => {
                        const newProducts = [...profile.featuredProducts];
                        newProducts[index] = { ...product, description: e.target.value };
                        setProfile(prev => ({ ...prev, featuredProducts: newProducts }));
                      }}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Product Images</label>
                    <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {product.images?.map((image, imgIndex) => (
                        <div key={imgIndex} className="relative aspect-square">
                          <img
                            src={image}
                            alt={`Product image ${imgIndex + 1}`}
                            className="absolute inset-0 w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
                      className="mt-2 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setProfile(prev => ({
                  ...prev,
                  featuredProducts: [...prev.featuredProducts, { name: '', price: 0, description: '', images: [] }]
                }))}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                Add Product
              </button>
            </div>
          </div>
        );
      case 'reviews':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Reviews</h3>
            <div className="space-y-4">
              {profile.reviews.map((review, index) => (
                <div key={index} className="grid grid-cols-1 gap-6 sm:grid-cols-2 border p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                    <input
                      type="text"
                      value={review.customerName}
                      onChange={(e) => {
                        const newReviews = [...profile.reviews];
                        newReviews[index] = { ...review, customerName: e.target.value };
                        setProfile(prev => ({ ...prev, reviews: newReviews }));
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rating</label>
                    <select
                      value={review.rating}
                      onChange={(e) => {
                        const newReviews = [...profile.reviews];
                        newReviews[index] = { ...review, rating: parseInt(e.target.value) };
                        setProfile(prev => ({ ...prev, reviews: newReviews }));
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="1">1 Star</option>
                      <option value="2">2 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="5">5 Stars</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Review Text</label>
                    <textarea
                      value={review.text}
                      onChange={(e) => {
                        const newReviews = [...profile.reviews];
                        newReviews[index] = { ...review, text: e.target.value };
                        setProfile(prev => ({ ...prev, reviews: newReviews }));
                      }}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setProfile(prev => ({
                  ...prev,
                  reviews: [...prev.reviews, { customerName: '', rating: 5, text: '' }]
                }))}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                Add Review
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Brand Profile</h2>
        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-full text-left px-4 py-2 rounded-md ${
                activeSection === section.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {section.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderSection()}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandProfileSection; 