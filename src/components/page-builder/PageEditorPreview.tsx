
import { Block, BlockType, BlockStyles } from "@/types/block";
import { BlockEditorMain } from "./block-renderers/BlockEditorMain";
import { CSSProperties } from "react";

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
      
      <div className="flex-1 p-4">
        <div 
          className="mx-auto border border-gray-300 rounded-3xl overflow-hidden w-[390px]"
          style={{ height: '844px' }}
        >
          <div className="bg-black p-2 w-full flex justify-center items-center">
            <div className="bg-gray-800 w-32 h-6 rounded-full"></div>
          </div>
          <div 
            className="h-full w-full overflow-y-auto"
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
              <div className="p-6 space-y-6">
                {blocks.map((block) => {
                  // Convert BlockStyles to valid React CSSProperties
                  const cssStyles: CSSProperties = {};
                  
                  if (block.styles) {
                    // Copy all properties from block.styles to cssStyles
                    Object.keys(block.styles).forEach(key => {
                      // Special handling for flexDirection to ensure it's a valid FlexDirection
                      if (key === 'flexDirection') {
                        const value = block.styles[key];
                        // Only assign valid FlexDirection values
                        if (['row', 'row-reverse', 'column', 'column-reverse'].includes(value)) {
                          (cssStyles as any)[key] = value;
                        }
                      } else {
                        (cssStyles as any)[key] = block.styles[key];
                      }
                    });
                  }
                  
                  return (
                    <div 
                      key={block.id} 
                      className="bg-white rounded-lg shadow p-4"
                      style={cssStyles}
                    >
                      <BlockEditorMain
                        blockType={block.type as BlockType}
                        content={block.content}
                        styles={block.styles || {}}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
