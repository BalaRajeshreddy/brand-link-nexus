
import { FileAsset } from '@/types/file';

// Sample mock files for development
export const mockFiles: FileAsset[] = [
  {
    id: 'file1',
    name: 'sample-image-1.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    size: 25600,
    url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
    userId: 'user123',
    brandId: 'brand123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 3,
    metadata: {
      width: 1200,
      height: 800
    }
  },
  {
    id: 'file2',
    name: 'sample-document.pdf',
    type: 'pdf',
    mimeType: 'application/pdf',
    size: 102400,
    url: 'https://example.com/sample.pdf',
    userId: 'user123',
    brandId: 'brand123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 1
  },
  {
    id: 'file3',
    name: 'sample-image-2.png',
    type: 'image',
    mimeType: 'image/png',
    size: 51200,
    url: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd',
    userId: 'user123',
    brandId: 'brand123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 2,
    metadata: {
      width: 1600,
      height: 900
    }
  }
];

// This would be replaced by actual API endpoints in production
export const fetchFilesByBrandId = async (brandId: string): Promise<FileAsset[]> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filter by brandId in a real implementation
  return mockFiles;
};

export const uploadFile = async (file: File, brandId: string): Promise<FileAsset> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const fileAsset: FileAsset = {
    id: `file-${Date.now()}`,
    name: file.name,
    type: file.type.includes('image') ? 'image' : 'pdf',
    mimeType: file.type,
    size: file.size,
    url: URL.createObjectURL(file),
    userId: 'current-user',
    brandId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0
  };
  
  return fileAsset;
};
