import { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Upload, Trash2, Link as LinkIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductImage {
  image: string;
  link: string;
}

interface ProductImageUploadProps {
  onImagesChange: (images: ProductImage[]) => void;
  initialImages?: ProductImage[];
}

export const ProductImageUpload = ({
  onImagesChange,
  initialImages = []
}: ProductImageUploadProps) => {
  const [images, setImages] = useState<ProductImage[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`Image ${file.name} is too large. Maximum size is 5MB`);
          continue;
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('public')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('public')
          .getPublicUrl(filePath);

        // Add new image with empty link
        const newImages = [...images, { image: publicUrl, link: '' }];
        setImages(newImages);
        onImagesChange(newImages);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLinkChange = (index: number, link: string) => {
    const newImages = [...images];
    newImages[index].link = link;
    setImages(newImages);
    onImagesChange(newImages);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
            disabled={isUploading}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('image-upload')?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Images'}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {images.length} images uploaded
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="space-y-2">
            <div className="relative aspect-square rounded-lg overflow-hidden border">
              <img
                src={image.image}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => handleRemoveImage(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`link-${index}`} className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                E-commerce Link
              </Label>
              <Input
                id={`link-${index}`}
                type="url"
                placeholder="https://..."
                value={image.link}
                onChange={(e) => handleLinkChange(index, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 