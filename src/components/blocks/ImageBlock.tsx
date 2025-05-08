import React from 'react';
import { Block } from '@/types/block';
import { FileSelector } from '../FileSelector';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface ImageBlockProps {
  block: Block;
  onChange: (block: Block) => void;
  brandId: string;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({
  block,
  onChange,
  brandId
}) => {
  const handleChange = (field: string, value: any) => {
    onChange({
      ...block,
      content: {
        ...block.content,
        [field]: value
      }
    });
  };

  const handleImageSelect = async (file: any) => {
    if (file instanceof File) {
      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('brandId', brandId);

        // Upload to server
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        
        // Update block with permanent URL from server
        handleChange('image', {
          url: data.url,
          alt: file.name
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        // You might want to show an error message to the user here
      }
    } else if (file && typeof file === 'object') {
      // Handle existing file or URL
      handleChange('image', {
        url: file.url || file,
        alt: file.alt || file.name || 'Image'
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={block.content.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter image title"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={block.content.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter image description"
        />
      </div>

      <div className="space-y-2">
        <Label>Image</Label>
        <FileSelector
          type="image"
          onSelect={handleImageSelect}
          brandId={brandId}
          value={block.content.image?.url}
        />
      </div>
    </div>
  );
}; 