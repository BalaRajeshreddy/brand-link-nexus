
import React, { useState } from 'react';
import { FileAsset } from '@/types/file';
import { FileUpload } from './FileUpload';
import { FileManager } from './FileManager';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface FileSelectorProps {
  type: 'image' | 'pdf';
  onSelect: (file: File | FileAsset | null) => void;
  brandId: string;
  value?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const FileSelector: React.FC<FileSelectorProps> = ({
  type,
  onSelect,
  brandId,
  value
}) => {
  const [showFileManager, setShowFileManager] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [url, setUrl] = useState(value || '');

  const handleFileSelect = (file: FileAsset) => {
    onSelect(file);
    setShowFileManager(false);
  };

  const handleFileUpload = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      alert(`File size must be less than 5MB`);
      return;
    }
    onSelect(file);
    setShowUpload(false);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    // Create a minimal FileAsset object with just the needed properties
    const fileAsset: FileAsset = {
      url: newUrl,
      name: 'External resource',
      type: type === 'image' ? 'image' : 'pdf',
      size: 0,
      id: `external-${Date.now()}`
    };
    onSelect(fileAsset);
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="url">URL</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="existing">Existing Files</TabsTrigger>
        </TabsList>
        <TabsContent value="url" className="space-y-2">
          <Label>Enter URL</Label>
          <Input
            type="url"
            value={url}
            onChange={handleUrlChange}
            placeholder={`Enter ${type === 'image' ? 'image' : 'PDF'} URL`}
          />
        </TabsContent>
        <TabsContent value="upload">
          <Dialog open={showUpload} onOpenChange={setShowUpload}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">Upload New File</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New {type === 'image' ? 'Image' : 'PDF'}</DialogTitle>
              </DialogHeader>
              <FileUpload
                onUpload={handleFileUpload}
                accept={type === 'image' ? 'image/*' : '.pdf'}
                maxSize={MAX_FILE_SIZE}
                brandId={brandId}
              />
            </DialogContent>
          </Dialog>
        </TabsContent>
        <TabsContent value="existing">
          <Dialog open={showFileManager} onOpenChange={setShowFileManager}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">Select Existing File</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Select {type === 'image' ? 'Image' : 'PDF'}</DialogTitle>
              </DialogHeader>
              <FileManager
                brandId={brandId}
                onFileSelect={handleFileSelect}
                filterType={type}
              />
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
};
