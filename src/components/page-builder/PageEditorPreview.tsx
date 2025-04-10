
import { ScrollArea } from "@/components/ui/scroll-area";
import { Smartphone } from "lucide-react";
import { Block } from "./PageBuilder";

interface PageEditorPreviewProps {
  blocks: Block[];
  pageStyles: {
    backgroundColor: string;
    fontFamily: string;
  };
}

export function PageEditorPreview({ blocks, pageStyles }: PageEditorPreviewProps) {
  const renderBlockContent = (block: Block) => {
    switch (block.type) {
      case 'heading':
        return <h2 
          className="text-xl font-bold" 
          style={{ 
            color: block.styles.textColor,
            fontSize: block.styles.fontSize ? `calc(${block.styles.fontSize} * 0.7)` : undefined,
            textAlign: block.styles.textAlign
          }}
        >
          {block.content.text || "Heading Text"}
        </h2>;
      case 'text':
        return <p 
          className="text-sm" 
          style={{ 
            color: block.styles.textColor,
            fontSize: block.styles.fontSize ? `calc(${block.styles.fontSize} * 0.7)` : undefined,
            textAlign: block.styles.textAlign
          }}
        >
          {block.content.text || "Lorem ipsum dolor sit amet..."}
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
            className="bg-gray-100 rounded-md flex items-center justify-center h-24"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "#f3f4f6"
            }}
          >
            <span className="text-xs text-gray-500">Image</span>
          </div>
        );
      case 'video':
        return (
          <div 
            className="bg-gray-100 rounded-md flex items-center justify-center h-24"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "#f3f4f6"
            }}
          >
            <span className="text-xs text-gray-500">Video</span>
          </div>
        );
      case 'testimonials':
        return (
          <div 
            className="bg-white p-2 rounded-md shadow-sm border text-xs"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "#ffffff"
            }}
          >
            {(block.content.testimonials || [{ text: "This is a testimonial text.", author: "Customer" }]).map((testimonial: any, i: number) => (
              <div key={i} className="mb-2 last:mb-0">
                <p 
                  className="italic text-muted-foreground"
                  style={{ color: block.styles.textColor }}
                >
                  "{testimonial.text || "This is a testimonial text."}"
                </p>
                <p 
                  className="mt-1 font-medium"
                  style={{ color: block.styles.textColor }}
                >
                  - {testimonial.author || "Customer"}
                </p>
              </div>
            ))}
          </div>
        );
      case 'map':
        return (
          <div 
            className="bg-gray-100 rounded-md flex items-center justify-center h-24"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "#f3f4f6"
            }}
          >
            <span className="text-xs text-gray-500">{block.content.location || "Map"}</span>
          </div>
        );
      case 'social links':
        return (
          <div 
            className="flex justify-center gap-2"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "transparent",
              textAlign: block.styles.textAlign
            }}
          >
            {(block.content.links || [{}, {}, {}]).map((_: any, i: number) => (
              <div key={i} className="w-5 h-5 bg-gray-100 rounded-full"></div>
            ))}
          </div>
        );
      case 'buy button':
        return (
          <button 
            className="w-full text-white text-xs py-1 px-2 rounded"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "#3B82F6",
              color: block.styles.textColor || "#FFFFFF"
            }}
          >
            {block.content.text || "Buy Now"}
          </button>
        );
      case 'contact form':
        return (
          <div 
            className="bg-white p-2 rounded-md shadow-sm border text-xs"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "#ffffff"
            }}
          >
            <p 
              className="font-medium mb-1"
              style={{ color: block.styles.textColor }}
            >
              Contact Form
            </p>
            <div className="space-y-1">
              {(block.content.fields || ["name", "email", "message"]).map((field: string) => (
                <div key={field} className="h-4 bg-gray-100 rounded"></div>
              ))}
              <button 
                className="w-full bg-primary text-white text-xs py-1 px-2 rounded"
                style={{ 
                  backgroundColor: block.styles.backgroundColor === "#ffffff" ? "#3B82F6" : block.styles.backgroundColor,
                  color: "#ffffff"
                }}
              >
                {block.content.submitText || "Submit"}
              </button>
            </div>
          </div>
        );
      case 'team':
        return (
          <div 
            className="grid grid-cols-3 gap-1 text-xs"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "transparent"
            }}
          >
            {(block.content.members || [{}, {}, {}]).map((member: any, i: number) => (
              <div 
                key={i} 
                className="bg-gray-100 rounded flex flex-col items-center p-1"
                style={{ 
                  backgroundColor: block.styles.backgroundColor !== 'transparent' 
                  ? block.styles.backgroundColor 
                  : "#f3f4f6" 
                }}
              >
                <div className="w-6 h-6 bg-gray-200 rounded-full mb-1"></div>
                <span 
                  className="text-[10px]"
                  style={{ color: block.styles.textColor }}
                >
                  {member.name || "Team"}
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
    <div className="h-full flex flex-col p-4">
      <div className="text-center mb-4">
        <h3 className="font-medium flex items-center justify-center gap-2">
          <Smartphone className="h-4 w-4" />
          Mobile Preview
        </h3>
      </div>
      
      <div className="flex-1 mx-auto w-64 border-8 border-gray-800 rounded-3xl overflow-hidden shadow-lg">
        <div className="h-4 bg-gray-800"></div>
        <ScrollArea 
          className="h-full"
          style={{
            backgroundColor: pageStyles.backgroundColor,
            fontFamily: pageStyles.fontFamily
          }}
        >
          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-4 text-center h-full">
              <p className="text-muted-foreground text-xs">
                Add blocks to preview
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {blocks.map((block) => (
                <div 
                  key={block.id} 
                  className="p-1"
                  style={{ 
                    padding: block.styles.padding ? `calc(${block.styles.padding} * 0.5)` : undefined,
                    borderRadius: block.styles.borderRadius ? `calc(${block.styles.borderRadius} * 0.8)` : undefined,
                  }}
                >
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
