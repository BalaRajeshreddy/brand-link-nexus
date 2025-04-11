import BrandProfileSection from '@/components/profile/BrandProfileSection';
import { useState } from 'react';

export default function BrandProfilePage() {
  const [activeSection, setActiveSection] = useState('basic');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Brand Profile</h1>
      <BrandProfileSection 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
    </div>
  );
} 