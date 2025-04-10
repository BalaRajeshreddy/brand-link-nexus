
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, ChevronUp, ChevronDown, Palette } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Block } from "./PageBuilder";
import { BlockEditor } from "./BlockEditor";
import { useState } from "react";

interface PageEditorCanvasProps {
  blocks: Block[];
  onDeleteBlock: (blockId: string) => void;
  onUpdateBlock: (blockId: string, content: Record<string, any>, styles: Record<string, any>) => void;
  pageStyles: {
    backgroundColor: string;
    fontFamily: string;
  };
}

function SortableBlock({ block, onDelete, onEdit, pageStyles }: { 
  block: Block; 
  onDelete: () => void; 
  onEdit: () => void;
  pageStyles: {
    backgroundColor: string;
    fontFamily: string;
  };
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderBlockContent = (block: Block) => {
    switch (block.type) {
      case 'heading':
        return <h2 
          className="text-2xl font-bold" 
          style={{ 
            color: block.styles.textColor,
            fontSize: block.styles.fontSize,
            textAlign: block.styles.textAlign
          }}
        >
          {block.content.text || "Heading Text"}
        </h2>;
      case 'text':
        return <p 
          className="text-base" 
          style={{ 
            color: block.styles.textColor,
            fontSize: block.styles.fontSize,
            textAlign: block.styles.textAlign
          }}
        >
          {block.content.text || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sit amet justo vel nunc tincidunt commodo."}
        </p>;
      case 'image':
        return block.content.src ? (
          <img 
            src={block.content.src} 
            alt={block.content.alt || ""} 
            className="w-full rounded-md"
          />
        ) : (
          <div 
            className="bg-gray-100 rounded-md flex items-center justify-center h-40"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "#f3f4f6"
            }}
          >
            <span className="text-gray-500">Image Placeholder</span>
          </div>
        );
      case 'video':
        return (
          <div 
            className="bg-gray-100 rounded-md flex items-center justify-center h-40"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "#f3f4f6"
            }}
          >
            <span className="text-gray-500">Video Placeholder</span>
          </div>
        );
      case 'testimonials':
        return (
          <div 
            className="bg-white p-4 rounded-md shadow-sm border"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "#ffffff",
              color: block.styles.textColor,
            }}
          >
            {block.content.testimonials?.map((testimonial: any, i: number) => (
              <div key={i} className="mb-3 last:mb-0">
                <p 
                  className="italic text-muted-foreground"
                  style={{ color: block.styles.textColor }}
                >
                  "{testimonial.text || "This is a testimonial text. Great product or service!"}"
                </p>
                <p 
                  className="mt-2 text-sm font-medium"
                  style={{ color: block.styles.textColor }}
                >
                  - {testimonial.author || "Customer Name"}
                </p>
              </div>
            ))}
          </div>
        );
      case 'map':
        return (
          <div 
            className="bg-gray-100 rounded-md flex items-center justify-center h-40"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "#f3f4f6"
            }}
          >
            <span className="text-gray-500">
              {block.content.location || "Map Placeholder"}
            </span>
          </div>
        );
      case 'social links':
        return (
          <div 
            className="flex justify-center gap-4"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "transparent",
              textAlign: block.styles.textAlign
            }}
          >
            {(block.content.links || [{}, {}, {}]).map((_, i: number) => (
              <div key={i} className="w-8 h-8 bg-gray-100 rounded-full"></div>
            ))}
          </div>
        );
      case 'buy button':
        return (
          <Button 
            className="w-full"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "#3B82F6",
              color: block.styles.textColor || "#FFFFFF"
            }}
          >
            {block.content.text || "Buy Now"}
          </Button>
        );
      case 'contact form':
        return (
          <div 
            className="bg-white p-4 rounded-md shadow-sm border"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "#ffffff"
            }}
          >
            <p 
              className="font-medium mb-2"
              style={{ color: block.styles.textColor }}
            >
              Contact Form
            </p>
            <div className="space-y-2">
              {(block.content.fields || ["name", "email", "message"]).map((field: string) => (
                <div key={field} className="h-8 bg-gray-100 rounded-md"></div>
              ))}
              <Button 
                className="w-full"
                style={{ 
                  backgroundColor: block.styles.backgroundColor === "#ffffff" ? "#3B82F6" : block.styles.backgroundColor,
                  color: "#ffffff"
                }}
              >
                {block.content.submitText || "Submit"}
              </Button>
            </div>
          </div>
        );
      case 'team':
        return (
          <div 
            className="grid grid-cols-3 gap-4"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "transparent"
            }}
          >
            {(block.content.members || [{}, {}, {}]).map((member: any, i: number) => (
              <div 
                key={i} 
                className="bg-gray-100 rounded-md flex flex-col items-center p-2"
                style={{ 
                  backgroundColor: block.styles.backgroundColor !== 'transparent' 
                  ? block.styles.backgroundColor 
                  : "#f3f4f6" 
                }}
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
                <span 
                  className="text-xs"
                  style={{ color: block.styles.textColor }}
                >
                  {member.name || "Team Member"}
                </span>
              </div>
            ))}
          </div>
        );
      default:
        return <div>Unknown block type</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative group border border-transparent hover:border-primary-blue p-2 rounded-md my-2"
    >
      <div 
        className="handle absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full p-1 
                   opacity-0 group-hover:opacity-100 transition-opacity cursor-move bg-white 
                   border rounded-l-md"
        {...listeners}
      >
        <div className="flex flex-col">
          <ChevronUp className="h-4 w-4" />
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
      
      <div 
        className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity 
                  flex flex-col gap-1"
      >
        <Button 
          variant="outline" 
          size="icon" 
          className="h-6 w-6 bg-white"
          onClick={onEdit}
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button 
          variant="destructive" 
          size="icon" 
          className="h-6 w-6"
          onClick={onDelete}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
      
      <div 
        style={{ 
          padding: block.styles.padding,
          borderRadius: block.styles.borderRadius,
          backgroundColor: block.styles.backgroundColor !== 'transparent' 
            ? block.styles.backgroundColor 
            : "transparent",
        }}
      >
        {renderBlockContent(block)}
      </div>
    </div>
  );
}

export function PageEditorCanvas({ blocks, onDeleteBlock, onUpdateBlock, pageStyles }: PageEditorCanvasProps) {
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);

  const handleStartEdit = (block: Block) => {
    setEditingBlock(block);
  };
  
  const handleFinishEdit = (blockId: string, content: Record<string, any>, styles: Record<string, any>) => {
    onUpdateBlock(blockId, content, styles);
    setEditingBlock(null);
  };

  return (
    <ScrollArea className="h-full bg-gray-100">
      <div className="py-8 px-4">
        <div 
          className="w-full max-w-md mx-auto min-h-[600px] rounded-lg shadow-sm"
          style={{
            backgroundColor: pageStyles.backgroundColor,
            fontFamily: pageStyles.fontFamily
          }}
        >
          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-center h-[600px]">
              <p className="text-muted-foreground">
                Your landing page is empty. Add blocks from the sidebar.
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-1">
              {blocks.map((block) => (
                <SortableBlock
                  key={block.id}
                  block={block}
                  onDelete={() => onDeleteBlock(block.id)}
                  onEdit={() => handleStartEdit(block)}
                  pageStyles={pageStyles}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {editingBlock && (
        <BlockEditor
          block={editingBlock}
          onSave={handleFinishEdit}
          onCancel={() => setEditingBlock(null)}
        />
      )}
    </ScrollArea>
  );
}
