import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  return (
    <div className="flex flex-col space-y-2">
      {label && <Label>{label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              'w-full h-10 rounded-md border border-input flex items-center gap-2 px-3',
              'hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <div
              className="w-6 h-6 rounded border"
              style={{ backgroundColor: value || 'transparent' }}
            />
            <span className="flex-1 text-left">{value || 'Select color'}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-4">
            <div>
              <Input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-40 p-1"
              />
            </div>
            <div>
              <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#000000"
                className="w-full"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
} 