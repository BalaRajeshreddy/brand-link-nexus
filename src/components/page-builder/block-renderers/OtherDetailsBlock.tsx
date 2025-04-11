
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface DetailSection {
  title: string;
  content: string;
}

interface OtherDetailsBlockProps {
  content: {
    sections: DetailSection[];
  };
  styles: Record<string, any>;
}

export const OtherDetailsBlock = ({ content, styles }: OtherDetailsBlockProps) => {
  return (
    <div 
      className="other-details-block w-full my-4"
      style={{
        backgroundColor: styles.backgroundColor || 'transparent',
        padding: styles.padding || '16px',
        borderRadius: styles.borderRadius || '8px',
      }}
    >
      <Card>
        {content.sections.map((section, index) => (
          <div key={index}>
            {index > 0 && <Separator />}
            <div className="p-4">
              <h3 
                className="font-medium mb-1" 
                style={{ color: styles.textColor || '#000000' }}
              >
                {section.title}
              </h3>
              <p className="text-sm text-muted-foreground">{section.content}</p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};
