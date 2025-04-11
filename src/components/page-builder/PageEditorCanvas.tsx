
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { BlockEditor } from './BlockEditor';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Grip, Trash2 } from 'lucide-react';
import { Block } from './PageBuilder';
import { BlockEditorMain } from './block-renderers/BlockEditorMain';

interface SortableBlockProps {
  block: Block;
  onDeleteBlock: (id: string) => void;
  onUpdateBlock: (id: string, content: Record<string, any>, styles: Record<string, any>) => void;
  openMediaLibrary: (blockId: string, fieldPath: string, altPath?: string) => void;
}

const SortableBlock = ({ block, onDeleteBlock, onUpdateBlock, openMediaLibrary }: SortableBlockProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as 'relative',
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="mb-4 group">
      <div className="border border-dashed border-gray-200 rounded-md p-2 hover:border-gray-300 bg-white">
        <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 opacity-50 hover:opacity-100 cursor-grab" 
              {...listeners}
            >
              <Grip size={12} />
            </Button>
            <span>{block.type.charAt(0).toUpperCase() + block.type.slice(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Preview' : 'Edit'}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" 
              onClick={() => onDeleteBlock(block.id)}
            >
              <Trash2 size={12} />
            </Button>
          </div>
        </div>
        
        {isEditing ? (
          <BlockEditor
            block={block}
            onUpdateBlock={onUpdateBlock}
            openMediaLibrary={openMediaLibrary}
          />
        ) : (
          <div className="py-2">
            <BlockEditorMain
              blockType={block.type}
              content={block.content}
              styles={block.styles}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface PageEditorCanvasProps {
  blocks: Block[];
  onDeleteBlock: (id: string) => void;
  onUpdateBlock: (id: string, content: Record<string, any>, styles: Record<string, any>) => void;
  openMediaLibrary: (blockId: string, fieldPath: string, altPath?: string) => void;
  pageStyles: {
    backgroundColor: string;
    fontFamily: string;
  };
}

export function PageEditorCanvas({
  blocks,
  onDeleteBlock,
  onUpdateBlock,
  openMediaLibrary,
  pageStyles
}: PageEditorCanvasProps) {
  return (
    <div className="flex-1 h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div 
          className="p-8 min-h-full"
          style={{
            backgroundColor: pageStyles.backgroundColor,
            fontFamily: pageStyles.fontFamily
          }}
        >
          <div className="max-w-4xl mx-auto">
            {blocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-muted-foreground mb-4">No blocks added yet</p>
                <p className="text-muted-foreground text-sm mb-4">Use the sidebar to add content blocks</p>
              </div>
            ) : (
              blocks.map((block) => (
                <SortableBlock
                  key={block.id}
                  block={block}
                  onDeleteBlock={onDeleteBlock}
                  onUpdateBlock={onUpdateBlock}
                  openMediaLibrary={openMediaLibrary}
                />
              ))
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
