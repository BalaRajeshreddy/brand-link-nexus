import React from 'react';
import { Block } from '@/types/block';
import { FileSelector } from '../FileSelector';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface HeroBlockProps {
  block: Block;
  onChange: (block: Block) => void;
  brandId: string;
}

export const HeroBlock: React.FC<HeroBlockProps> = ({
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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={block.content.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter hero title"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={block.content.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter hero description"
        />
      </div>

      <div className="space-y-2">
        <Label>Hero Image</Label>
        <FileSelector
          type="image"
          onSelect={(file) => handleChange('image', file)}
          brandId={brandId}
          value={block.content.image?.url}
        />
      </div>

      <div className="space-y-2">
        <Label>Button Text</Label>
        <Input
          value={block.content.buttonText || ''}
          onChange={(e) => handleChange('buttonText', e.target.value)}
          placeholder="Enter button text"
        />
      </div>

      <div className="space-y-2">
        <Label>Button Link</Label>
        <Input
          value={block.content.buttonLink || ''}
          onChange={(e) => handleChange('buttonLink', e.target.value)}
          placeholder="Enter button link"
        />
      </div>
    </div>
  );
}; 