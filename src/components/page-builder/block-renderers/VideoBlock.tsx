
import { useState } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";

interface VideoBlockProps {
  content: {
    src: string;
    thumbnail: string;
    provider: string;
  };
  styles: Record<string, any>;
}

export const VideoBlock = ({ content, styles }: VideoBlockProps) => {
  const [playing, setPlaying] = useState(false);

  const getEmbedUrl = () => {
    if (!content.src) return '';
    
    if (content.provider === 'youtube') {
      // Extract YouTube video ID
      const match = content.src.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
      const youtubeId = match && match[1];
      
      if (youtubeId) {
        return `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
      }
    } else if (content.provider === 'vimeo') {
      // Extract Vimeo video ID
      const match = content.src.match(/(?:vimeo\.com\/(?:video\/|channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?))/);
      const vimeoId = match && match[1];
      
      if (vimeoId) {
        return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
      }
    }
    
    return content.src;
  };

  return (
    <div 
      className="video-block w-full my-4"
      style={{
        backgroundColor: styles.backgroundColor || 'transparent',
        padding: styles.padding || '16px',
        borderRadius: styles.borderRadius || '8px',
      }}
    >
      <Card className="overflow-hidden">
        <AspectRatio ratio={16/9}>
          {playing ? (
            <iframe
              src={getEmbedUrl()}
              title="Video Player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center cursor-pointer relative"
              onClick={() => setPlaying(true)}
            >
              {content.thumbnail ? (
                <img 
                  src={content.thumbnail} 
                  alt="Video thumbnail" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200"></div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white bg-opacity-80 rounded-full p-4">
                  <Play className="h-10 w-10 text-primary" />
                </div>
              </div>
            </div>
          )}
        </AspectRatio>
      </Card>
    </div>
  );
};
