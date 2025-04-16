
import React from 'react';
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
      
    case 'ratings':
      return (
        <div style={styles} className="w-full">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="ratings">
              <AccordionTrigger className="font-medium">
                Ratings & Reviews
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-1">
                    {Array(5).fill(0).map((_, i) => (
                      <Star 
                        key={i} 
                        className={i < (content.rating || 4) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                        size={16}
                      />
                    ))}
                    <span className="ml-2 text-sm">{content.rating || 4}/5 ({content.reviewCount || 42} reviews)</span>
                  </div>
                  
                  {(content.reviews || []).length > 0 ? (
                    <div className="space-y-2">
                      {content.reviews.map((review: any, i: number) => (
                        <div key={i} className="border-t pt-2">
                          <div className="flex items-center gap-1">
                            {Array(5).fill(0).map((_, j) => (
                              <Star 
                                key={j} 
                                className={j < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                size={12}
                              />
                            ))}
                          </div>
                          <p className="text-sm mt-1">{review.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">- {review.author}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No reviews yet</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      );

    case 'story':
      return (
        <div style={styles} className="w-full">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="story">
              <AccordionTrigger className="font-medium">
                Our Story
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm">{content.story || "Tell the story of your product or brand here."}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      );

    case 'howmade':
      return (
        <div style={styles} className="w-full">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="howmade">
              <AccordionTrigger className="font-medium">
                How It's Made
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm">{content.description || "Describe the process of creating your product here."}</p>
                {content.steps && content.steps.length > 0 && (
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    {content.steps.map((step: string, i: number) => (
                      <li key={i} className="text-sm">{step}</li>
                    ))}
                  </ol>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      );

    case 'nutrition':
      return (
        <div style={styles} className="w-full">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="nutrition">
              <AccordionTrigger className="font-medium">
                Nutrition Facts
              </AccordionTrigger>
              <AccordionContent>
                {content.facts && Object.keys(content.facts).length > 0 ? (
                  <div className="border rounded p-3 text-sm">
                    <div className="text-lg font-bold border-b pb-1 mb-2">Nutrition Facts</div>
                    <div className="space-y-1">
                      {Object.entries(content.facts).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex justify-between border-b py-1">
                          <span>{key}</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No nutrition facts available</div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      );

    case 'ingredients':
      return (
        <div style={styles} className="w-full">
          <div className="p-3 border rounded-lg">
            <h4 className="font-medium mb-2">Ingredients</h4>
            <p className="text-sm">{content.list || "Add your ingredients list here"}</p>
          </div>
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
