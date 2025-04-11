
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText as PDFIcon, Download } from "lucide-react";

interface PDFItem {
  title: string;
  file: string;
  thumbnail: string;
}

interface PDFGalleryBlockProps {
  content: {
    pdfs: PDFItem[];
    displayType: string;
  };
  styles: Record<string, any>;
}

export const PDFGalleryBlock = ({ content, styles }: PDFGalleryBlockProps) => {
  const getGridColumns = () => {
    const numItems = content.pdfs.length;
    if (numItems <= 1) return 'grid-cols-1';
    if (numItems === 2) return 'grid-cols-2';
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
  };

  const renderGrid = () => (
    <div 
      className={`grid ${getGridColumns()} gap-4`}
      style={{ gap: styles.gap || '16px' }}
    >
      {content.pdfs.map((pdf, index) => (
        <Card key={index} className="overflow-hidden">
          <AspectRatio ratio={3/4}>
            {pdf.thumbnail ? (
              <img 
                src={pdf.thumbnail} 
                alt={pdf.title} 
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
                <PDFIcon className="h-20 w-20 text-gray-400" />
                <span className="mt-2 text-gray-600">{pdf.title}</span>
              </div>
            )}
          </AspectRatio>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium truncate mr-2">{pdf.title}</span>
              <Button 
                size="sm" 
                variant="ghost"
                asChild
              >
                <a 
                  href={pdf.file} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  download
                >
                  <Download size={16} />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderList = () => (
    <div className="space-y-2" style={{ gap: styles.gap || '16px' }}>
      {content.pdfs.map((pdf, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="flex items-center p-3">
            <div className="bg-gray-100 p-3 rounded">
              <PDFIcon className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-3 flex-grow">
              <span className="font-medium">{pdf.title}</span>
            </div>
            <Button 
              size="sm" 
              variant="ghost"
              asChild
            >
              <a 
                href={pdf.file} 
                target="_blank" 
                rel="noopener noreferrer" 
                download
              >
                <Download size={16} />
              </a>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div 
      className="pdf-gallery-block w-full my-4"
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
