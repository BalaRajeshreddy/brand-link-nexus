import { useState, useEffect } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Upload, Link as LinkIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MediaLibrary } from '../page-builder/MediaLibrary';

interface MediaSelectorProps {
  onSelect: (media: { url: string; link?: string; alt?: string }) => void;
  value?: { url: string; link?: string; alt?: string };
  type: 'image' | 'image-with-link' | 'image-with-text';
  brandId: string;
  folder?: string;
  maxSize?: number;
  inputId?: string;
}

export const MediaSelector = ({
  onSelect,
  value,
  type,
  brandId,
  folder = 'media',
  maxSize = 5,
  inputId = 'file-upload',
}: MediaSelectorProps) => {
  const [showLibrary, setShowLibrary] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [url, setUrl] = useState(value?.url || '');
  const [link, setLink] = useState(value?.link || '');
  const [alt, setAlt] = useState(value?.alt || '');

  // Sync internal state with value prop
  useEffect(() => {
    setUrl(value?.url || '');
    setLink(value?.link || '');
    setAlt(value?.alt || '');
  }, [value?.url, value?.link, value?.alt]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`File is too large. Maximum size is ${maxSize}MB`);
        return;
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${brandId}/${folder}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      onSelect({
        url: publicUrl,
        link: type === 'image-with-link' ? link : undefined,
        alt: alt || file.name
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }
    onSelect({
      url,
      link: type === 'image-with-link' ? link : undefined,
      alt
    });
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="upload">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="library">Select Existing</TabsTrigger>
          <TabsTrigger value="url">URL</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div className="space-y-2">
            <Label>Upload File</Label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              id={inputId}
              disabled={isUploading}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById(inputId)?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Select File'}
            </Button>
          </div>
          {type === 'image-with-link' && (
            <div className="space-y-2">
              <Label htmlFor="link">Link URL</Label>
              <Input
                id="link"
                type="url"
                placeholder="https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="alt">Alt Text</Label>
            <Input
              id="alt"
              placeholder="Image description"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
            />
          </div>
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <Button onClick={() => setShowLibrary(true)}>Open Media Library</Button>
          <MediaLibrary
            open={showLibrary}
            onOpenChange={setShowLibrary}
            onSelectImage={(url, altText) => {
              onSelect({
                url,
                link: type === 'image-with-link' ? link : undefined,
                alt: altText
              });
              setShowLibrary(false);
            }}
          />
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          {type === 'image-with-link' && (
            <div className="space-y-2">
              <Label htmlFor="link-url">Link URL</Label>
              <Input
                id="link-url"
                type="url"
                placeholder="https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="alt-url">Alt Text</Label>
            <Input
              id="alt-url"
              placeholder="Image description"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
            />
          </div>
          <Button onClick={handleUrlSubmit}>Apply</Button>
        </TabsContent>
      </Tabs>

      {value?.url && (
        <div className="mt-4">
          <div className="relative aspect-video rounded-lg overflow-hidden border">
            <img
              src={value.url}
              alt={value.alt || 'Selected media'}
              className="w-full h-full object-cover"
            />
          </div>
          {type === 'image-with-link' && value.link && (
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <LinkIcon className="h-4 w-4" />
              <a href={value.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {value.link}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 