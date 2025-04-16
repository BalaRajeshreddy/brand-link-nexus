
import { ProductComponent } from "@/pages/ProductPageCreator";
import { ProductComponentRenderer } from "./ProductComponentRenderer";

interface ProductEditorPreviewProps {
  components: ProductComponent[];
  pageSettings: {
    backgroundColor: string;
    fontFamily: string;
  };
}

export function ProductEditorPreview({ components, pageSettings }: ProductEditorPreviewProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-medium">Mobile Preview</h3>
        <p className="text-xs text-muted-foreground mt-1">See how your product page looks on mobile</p>
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
              backgroundColor: pageSettings.backgroundColor,
              fontFamily: pageSettings.fontFamily
            }}
          >
            {components.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">No content added yet</p>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {components.map((component) => (
                  <div 
                    key={component.id} 
                    className="bg-white rounded-lg shadow p-4"
                  >
                    <ProductComponentRenderer
                      type={component.type}
                      content={component.content}
                      styles={component.styles}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
