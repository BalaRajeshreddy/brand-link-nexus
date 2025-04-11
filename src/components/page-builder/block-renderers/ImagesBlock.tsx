
import { useState } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ImageItem {
  src: string;
  alt: string;
}

interface ImagesBlockProps {
  content: {
    images: ImageItem[];
    displayType: string;
  };
  styles: Record<string, any>;
}

export const ImagesBlock = ({ content, styles }: ImagesBlockProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getGridColumns = () => {
    const numImages = content.images.length;
    if (numImages <= 1) return 'grid-cols-1';
    if (numImages === 2) return 'grid-cols-2';
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
  };

  const renderGrid = () => (
    <div 
      className={`grid ${getGridColumns()} gap-4`}
      style={{ gap: styles.gap || '16px' }}
    >
      {content.images.map((image, index) => (
        <div 
          key={index} 
          className="cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setSelectedImage(image.src)}
        >
          <AspectRatio ratio={styles.aspectRatio ? parseFloat(styles.aspectRatio) : 1}>
            {image.src ? (
              <img 
                src={image.src} 
                alt={image.alt} 
                className="object-cover w-full h-full rounded-md"
                style={{ borderRadius: styles.borderRadius || '8px' }}
              />
            ) : (
              <div 
                className="w-full h-full bg-gray-200 flex items-center justify-center"
                style={{ borderRadius: styles.borderRadius || '8px' }}
              >
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </AspectRatio>
        </div>
      ))}
    </div>
  );

  const renderSlider = () => (
    <div className="overflow-x-auto pb-4">
      <div 
        className="flex space-x-4"
        style={{ gap: styles.gap || '16px' }}
      >
        {content.images.map((image, index) => (
          <div 
            key={index} 
            className="cursor-pointer hover:opacity-90 transition-opacity flex-none"
            onClick={() => setSelectedImage(image.src)}
            style={{ 
              width: '250px',
            }}
          >
            <AspectRatio ratio={styles.aspectRatio ? parseFloat(styles.aspectRatio) : 3/2}>
              {image.src ? (
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="object-cover w-full h-full rounded-md"
                  style={{ borderRadius: styles.borderRadius || '8px' }}
                />
              ) : (
                <div 
                  className="w-full h-full bg-gray-200 flex items-center justify-center"
                  style={{ borderRadius: styles.borderRadius || '8px' }}
                >
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </AspectRatio>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMasonry = () => (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-4" style={{ gap: styles.gap || '16px' }}>
      {content.images.map((image, index) => (
        <div 
          key={index} 
          className="cursor-pointer hover:opacity-90 transition-opacity mb-4"
          onClick={() => setSelectedImage(image.src)}
        >
          {image.src ? (
            <img 
              src={image.src} 
              alt={image.alt} 
              className="object-cover w-full rounded-md"
              style={{ borderRadius: styles.borderRadius || '8px' }}
            />
          ) : (
            <div 
              className="w-full h-40 bg-gray-200 flex items-center justify-center"
              style={{ borderRadius: styles.borderRadius || '8px' }}
            >
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderImages = () => {
    switch (content.displayType) {
      case 'slider':
        return renderSlider();
      case 'masonry':
        return renderMasonry();
      case 'grid':
      default:
        return renderGrid();
    }
  };

  return (
    <div 
      className="images-block w-full my-4"
      style={{
        backgroundColor: styles.backgroundColor || 'transparent',
        padding: styles.padding || '16px',
        borderRadius: styles.borderRadius || '8px',
      }}
    >
      {renderImages()}
      
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Full size" 
              className="w-full h-auto"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
