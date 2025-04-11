
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface LinkItem {
  text: string;
  url: string;
  icon: string;
}

interface LinksBlockProps {
  content: {
    links: LinkItem[];
    displayType: string;
  };
  styles: Record<string, any>;
}

export const LinksBlock = ({ content, styles }: LinksBlockProps) => {
  const renderLinks = () => {
    switch (content.displayType) {
      case 'buttons':
        return (
          <div className="flex flex-wrap gap-2">
            {content.links.map((link, index) => (
              <Button
                key={index}
                variant="outline"
                asChild
                className="flex items-center gap-2"
              >
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: styles.textColor || '#000000' }}
                >
                  {link.text}
                  <ExternalLink size={14} />
                </a>
              </Button>
            ))}
          </div>
        );
      
      case 'cards':
        return (
          <div 
            className="grid gap-4"
            style={{ 
              gridTemplateColumns: `repeat(auto-fill, minmax(200px, 1fr))`,
              gap: `${styles.gap || '16px'}`
            }}
          >
            {content.links.map((link, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex flex-col items-center gap-2"
                    style={{ color: styles.textColor || '#000000' }}
                  >
                    <span className="font-medium">{link.text}</span>
                    <ExternalLink size={16} />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      
      case 'list':
      default:
        return (
          <ul className="space-y-2">
            {content.links.map((link, index) => (
              <li key={index}>
                <a 
                  href={link.url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:underline"
                  style={{ color: styles.iconColor || '#3B82F6' }}
                >
                  <span>{link.text}</span>
                  <ExternalLink size={14} />
                </a>
              </li>
            ))}
          </ul>
        );
    }
  };

  return (
    <div 
      className="links-block w-full my-4"
      style={{
        backgroundColor: styles.backgroundColor || 'transparent',
        padding: styles.padding || '16px',
        borderRadius: styles.borderRadius || '8px',
      }}
    >
      {renderLinks()}
    </div>
  );
};
