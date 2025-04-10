
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Block {
  id: string;
  type: string;
  content: string;
}

interface PageEditorCanvasProps {
  blocks: Block[];
  onDeleteBlock: (blockId: string) => void;
}

export function PageEditorCanvas({ blocks, onDeleteBlock }: PageEditorCanvasProps) {
  const renderBlockContent = (block: Block) => {
    switch (block.type) {
      case 'heading':
        return <h2 className="text-2xl font-bold">Heading Text</h2>;
      case 'text':
        return <p className="text-base">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sit amet justo vel nunc tincidunt commodo.</p>;
      case 'image':
        return (
          <div className="bg-gray-100 rounded-md flex items-center justify-center h-40">
            <span className="text-gray-500">Image Placeholder</span>
          </div>
        );
      case 'video':
        return (
          <div className="bg-gray-100 rounded-md flex items-center justify-center h-40">
            <span className="text-gray-500">Video Placeholder</span>
          </div>
        );
      case 'testimonials':
        return (
          <div className="bg-white p-4 rounded-md shadow-sm border">
            <p className="italic text-muted-foreground">"This is a testimonial text. Great product or service!"</p>
            <p className="mt-2 text-sm font-medium">- Customer Name</p>
          </div>
        );
      case 'map':
        return (
          <div className="bg-gray-100 rounded-md flex items-center justify-center h-40">
            <span className="text-gray-500">Map Placeholder</span>
          </div>
        );
      case 'social links':
        return (
          <div className="flex justify-center gap-4">
            <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
            <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
            <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
          </div>
        );
      case 'buy button':
        return (
          <Button className="w-full">Buy Now</Button>
        );
      case 'contact form':
        return (
          <div className="bg-white p-4 rounded-md shadow-sm border">
            <p className="font-medium mb-2">Contact Form</p>
            <div className="space-y-2">
              <div className="h-8 bg-gray-100 rounded-md"></div>
              <div className="h-8 bg-gray-100 rounded-md"></div>
              <div className="h-20 bg-gray-100 rounded-md"></div>
              <Button className="w-full">Submit</Button>
            </div>
          </div>
        );
      case 'team':
        return (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-100 rounded-md flex flex-col items-center p-2">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
              <span className="text-xs">Team Member</span>
            </div>
            <div className="bg-gray-100 rounded-md flex flex-col items-center p-2">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
              <span className="text-xs">Team Member</span>
            </div>
            <div className="bg-gray-100 rounded-md flex flex-col items-center p-2">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
              <span className="text-xs">Team Member</span>
            </div>
          </div>
        );
      default:
        return <div>Unknown block type</div>;
    }
  };

  return (
    <ScrollArea className="h-full bg-gray-100">
      <div className="py-8 px-4">
        <div className="w-full max-w-md mx-auto bg-white min-h-[600px] rounded-lg shadow-sm">
          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-center h-[600px]">
              <p className="text-muted-foreground">
                Your landing page is empty. Add blocks from the sidebar.
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {blocks.map((block) => (
                <div key={block.id} className="relative group border border-transparent hover:border-primary-blue p-2 rounded-md">
                  <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => onDeleteBlock(block.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  {renderBlockContent(block)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
