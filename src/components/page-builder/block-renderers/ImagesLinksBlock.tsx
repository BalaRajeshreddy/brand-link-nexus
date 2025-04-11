
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface ImageLink {
  src: string;
  alt: string;
  link: string;
  title: string;
}

interface ImagesLinksBlockProps {
  content: {
    images: ImageLink[];
    displayType: string;
  };
  styles: Record<string, any>;
}

export const ImagesLinksBlock = ({ content, styles }: ImagesLinksBlockProps) => {
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
      {content.images.map((item, index) => (
        <Card key={index} className="overflow-hidden hover:shadow-md transition-all">
          <a 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            <AspectRatio ratio={styles.aspectRatio ? parseFloat(styles.aspectRatio) : 3/2}>
              {item.src ? (
                <img 
                  src={item.src} 
                  alt={item.alt} 
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </AspectRatio>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.title}</span>
                <ExternalLink size={14} className="text-gray-500" />
              </div>
            </CardContent>
          </a>
        </Card>
      ))}
    </div>
  );

  const renderList = () => (
    <div className="space-y-4" style={{ gap: styles.gap || '16px' }}>
      {content.images.map((item, index) => (
        <Card key={index} className="overflow-hidden hover:shadow-md transition-all">
          <a 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <div className="w-24 h-24">
              {item.src ? (
                <img 
                  src={item.src} 
                  alt={item.alt} 
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.title}</span>
                <ExternalLink size={14} className="text-gray-500" />
              </div>
            </CardContent>
          </a>
        </Card>
      ))}
    </div>
  );

  return (
    <div 
      className="images-links-block w-full my-4"
      style={{
        backgroundColor: styles.backgroundColor || 'transparent',
        padding: styles.padding || '16px',
        borderRadius: styles.borderRadius || '8px',
      }}
    >
      {content.displayType === 'list' ? renderList() : renderGrid()}
    </div>
  );
};
