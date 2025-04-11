export interface CustomerProfile {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  mobileNumber: string;
  email: string;
}

export interface BrandProfile {
  basicInfo: {
    brandName: string;
    logo: string;
    tagline: string;
    description: string;
    brandVideo: string;
    missionVision: string;
    foundingYear: number;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  socialLinks: {
    website: string;
    facebook: string;
    instagram: string;
    linkedin: string;
  };
  certifications: Array<{
    name: string;
    issuingOrganization: string;
    description: string;
  }>;
  awards: Array<{
    name: string;
    year: number;
    description: string;
  }>;
  campaigns: Array<{
    name: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  featuredProducts: Array<{
    name: string;
    price: number;
    description: string;
    images: string[];
  }>;
  newLaunchProducts: Array<{
    name: string;
    price: number;
    description: string;
    images: string[];
  }>;
  reviews: Array<{
    customerName: string;
    rating: number;
    text: string;
  }>;
}

export interface AdminProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  permissions: string[];
} 