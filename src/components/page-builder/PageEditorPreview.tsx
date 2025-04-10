
import { ScrollArea } from "@/components/ui/scroll-area";
import { Smartphone } from "lucide-react";

interface Block {
  id: string;
  type: string;
  content: string;
}

interface PageEditorPreviewProps {
  blocks: Block[];
}

export function PageEditorPreview({ blocks }: PageEditorPreviewProps) {
  const renderBlockContent = (block: Block) => {
    switch (block.type) {
      case 'heading':
        return <h2 className="text-xl font-bold">Heading Text</h2>;
      case 'text':
        return <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>;
      case 'image':
        return (
          <div className="bg-gray-100 rounded-md flex items-center justify-center h-24">
            <span className="text-xs text-gray-500">Image</span>
          </div>
        );
      case 'video':
        return (
          <div className="bg-gray-100 rounded-md flex items-center justify-center h-24">
            <span className="text-xs text-gray-500">Video</span>
          </div>
        );
      case 'testimonials':
        return (
          <div className="bg-white p-2 rounded-md shadow-sm border text-xs">
            <p className="italic text-muted-foreground">"This is a testimonial text."</p>
            <p className="mt-1 font-medium">- Customer</p>
          </div>
        );
      case 'map':
        return (
          <div className="bg-gray-100 rounded-md flex items-center justify-center h-24">
            <span className="text-xs text-gray-500">Map</span>
          </div>
        );
      case 'social links':
        return (
          <div className="flex justify-center gap-2">
            <div className="w-5 h-5 bg-gray-100 rounded-full"></div>
            <div className="w-5 h-5 bg-gray-100 rounded-full"></div>
            <div className="w-5 h-5 bg-gray-100 rounded-full"></div>
          </div>
        );
      case 'buy button':
        return (
          <button className="w-full bg-primary text-white text-xs py-1 px-2 rounded">Buy Now</button>
        );
      case 'contact form':
        return (
          <div className="bg-white p-2 rounded-md shadow-sm border text-xs">
            <p className="font-medium mb-1">Contact Form</p>
            <div className="space-y-1">
              <div className="h-4 bg-gray-100 rounded"></div>
              <div className="h-4 bg-gray-100 rounded"></div>
              <div className="h-10 bg-gray-100 rounded"></div>
              <button className="w-full bg-primary text-white text-xs py-1 px-2 rounded">Submit</button>
            </div>
          </div>
        );
      case 'team':
        return (
          <div className="grid grid-cols-3 gap-1 text-xs">
            <div className="bg-gray-100 rounded flex flex-col items-center p-1">
              <div className="w-6 h-6 bg-gray-200 rounded-full mb-1"></div>
              <span className="text-[10px]">Team</span>
            </div>
            <div className="bg-gray-100 rounded flex flex-col items-center p-1">
              <div className="w-6 h-6 bg-gray-200 rounded-full mb-1"></div>
              <span className="text-[10px]">Team</span>
            </div>
            <div className="bg-gray-100 rounded flex flex-col items-center p-1">
              <div className="w-6 h-6 bg-gray-200 rounded-full mb-1"></div>
              <span className="text-[10px]">Team</span>
            </div>
          </div>
        );
      default:
        return <div>Unknown block type</div>;
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="text-center mb-4">
        <h3 className="font-medium flex items-center justify-center gap-2">
          <Smartphone className="h-4 w-4" />
          Mobile Preview
        </h3>
      </div>
      
      <div className="flex-1 mx-auto w-64 border-8 border-gray-800 rounded-3xl overflow-hidden shadow-lg">
        <div className="h-4 bg-gray-800"></div>
        <ScrollArea className="h-full bg-gray-50">
          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-4 text-center h-full">
              <p className="text-muted-foreground text-xs">
                Add blocks to preview
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {blocks.map((block) => (
                <div key={block.id} className="p-1">
                  {renderBlockContent(block)}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
