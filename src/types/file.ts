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
}

export interface FileUploadConfig {
  maxSizeInMB: number;
  allowedTypes: FileType[];
  allowedMimeTypes: string[];
} 