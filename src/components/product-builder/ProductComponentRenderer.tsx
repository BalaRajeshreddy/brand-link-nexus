
import React from 'react';
import { Button } from "@/components/ui/button";

interface ProductComponentRendererProps {
  type: string;
  content: Record<string, any>;
  styles: Record<string, any>;
}

export function ProductComponentRenderer({ type, content, styles }: ProductComponentRendererProps) {
  switch (type.toLowerCase()) {
    case 'section':
      return (
        <div style={styles}>
          <h3 className="text-lg font-semibold">{content.title || 'Section'}</h3>
        </div>
      );
      
    case 'image':
      return (
        <div style={styles}>
          {content.src ? (
            <img 
              src={content.src} 
              alt={content.alt || 'Product image'} 
              className="w-full h-auto rounded"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center text-gray-400">
              No image uploaded
            </div>
          )}
        </div>
      );
      
    case 'text':
      return (
        <div style={styles}>
          <p>{content.text || 'Add your text here'}</p>
        </div>
      );
      
    case 'button':
      return (
        <div>
          <Button 
            style={{
              backgroundColor: styles.backgroundColor,
              color: styles.color,
              padding: styles.padding,
              borderRadius: styles.borderRadius,
            }}
          >
            {content.text || 'Button'}
          </Button>
        </div>
      );
      
    case 'action':
      return (
        <div style={styles}>
          <a 
            href={content.url || '#'} 
            className="flex items-center text-blue-600 hover:underline"
          >
            {content.label || 'Action Link'} →
          </a>
        </div>
      );
      
    case 'youtube':
      return (
        <div style={styles} className="aspect-video">
          {content.videoId ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${content.videoId}`}
              title={content.title || "YouTube video player"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded"
            ></iframe>
          ) : (
            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-400">
              YouTube Video (add video ID)
            </div>
          )}
        </div>
      );
      
    case 'instagram':
      return (
        <div style={styles}>
          {content.postUrl ? (
            <div className="instagram-embed border rounded p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 to-purple-500"></div>
                <span className="ml-2 font-medium">Instagram Post Preview</span>
              </div>
              <p className="text-sm">{content.title || 'Instagram post embed'}</p>
              <div className="text-xs text-blue-500 mt-2">View on Instagram</div>
            </div>
          ) : (
            <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center text-gray-400">
              Instagram Post (add URL)
            </div>
          )}
        </div>
      );
      
    default:
      return (
        <div className="p-4 border rounded">
          <p className="text-muted-foreground">Unknown component type: {type}</p>
        </div>
      );
  }
}
