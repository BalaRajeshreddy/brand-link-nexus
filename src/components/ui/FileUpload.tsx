import { useState } from 'react';
import { Button } from './button';
import { Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileSelect: (url: string) => void;
  accept?: string;
  folder?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
}

export const FileUpload = ({
  onFileSelect,
  accept = '*/*',
  folder = 'uploads',
  maxSize = 10,
  multiple = false
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
          toast.error(`File ${file.name} is too large. Maximum size is ${maxSize}MB`);
          continue;
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError, data } = await supabase.storage
          .from('public')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('public')
          .getPublicUrl(filePath);

        onFileSelect(publicUrl);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileUpload}
        className="hidden"
        id="file-upload"
        disabled={isUploading}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => document.getElementById('file-upload')?.click()}
        disabled={isUploading}
      >
        <Upload className="h-4 w-4 mr-2" />
        {isUploading ? 'Uploading...' : 'Upload File'}
      </Button>
    </div>
  );
}; 