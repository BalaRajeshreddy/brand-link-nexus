
export type FileType = 'image' | 'pdf';

export interface FileAsset {
  id: string;
  name: string;
  url: string;
  type: FileType;
  size: number;
  folder?: string;
  file?: File;
  alt?: string;
  userId?: string;
  brandId?: string;
  createdAt?: string;
  updatedAt?: string;
  usageCount?: number;
  thumbnailUrl?: string;
  description?: string;
  tags?: string[];
  metadata?: {
    width?: number;
    height?: number;
  };
}

export interface FileUploadConfig {
  maxSizeInMB: number;
  allowedTypes: FileType[];
  allowedMimeTypes: string[];
} 
