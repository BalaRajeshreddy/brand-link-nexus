import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

const LandingPageEditor: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left Section - Component Blocks */}
      <div className="w-1/4 border-r border-border bg-muted/30">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Components</h2>
        </div>
        <div className="p-4 pt-0 space-y-2">
          {/* Component blocks */}
          <div className="p-3 bg-card rounded-lg shadow-sm cursor-pointer hover:bg-accent">
            Header Block
          </div>
          <div className="p-3 bg-card rounded-lg shadow-sm cursor-pointer hover:bg-accent">
            Text Block
          </div>
          <div className="p-3 bg-card rounded-lg shadow-sm cursor-pointer hover:bg-accent">
            Image Block
          </div>
        </div>
      </div>

      {/* Middle Section - Direct Preview */}
      <div className="flex-1">
        <ScrollArea className="h-screen w-full">
          <div className="p-6">
            {/* Preview content */}
            <div className="space-y-6 pb-40">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="p-6 bg-white rounded-lg shadow-sm">
                  <input 
                    type="text" 
                    placeholder="Enter text here"
                    className="w-full p-2 border rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Right Section - Mobile Preview */}
      <div className="w-1/4 border-l border-border bg-muted/30 flex flex-col h-screen">
        <div className="p-4 flex-none">
          <h2 className="text-lg font-semibold">Mobile Preview</h2>
        </div>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="p-4">
              <div className="mx-auto max-w-[375px] bg-white rounded-lg shadow">
                <div className="space-y-6 p-4 pb-40">
                  {[...Array(15)].map((_, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded">
                      <input 
                        type="text" 
                        placeholder="Mobile preview item"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default LandingPageEditor; 