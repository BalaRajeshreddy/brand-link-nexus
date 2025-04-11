import React from 'react';
import { Block } from '@/types/block';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface CustomBlockProps {
  block: Block;
  onChange: (block: Block) => void;
  brandId: string;
}

export const CustomBlock: React.FC<CustomBlockProps> = ({
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
          placeholder="Enter custom block title"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={block.content.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter custom block description"
        />
      </div>

      <div className="space-y-2">
        <Label>Custom Content</Label>
        <Textarea
          value={block.content.customContent || ''}
          onChange={(e) => handleChange('customContent', e.target.value)}
          placeholder="Enter custom content (HTML supported)"
          className="min-h-[200px]"
        />
      </div>
    </div>
  );
}; 