
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface Testimonial {
  text: string;
  author: string;
}

interface TestimonialsBlockProps {
  content: {
    testimonials: Testimonial[];
    displayType: string;
  };
  styles: Record<string, any>;
}

export const TestimonialsBlock = ({ content, styles }: TestimonialsBlockProps) => {
  const getGridColumns = () => {
    const numTestimonials = content.testimonials.length;
    if (numTestimonials <= 1) return 'grid-cols-1';
    if (numTestimonials === 2) return 'grid-cols-2';
    return 'grid-cols-1 md:grid-cols-2';
  };

  const renderCards = () => (
    <div 
      className={`grid ${getGridColumns()} gap-4`}
      style={{ gap: styles.gap || '16px' }}
    >
      {content.testimonials.map((testimonial, index) => (
        <Card 
          key={index}
          style={{ 
            backgroundColor: styles.cardBgColor || '#FFFFFF',
            borderRadius: styles.cardBorderRadius || '8px',
          }}
        >
          <CardContent className="p-5 relative">
            <Quote className="absolute top-4 left-4 text-gray-200 h-10 w-10 opacity-50 -z-10" />
            <p className="italic mb-4" style={{ color: styles.textColor || '#000000' }}>
              "{testimonial.text}"
            </p>
            <p className="font-medium text-sm">— {testimonial.author}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderSimple = () => (
    <div className="space-y-6" style={{ gap: styles.gap || '16px' }}>
      {content.testimonials.map((testimonial, index) => (
        <div key={index} className="relative pl-6">
          <Quote className="absolute top-0 left-0 h-4 w-4 text-gray-400" />
          <p className="italic mb-2" style={{ color: styles.textColor || '#000000' }}>
            "{testimonial.text}"
          </p>
          <p className="font-medium text-sm">— {testimonial.author}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div 
      className="testimonials-block w-full my-4"
      style={{
        backgroundColor: styles.backgroundColor || 'transparent',
        padding: styles.padding || '16px',
        borderRadius: styles.borderRadius || '8px',
      }}
    >
      {content.displayType === 'simple' ? renderSimple() : renderCards()}
    </div>
  );
};
