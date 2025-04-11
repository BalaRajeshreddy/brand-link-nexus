import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Loader2, Upload } from 'lucide-react';

interface FileUploadProps {
  onUpload: (file: File) => void;
  accept?: string;
  maxSize?: number;
  brandId: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  accept,
  maxSize = 5 * 1024 * 1024, // 5MB default
  brandId
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > maxSize) {
      alert(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Here you would typically upload the file to your server
      // For now, we'll just call onUpload with the file
      await new Promise(resolve => setTimeout(resolve, 2000));
      onUpload(file);
      setFile(null);
      setProgress(100);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [maxSize, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    maxSize,
    multiple: false
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <Upload className="w-8 h-8 mx-auto text-gray-400" />
          {isDragActive ? (
            <p>Drop the file here...</p>
          ) : (
            <p>Drag and drop a file here, or click to select a file</p>
          )}
          <p className="text-sm text-gray-500">
            Max file size: {maxSize / 1024 / 1024}MB
          </p>
        </div>
      </div>

      {file && (
        <div className="space-y-2">
          <Label>Selected File</Label>
          <div className="flex items-center gap-2">
            <Input value={file.name} readOnly />
            <Button variant="outline" onClick={() => setFile(null)}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Uploading...</span>
          </div>
        </div>
      )}

      <Button
        onClick={() => {
          // This button is now disabled by the useDropzone component
        }}
        disabled={!file || uploading}
        className="w-full"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>
    </div>
  );
}; 