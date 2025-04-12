export type FileType = 'image' | 'pdf' | 'video';

export interface FileAsset {
  id: string;
  brandId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  
  name: string;
  type: FileType;
  size: number; // in bytes
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    pages?: number;
  };
  
  // For organization
  folder?: string;
  tags?: string[];
  description?: string;
  
  // For tracking
  usageCount: number;
  lastUsed?: string;
}

export interface FileUploadConfig {
  maxSizeInMB: number;
  allowedTypes: FileType[];
  allowedMimeTypes: string[];
}

export const DEFAULT_FILE_CONFIG: FileUploadConfig = {
  maxSizeInMB: 5, // 5MB default limit
  allowedTypes: ['image', 'pdf'],
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf'
  ]
}; 