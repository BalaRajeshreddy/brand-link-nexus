import { useState } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText as PDFIcon, Download, File } from "lucide-react";

interface PDFItem {
  title: string;
  file: string;
  thumbnail?: string;
}

interface PDFGalleryBlockProps {
  content: {
    pdfs: PDFItem[];
    displayType: string;
  };
  styles: Record<string, any>;
}

export const PDFGalleryBlock = ({ content, styles }: PDFGalleryBlockProps) => {
  const [items, setItems] = useState(content.pdfs || []);

  const handleFileUpload = async (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    // Simulate upload, replace with your upload logic
    const url = URL.createObjectURL(file);
    const updated = [...items];
    updated[idx].file = url;
    setItems(updated);
  };

  const getGridColumns = () => {
    const numItems = items.length;
    if (numItems <= 1) return 'grid-cols-1';
    if (numItems === 2) return 'grid-cols-2';
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
  };

  const renderGrid = () => (
    <div 
      className={`grid ${getGridColumns()} gap-4`}
      style={{ gap: styles.gap || '16px' }}
    >
      {items.map((item, idx) => (
        <Card key={idx} className="overflow-hidden flex flex-col items-center p-4">
          <AspectRatio ratio={4/3} className="w-full mb-2">
            {item.thumbnail ? (
              <img src={item.thumbnail} alt="PDF thumbnail" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <PDFIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </AspectRatio>
          <div className="w-full flex flex-col gap-2">
            <input
              type="text"
              value={item.title}
              onChange={e => { const updated = [...items]; updated[idx].title = e.target.value; setItems(updated); }}
              placeholder="Title"
              className="border rounded p-1 mb-1"
            />
            <input
              type="text"
              value={item.file}
              onChange={e => { const updated = [...items]; updated[idx].file = e.target.value; setItems(updated); }}
              placeholder="File URL or upload"
              className="border rounded p-1 mb-1"
            />
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={e => handleFileUpload(e, idx)}
              className="mb-1"
            />
            <input
              type="text"
              value={item.thumbnail || ''}
              onChange={e => { const updated = [...items]; updated[idx].thumbnail = e.target.value; setItems(updated); }}
              placeholder="Thumbnail URL (optional)"
              className="border rounded p-1 mb-1"
            />
            <div className="flex gap-2 mt-2">
              {item.file && (
                <a href={item.file} target="_blank" rel="noopener noreferrer" className="text-blue-600 flex items-center gap-1">
                  <Download className="h-4 w-4" /> Download
                </a>
              )}
              <Button type="button" variant="ghost" size="sm" onClick={() => setItems(items.filter((_, i) => i !== idx))}>Remove</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderList = () => (
    <div className="space-y-2" style={{ gap: styles.gap || '16px' }}>
      {items.map((pdf, index) => (
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
      <Button type="button" className="mt-4" onClick={() => setItems([...items, { title: '', file: '', thumbnail: '' }])}>Add PDF/DOC</Button>
      {content.displayType === 'list' ? renderList() : renderGrid()}
    </div>
  );
};
