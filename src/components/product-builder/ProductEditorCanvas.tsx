
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Grip, Trash2, Pencil } from 'lucide-react';
import { ProductComponent } from '@/pages/ProductPageCreator';
import { ProductComponentRenderer } from './ProductComponentRenderer';

interface ProductEditorComponentProps {
  component: ProductComponent;
  onDeleteComponent: (componentId: string) => void;
  onUpdateComponent: (componentId: string, content: Record<string, any>, styles: Record<string, any>) => void;
}

const ProductEditorComponent = ({ component, onDeleteComponent, onUpdateComponent }: ProductEditorComponentProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateComponent = (updatedContent: Record<string, any>) => {
    onUpdateComponent(component.id, updatedContent, component.styles);
    setIsEditing(false);
  };

  return (
    <div className="relative group border rounded-lg shadow p-4 mb-4 bg-white">
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onDeleteComponent(component.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 cursor-grab"
        >
          <Grip className="h-4 w-4" />
        </Button>
      </div>

      {isEditing ? (
        <div className="py-2 space-y-4">
          {component.type === 'text' && (
            <textarea
              className="w-full p-2 border rounded"
              value={component.content.text}
              onChange={(e) => handleUpdateComponent({ ...component.content, text: e.target.value })}
              rows={4}
            />
          )}
          
          {component.type === 'button' && (
            <div className="space-y-2">
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={component.content.text}
                onChange={(e) => handleUpdateComponent({ ...component.content, text: e.target.value })}
                placeholder="Button Text"
              />
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={component.content.url}
                onChange={(e) => handleUpdateComponent({ ...component.content, url: e.target.value })}
                placeholder="URL"
              />
            </div>
          )}
          
          {component.type === 'image' && (
            <div className="space-y-2">
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={component.content.src}
                onChange={(e) => handleUpdateComponent({ ...component.content, src: e.target.value })}
                placeholder="Image URL"
              />
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={component.content.alt}
                onChange={(e) => handleUpdateComponent({ ...component.content, alt: e.target.value })}
                placeholder="Alt Text"
              />
            </div>
          )}
          
          {component.type === 'youtube' && (
            <div className="space-y-2">
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={component.content.videoId}
                onChange={(e) => handleUpdateComponent({ ...component.content, videoId: e.target.value })}
                placeholder="YouTube Video ID"
              />
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={component.content.title}
                onChange={(e) => handleUpdateComponent({ ...component.content, title: e.target.value })}
                placeholder="Video Title"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="py-2">
          <ProductComponentRenderer
            type={component.type}
            content={component.content}
            styles={component.styles}
          />
        </div>
      )}
    </div>
  );
};

interface ProductEditorCanvasProps {
  components: ProductComponent[];
  onDeleteComponent: (id: string) => void;
  onUpdateComponent: (id: string, content: Record<string, any>, styles: Record<string, any>) => void;
  pageSettings: {
    backgroundColor: string;
    fontFamily: string;
  };
}

export function ProductEditorCanvas({
  components,
  onDeleteComponent,
  onUpdateComponent,
  pageSettings
}: ProductEditorCanvasProps) {
  return (
    <div className="flex-1 h-full flex flex-col">
      <ScrollArea className="flex-1 h-full">
        <div 
          className="p-8 min-h-full"
          style={{
            backgroundColor: pageSettings.backgroundColor,
            fontFamily: pageSettings.fontFamily
          }}
        >
          <div className="max-w-2xl mx-auto">
            {components.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-muted-foreground mb-4">No components added yet</p>
                <p className="text-muted-foreground text-sm mb-4">Use the sidebar to add components</p>
              </div>
            ) : (
              <div className="space-y-6">
                {components.map((component) => (
                  <ProductEditorComponent
                    key={component.id}
                    component={component}
                    onDeleteComponent={onDeleteComponent}
                    onUpdateComponent={onUpdateComponent}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
