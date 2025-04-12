
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  BlockContent, 
  HeadingTextContent, 
  ImagesContent, 
  ImagesLinksContent, 
  ButtonContent, 
  VideoContent, 
  FormContent 
} from './BlockEditorMain';

interface SortableBlockProps {
  block: {
    id: string;
    type: string;
    content: BlockContent;
  };
  onUpdate: (id: string, content: BlockContent) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
}

export function SortableBlock({ block, onUpdate, onDelete, onDuplicate, onMove }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderContent = () => {
    switch (block.type) {
      case 'heading-text':
        const headingContent = block.content as HeadingTextContent;
        return (
          <div>
            <h2>{headingContent.heading}</h2>
            <p>{headingContent.text}</p>
          </div>
        );
      case 'image':
        return (
          <img 
            src={(block.content as any).src || (block.content as any).image?.src} 
            alt={(block.content as any).alt || (block.content as any).image?.alt || "Image"} 
            className="w-full h-auto"
          />
        );
      case 'images':
        const imagesContent = block.content as ImagesContent;
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {imagesContent.images.map((image, index) => (
              <div key={index} className="text-center">
                <img 
                  src={image.src} 
                  alt={image.alt || `Image ${index + 1}`} 
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>
        );
      case 'images-links':
        const imagesLinksContent = block.content as ImagesLinksContent;
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {imagesLinksContent.images.map((image, index) => (
              <div key={index} className="text-center">
                <a href={image.link} target="_blank" rel="noopener noreferrer">
                  <img 
                    src={image.src} 
                    alt={image.alt || `Image ${index + 1}`} 
                    className="w-full h-auto"
                  />
                </a>
              </div>
            ))}
          </div>
        );
      case 'button':
        const buttonContent = block.content as ButtonContent;
        return (
          <button
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={() => window.location.href = buttonContent.url}
          >
            {buttonContent.text}
          </button>
        );
      case 'video':
        const videoContent = block.content as VideoContent;
        return (
          <video 
            src={videoContent.src} 
            controls 
            className="w-full"
          />
        );
      case 'form':
        const formContent = block.content as FormContent;
        return (
          <form className="space-y-4">
            {formContent.fields.map((field, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            ))}
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
    >
      {renderContent()}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onUpdate(block.id, block.content)}
          className="p-1 bg-white rounded shadow hover:bg-gray-100"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(block.id)}
          className="p-1 bg-white rounded shadow hover:bg-gray-100"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <button
          onClick={() => onDuplicate(block.id)}
          className="p-1 bg-white rounded shadow hover:bg-gray-100"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
        </button>
        <button
          onClick={() => onMove(block.id, 'up')}
          className="p-1 bg-white rounded shadow hover:bg-gray-100"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={() => onMove(block.id, 'down')}
          className="p-1 bg-white rounded shadow hover:bg-gray-100"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
