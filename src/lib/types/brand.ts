export interface SocialLinks {
  website?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: number;
  documentUrl?: string;
}

export interface Award {
  title: string;
  organization: string;
  year: number;
  description?: string;
  documentUrl?: string;
}

export interface PressFeature {
  title: string;
  publisher: string;
  date: string;
  url?: string;
}

export interface Brand {
  id: string;
  userId: string; // Owner of the brand
  createdAt: string;
  updatedAt: string;
  
  // Basic Info
  name: string;
  logo: string;
  tagline?: string;
  description: string;
  videoUrl?: string;
  mission?: string;
  vision?: string;
  foundingYear?: number;
  
  // Contact Info
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  
  // Social Links
  socialLinks?: SocialLinks;
  
  // Credentials
  certifications?: Certification[];
  awards?: Award[];
  pressFeatures?: PressFeature[];
  
  // Settings
  isActive: boolean;
  isVerified: boolean;
  settings?: {
    allowPublicProfile?: boolean;
    enableNotifications?: boolean;
    language?: string;
    timezone?: string;
  };
} 