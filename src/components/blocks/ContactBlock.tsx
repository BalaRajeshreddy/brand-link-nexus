import React from 'react';
import { Block } from '@/types/block';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface ContactBlockProps {
  block: Block;
  onChange: (block: Block) => void;
  brandId: string;
}

export const ContactBlock: React.FC<ContactBlockProps> = ({
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
          placeholder="Enter contact section title"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={block.content.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter contact section description"
        />
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          value={block.content.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="Enter contact email"
        />
      </div>

      <div className="space-y-2">
        <Label>Phone</Label>
        <Input
          type="tel"
          value={block.content.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="Enter contact phone"
        />
      </div>

      <div className="space-y-2">
        <Label>Address</Label>
        <Textarea
          value={block.content.address || ''}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="Enter contact address"
        />
      </div>
    </div>
  );
}; 