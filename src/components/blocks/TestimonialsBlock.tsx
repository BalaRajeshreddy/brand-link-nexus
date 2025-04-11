import React from 'react';
import { Block } from '@/types/block';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface TestimonialsBlockProps {
  block: Block;
  onChange: (block: Block) => void;
  brandId: string;
}

export const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({
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

  const handleTestimonialChange = (index: number, field: string, value: string) => {
    const testimonials = [...(block.content.testimonials || [])];
    testimonials[index] = {
      ...testimonials[index],
      [field]: value
    };
    handleChange('testimonials', testimonials);
  };

  const addTestimonial = () => {
    const testimonials = [...(block.content.testimonials || [])];
    testimonials.push({ name: '', role: '', content: '' });
    handleChange('testimonials', testimonials);
  };

  const removeTestimonial = (index: number) => {
    const testimonials = [...(block.content.testimonials || [])];
    testimonials.splice(index, 1);
    handleChange('testimonials', testimonials);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={block.content.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter testimonials section title"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={block.content.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter testimonials section description"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Testimonials</Label>
          <Button variant="outline" size="sm" onClick={addTestimonial}>
            <Plus className="w-4 h-4 mr-2" />
            Add Testimonial
          </Button>
        </div>

        {(block.content.testimonials || []).map((testimonial: any, index: number) => (
          <div key={index} className="space-y-2 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <Label>Testimonial {index + 1}</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTestimonial(index)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
            <Input
              value={testimonial.name || ''}
              onChange={(e) => handleTestimonialChange(index, 'name', e.target.value)}
              placeholder="Enter name"
            />
            <Input
              value={testimonial.role || ''}
              onChange={(e) => handleTestimonialChange(index, 'role', e.target.value)}
              placeholder="Enter role"
            />
            <Textarea
              value={testimonial.content || ''}
              onChange={(e) => handleTestimonialChange(index, 'content', e.target.value)}
              placeholder="Enter testimonial content"
            />
          </div>
        ))}
      </div>
    </div>
  );
}; 