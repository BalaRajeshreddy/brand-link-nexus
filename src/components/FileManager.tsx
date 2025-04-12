
import React, { useEffect, useState } from 'react';
import { FileAsset } from '@/types/file';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageIcon, FileIcon, Loader2 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface FileManagerProps {
  brandId: string;
  onFileSelect: (file: FileAsset) => void;
  filterType?: 'image' | 'pdf';
  allowedTypes?: ('image' | 'pdf')[];
}

type FileType = 'IMAGE' | 'PDF';

export const FileManager: React.FC<FileManagerProps> = ({
  brandId,
  onFileSelect,
  filterType,
  allowedTypes
}) => {
  const [files, setFiles] = useState<FileAsset[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/brands/${brandId}/files`);
        if (!response.ok) {
          throw new Error('Failed to fetch files');
        }
        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error('Error fetching files:', error);
        setError('Failed to load files. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [brandId]);

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name?.toLowerCase().includes(search.toLowerCase());
    const matchesType = !filterType || 
      (filterType === 'image' && (file.type as FileType) === 'IMAGE') ||
      (filterType === 'pdf' && (file.type as FileType) === 'PDF');
    const matchesAllowedTypes = !allowedTypes || 
      (allowedTypes.includes('image') && (file.type as FileType) === 'IMAGE') ||
      (allowedTypes.includes('pdf') && (file.type as FileType) === 'PDF');
    return matchesSearch && matchesType && matchesAllowedTypes;
  });

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <Card
            key={file.id}
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => onFileSelect(file)}
          >
            <div className="flex items-center gap-4">
              {(file.type as FileType) === 'IMAGE' ? (
                <ImageIcon className="w-8 h-8 text-gray-400" />
              ) : (
                <FileIcon className="w-8 h-8 text-gray-400" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {search ? 'No files match your search' : 'No files found'}
        </div>
      )}
    </div>
  );
}; 
