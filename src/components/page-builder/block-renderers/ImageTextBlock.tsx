
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ImageTextBlockProps {
  content: {
    image: {
      src: string;
      alt: string;
    };
    text: string;
    layout: string;
  };
  styles: Record<string, any>;
}

export const ImageTextBlock = ({ content, styles }: ImageTextBlockProps) => {
  const isImageLeft = content.layout === 'image-left';
  
  return (
    <div 
      className="image-text-block w-full my-4"
      style={{
        backgroundColor: styles.backgroundColor || 'transparent',
        padding: styles.padding || '16px',
        borderRadius: styles.borderRadius || '8px',
      }}
    >
      <div className={`flex flex-col ${isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-4 items-center`}
        style={{ gap: styles.gap || '24px' }}
      >
        <div 
          className="w-full md:w-1/2" 
          style={{ width: styles.imageWidth || '50%' }}
        >
          <AspectRatio ratio={16/9}>
            {content.image.src ? (
              <img 
                src={content.image.src} 
                alt={content.image.alt} 
                className="object-cover w-full h-full rounded-md"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </AspectRatio>
        </div>
        <div 
          className="w-full md:w-1/2"
          style={{ 
            width: styles.textWidth || '50%',
            color: styles.textColor || '#000000',
            textAlign: styles.textAlign || 'left'
          }}
        >
          <p>{content.text}</p>
        </div>
      </div>
    </div>
  );
};
