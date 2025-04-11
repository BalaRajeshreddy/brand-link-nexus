import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUploadConfig, DEFAULT_FILE_CONFIG, FileType } from '@/lib/types/file';
import { cn } from '@/lib/utils';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileSelect: (file: File) => Promise<void>;
  config?: Partial<FileUploadConfig>;
  className?: string;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  showPreview?: boolean;
}

export function FileUpload({
  onFileSelect,
  config = DEFAULT_FILE_CONFIG,
  className,
  accept,
  maxFiles = 1,
  showPreview = true
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File) => {
    // Check file size
    if (file.size > config.maxSizeInMB * 1024 * 1024) {
      throw new Error(`File size must be less than ${config.maxSizeInMB}MB`);
    }

    // Check file type
    const fileType = file.type;
    if (!config.allowedMimeTypes.includes(fileType)) {
      throw new Error('File type not supported');
    }

    return true;
  };

  const handleDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setError(null);
      setIsLoading(true);

      const file = acceptedFiles[0];
      validateFile(file);

      // If it's an image, show preview
      if (file.type.startsWith('image/') && showPreview) {
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
      }

      await onFileSelect(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  }, [onFileSelect, showPreview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    maxFiles,
    accept,
  });

  const clearPreview = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 transition-colors',
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-200',
          'hover:border-primary hover:bg-primary/5',
          'cursor-pointer'
        )}
      >
        <input {...getInputProps()} />
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Uploading file...</p>
          </div>
        ) : preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg object-contain"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                clearPreview();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Upload className="h-8 w-8 text-primary mb-2" />
            <p className="text-sm font-medium">
              {isDragActive ? 'Drop the file here' : 'Drag & drop file here'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              or click to select file
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Max size: {config.maxSizeInMB}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}
    </div>
  );
} 