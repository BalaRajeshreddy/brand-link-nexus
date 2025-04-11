
import { ScrollArea } from "@/components/ui/scroll-area";
import { Block } from "./PageBuilder";
import { BlockEditorMain } from "./block-renderers/BlockEditorMain";

interface PageEditorPreviewProps {
  blocks: Block[];
  pageStyles: {
    backgroundColor: string;
    fontFamily: string;
  };
}

export function PageEditorPreview({ blocks, pageStyles }: PageEditorPreviewProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-medium">Mobile Preview</h3>
        <p className="text-xs text-muted-foreground mt-1">See how your page looks on mobile</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div 
            className="mx-auto border border-gray-300 rounded-3xl overflow-hidden w-[320px]"
            style={{ height: '600px' }}
          >
            <div className="bg-black p-2 w-full flex justify-center items-center">
              <div className="bg-gray-800 w-32 h-6 rounded-full"></div>
            </div>
            <div 
              className="h-full w-full overflow-auto"
              style={{
                backgroundColor: pageStyles.backgroundColor,
                fontFamily: pageStyles.fontFamily
              }}
            >
              {blocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-sm text-muted-foreground">No content added yet</p>
                </div>
              ) : (
                <div className="p-2">
                  {blocks.map((block) => (
                    <div key={block.id} className="mb-4">
                      <BlockEditorMain
                        blockType={block.type}
                        content={block.content}
                        styles={block.styles}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
