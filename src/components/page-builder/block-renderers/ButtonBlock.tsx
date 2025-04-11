
import { Button } from "@/components/ui/button";

interface ButtonBlockProps {
  content: {
    text: string;
    url: string;
    style: string;
  };
  styles: Record<string, any>;
}

export const ButtonBlock = ({ content, styles }: ButtonBlockProps) => {
  const getButtonVariant = () => {
    switch (content.style) {
      case 'outline':
        return 'outline';
      case 'ghost':
        return 'ghost';
      case 'link':
        return 'link';
      case 'filled':
      default:
        return 'default';
    }
  };

  return (
    <div 
      className="button-block w-full my-4"
      style={{
        backgroundColor: styles.backgroundColor || 'transparent',
        padding: styles.padding || '16px',
        borderRadius: styles.borderRadius || '8px',
        textAlign: styles.textAlign || 'left'
      }}
    >
      <Button 
        variant={getButtonVariant()}
        asChild
        className="transition-colors"
        style={{
          backgroundColor: getButtonVariant() === 'default' ? (styles.backgroundColor || '#3B82F6') : undefined,
          color: styles.textColor || '#FFFFFF',
          borderRadius: styles.borderRadius || '8px',
          padding: styles.padding || '12px 24px',
        }}
      >
        <a 
          href={content.url} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          {content.text}
        </a>
      </Button>
    </div>
  );
};
