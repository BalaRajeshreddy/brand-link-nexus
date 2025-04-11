import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, ChevronUp, ChevronDown, Palette } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Block } from "./PageBuilder";
import { BlockEditor } from "./BlockEditor";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PageEditorCanvasProps {
  blocks: Block[];
  onDeleteBlock: (blockId: string) => void;
  onUpdateBlock: (blockId: string, content: Record<string, any>, styles: Record<string, any>) => void;
  openMediaLibrary: (blockId: string, fieldPath: string, altPath?: string) => void;
  pageStyles: {
    backgroundColor: string;
    fontFamily: string;
  };
}

function SortableBlock({ block, onDelete, onEdit, pageStyles }: { 
  block: Block; 
  onDelete: () => void; 
  onEdit: () => void;
  pageStyles: {
    backgroundColor: string;
    fontFamily: string;
  };
}) {
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

  const renderBlockContent = (block: Block) => {
    switch (block.type) {
      case 'heading':
        return <h2 
          className="text-2xl font-bold" 
          style={{ 
            color: block.styles.textColor,
            fontSize: block.styles.fontSize,
            textAlign: block.styles.textAlign
          }}
        >
          {block.content.text || "Heading Text"}
        </h2>;
      
      case 'text':
        return <p 
          className="text-base" 
          style={{ 
            color: block.styles.textColor,
            fontSize: block.styles.fontSize,
            textAlign: block.styles.textAlign
          }}
        >
          {block.content.text || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sit amet justo vel nunc tincidunt commodo."}
        </p>;
      
      case 'heading + text':
        return (
          <div className="space-y-2">
            <h2 
              className="text-xl font-bold" 
              style={{ 
                color: block.styles.textColor,
                fontSize: block.styles.headingSize,
                textAlign: block.styles.textAlign
              }}
            >
              {block.content.heading || "Heading"}
            </h2>
            <p 
              className="text-base" 
              style={{ 
                color: block.styles.textColor,
                fontSize: block.styles.textSize,
                textAlign: block.styles.textAlign
              }}
            >
              {block.content.text || "Text content goes here."}
            </p>
          </div>
        );
      
      case 'image':
        return block.content.src ? (
          <img 
            src={block.content.src} 
            alt={block.content.alt || ""} 
            className="w-full rounded-md"
          />
        ) : (
          <div 
            className="bg-gray-100 rounded-md flex items-center justify-center h-40"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "#f3f4f6"
            }}
          >
            <span className="text-gray-500">Image Placeholder</span>
          </div>
        );
      
      case 'images':
        const images = block.content.images || [{ src: "", alt: "" }, { src: "", alt: "" }, { src: "", alt: "" }];
        
        if (block.content.displayType === 'carousel' || block.content.displayType === 'slider') {
          return (
            <div className="w-full relative px-8">
              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((image: any, i: number) => (
                    <CarouselItem key={i}>
                      {image.src ? (
                        <img 
                          src={image.src} 
                          alt={image.alt || ""} 
                          className="w-full h-40 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center">
                          <span className="text-gray-500">Image {i+1}</span>
                        </div>
                      )}
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-1" />
                <CarouselNext className="-right-1" />
              </Carousel>
            </div>
          );
        } else {
          return (
            <div 
              className="grid grid-cols-3 w-full"
              style={{ gap: block.styles.gap || '16px' }}
            >
              {images.map((image: any, i: number) => (
                <div key={i}>
                  {image.src ? (
                    <img 
                      src={image.src} 
                      alt={image.alt || ""} 
                      className="w-full h-24 object-cover rounded-md"
                      style={{ borderRadius: block.styles.borderRadius }}
                    />
                  ) : (
                    <div 
                      className="w-full h-24 bg-gray-100 flex items-center justify-center"
                      style={{ borderRadius: block.styles.borderRadius }}
                    >
                      <span className="text-gray-500">Image {i+1}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        }

      case 'images + links':
        const linkedImages = block.content.images || [{ src: "", alt: "", link: "", title: "" }];
        
        if (block.content.displayType === 'carousel' || block.content.displayType === 'slider') {
          return (
            <div className="w-full relative px-8">
              <Carousel className="w-full">
                <CarouselContent>
                  {linkedImages.map((image: any, i: number) => (
                    <CarouselItem key={i}>
                      <a href={image.link || "#"} target="_blank" rel="noopener noreferrer" className="block">
                        {image.src ? (
                          <img 
                            src={image.src} 
                            alt={image.alt || ""} 
                            className="w-full h-40 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center">
                            <span className="text-gray-500">{image.title || `Link ${i+1}`}</span>
                          </div>
                        )}
                      </a>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-1" />
                <CarouselNext className="-right-1" />
              </Carousel>
            </div>
          );
        } else {
          return (
            <div 
              className="grid grid-cols-3 w-full"
              style={{ gap: block.styles.gap || '16px' }}
            >
              {linkedImages.map((image: any, i: number) => (
                <div key={i}>
                  <a href={image.link || "#"} target="_blank" rel="noopener noreferrer" className="block">
                    {image.src ? (
                      <div className="relative">
                        <img 
                          src={image.src} 
                          alt={image.alt || ""} 
                          className="w-full h-24 object-cover rounded-md"
                          style={{ borderRadius: block.styles.borderRadius }}
                        />
                        {image.title && (
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-md">
                            <span className="text-white text-sm font-medium">{image.title}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div 
                        className="w-full h-24 bg-gray-100 flex items-center justify-center"
                        style={{ borderRadius: block.styles.borderRadius }}
                      >
                        <span className="text-gray-500">{image.title || `Link ${i+1}`}</span>
                      </div>
                    )}
                  </a>
                </div>
              ))}
            </div>
          );
        }
      
      case 'video':
        return block.content.src ? (
          <div className="aspect-w-16 aspect-h-9">
            <iframe 
              src={block.content.provider === 'youtube' ? 
                `https://www.youtube.com/embed/${block.content.src.includes('watch?v=') ? 
                  block.content.src.split('watch?v=')[1] : block.content.src}` : 
                block.content.src} 
              className="w-full h-64 rounded-md"
              allowFullScreen
              title="Video player"
            ></iframe>
          </div>
        ) : (
          <div 
            className="bg-gray-100 rounded-md flex items-center justify-center h-40"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "#f3f4f6"
            }}
          >
            <span className="text-gray-500">
              Video Placeholder
            </span>
          </div>
        );
      
      case 'testimonials':
        const testimonials = block.content.testimonials || [
          { text: "This is a testimonial text. Great product or service!", author: "Customer Name" },
          { text: "I love using this product!", author: "Another Customer" }
        ];
        
        if (block.content.displayType === 'carousel') {
          return (
            <div className="w-full relative px-8">
              <Carousel className="w-full">
                <CarouselContent>
                  {testimonials.map((testimonial: any, i: number) => (
                    <CarouselItem key={i}>
                      <div 
                        className="p-4 rounded-md border bg-white"
                        style={{ 
                          backgroundColor: block.styles.cardBgColor || '#ffffff',
                          borderRadius: block.styles.cardBorderRadius || '8px',
                          boxShadow: block.styles.cardShadow === 'sm' ? '0 1px 2px rgba(0,0,0,0.1)' : 
                                    block.styles.cardShadow === 'md' ? '0 4px 6px rgba(0,0,0,0.1)' :
                                    block.styles.cardShadow === 'lg' ? '0 10px 15px rgba(0,0,0,0.1)' : 'none'
                        }}
                      >
                        <p className="italic text-muted-foreground" style={{ color: block.styles.textColor }}>
                          "{testimonial.text}"
                        </p>
                        <p className="mt-2 font-medium" style={{ color: block.styles.textColor }}>
                          - {testimonial.author}
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-1" />
                <CarouselNext className="-right-1" />
              </Carousel>
            </div>
          );
        } else if (block.content.displayType === 'quotes') {
          return (
            <div className="space-y-4">
              {testimonials.map((testimonial: any, i: number) => (
                <blockquote 
                  key={i} 
                  className="pl-4 border-l-4 italic"
                  style={{ 
                    borderColor: block.styles.textColor || '#000',
                    color: block.styles.textColor 
                  }}
                >
                  <p>"{testimonial.text}"</p>
                  <footer className="mt-1 font-medium not-italic">— {testimonial.author}</footer>
                </blockquote>
              ))}
            </div>
          );
        } else {
          return (
            <div 
              className="grid grid-cols-1 md:grid-cols-2"
              style={{ gap: block.styles.gap || '16px' }}
            >
              {testimonials.map((testimonial: any, i: number) => (
                <div 
                  key={i} 
                  className="p-4 rounded-md border bg-white"
                  style={{ 
                    backgroundColor: block.styles.cardBgColor || '#ffffff',
                    borderRadius: block.styles.cardBorderRadius || '8px',
                    boxShadow: block.styles.cardShadow === 'sm' ? '0 1px 2px rgba(0,0,0,0.1)' : 
                              block.styles.cardShadow === 'md' ? '0 4px 6px rgba(0,0,0,0.1)' :
                              block.styles.cardShadow === 'lg' ? '0 10px 15px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  <p 
                    className="italic"
                    style={{ color: block.styles.textColor }}
                  >
                    "{testimonial.text}"
                  </p>
                  <p 
                    className="mt-2 font-medium"
                    style={{ color: block.styles.textColor }}
                  >
                    - {testimonial.author}
                  </p>
                </div>
              ))}
            </div>
          );
        }
      
      case 'smart feedback':
        return (
          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="font-medium" style={{ color: block.styles.textColor }}>
              {block.content.question || "How would you rate our service?"}
            </h3>
            <div className="flex flex-wrap gap-2">
              {(block.content.options || ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"]).map((option: string, i: number) => (
                <Button 
                  key={i} 
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  {option}
                </Button>
              ))}
            </div>
            {block.content.allowComments && (
              <div>
                <textarea 
                  placeholder="Add a comment (optional)" 
                  className="w-full p-2 border rounded-md text-sm"
                  rows={2}
                ></textarea>
              </div>
            )}
          </div>
        );
      
      case 'map':
        return (
          <div 
            className="bg-gray-100 rounded-md flex items-center justify-center h-40"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "#f3f4f6"
            }}
          >
            <span className="text-gray-500">
              {block.content.location || "Map Placeholder"}
            </span>
          </div>
        );
      
      case 'social links':
        const socialLinks = block.content.links || [
          { platform: 'twitter', url: '' },
          { platform: 'facebook', url: '' },
          { platform: 'instagram', url: '' }
        ];
        
        if (block.content.displayType === 'text') {
          return (
            <div 
              className="flex flex-col gap-2"
              style={{ 
                backgroundColor: block.styles.backgroundColor !== 'transparent' 
                  ? block.styles.backgroundColor 
                  : "transparent",
                textAlign: block.styles.textAlign,
                gap: block.styles.gap || '8px'
              }}
            >
              {socialLinks.map((link: any, i: number) => (
                <a 
                  key={i} 
                  href={link.url || "#"}
                  className="hover:underline"
                  style={{ color: block.styles.iconColor || '#3B82F6' }}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                </a>
              ))}
            </div>
          );
        } else if (block.content.displayType === 'buttons') {
          return (
            <div 
              className="flex flex-wrap"
              style={{ 
                gap: block.styles.gap || '8px',
                justifyContent: block.styles.textAlign === 'center' 
                  ? 'center' 
                  : block.styles.textAlign === 'right' 
                  ? 'flex-end' 
                  : 'flex-start'
              }}
            >
              {socialLinks.map((link: any, i: number) => (
                <Button 
                  key={i} 
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  style={{ color: block.styles.iconColor || '#3B82F6' }}
                  asChild
                >
                  <a href={link.url || "#"} target="_blank" rel="noopener noreferrer">
                    {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                  </a>
                </Button>
              ))}
            </div>
          );
        } else {
          return (
            <div 
              className="flex"
              style={{ 
                gap: block.styles.gap || '16px',
                justifyContent: block.styles.textAlign === 'center' 
                  ? 'center' 
                  : block.styles.textAlign === 'right' 
                  ? 'flex-end' 
                  : 'flex-start'
              }}
            >
              {socialLinks.map((link: any, i: number) => (
                <a 
                  key={i} 
                  href={link.url || "#"}
                  className="w-10 h-10 flex items-center justify-center rounded-full border"
                  style={{ color: block.styles.iconColor || '#3B82F6' }}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <div className="w-4 h-4 bg-current rounded-sm"></div>
                </a>
              ))}
            </div>
          );
        }
      
      case 'links':
        const links = block.content.links || [
          { text: 'Link 1', url: '', icon: '' },
          { text: 'Link 2', url: '', icon: '' }
        ];
        
        if (block.content.displayType === 'text') {
          return (
            <div 
              className="space-y-2"
              style={{ 
                backgroundColor: block.styles.backgroundColor !== 'transparent' 
                  ? block.styles.backgroundColor 
                  : "transparent",
                textAlign: block.styles.textAlign
              }}
            >
              {links.map((link: any, i: number) => (
                <div key={i}>
                  <a 
                    href={link.url || "#"}
                    className="hover:underline"
                    style={{ color: block.styles.iconColor || '#3B82F6' }}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {link.text || `Link ${i+1}`}
                  </a>
                </div>
              ))}
            </div>
          );
        } else if (block.content.displayType === 'pills') {
          return (
            <div 
              className="flex flex-wrap"
              style={{ 
                gap: block.styles.gap || '8px',
                justifyContent: block.styles.textAlign === 'center' 
                  ? 'center' 
                  : block.styles.textAlign === 'right' 
                  ? 'flex-end' 
                  : 'flex-start'
              }}
            >
              {links.map((link: any, i: number) => (
                <a 
                  key={i} 
                  href={link.url || "#"}
                  className="px-4 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  style={{ color: block.styles.iconColor || '#3B82F6' }}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {link.text || `Link ${i+1}`}
                </a>
              ))}
            </div>
          );
        } else {
          return (
            <div 
              className="flex flex-wrap"
              style={{ 
                gap: block.styles.gap || '8px',
                justifyContent: block.styles.textAlign === 'center' 
                  ? 'center' 
                  : block.styles.textAlign === 'right' 
                  ? 'flex-end' 
                  : 'flex-start'
              }}
            >
              {links.map((link: any, i: number) => (
                <Button 
                  key={i} 
                  variant="outline"
                  asChild
                >
                  <a 
                    href={link.url || "#"}
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: block.styles.iconColor || '#3B82F6' }}
                  >
                    {link.text || `Link ${i+1}`}
                  </a>
                </Button>
              ))}
            </div>
          );
        }
      
      case 'button':
        const buttonStyle = {
          backgroundColor: block.content.style === 'outline' || block.content.style === 'ghost' || block.content.style === 'link' 
            ? 'transparent' 
            : (block.styles.backgroundColor !== 'transparent' ? block.styles.backgroundColor : '#3B82F6'),
          color: block.content.style === 'outline' || block.content.style === 'ghost' || block.content.style === 'link'
            ? (block.styles.textColor || '#3B82F6')
            : (block.styles.textColor || '#FFFFFF'),
          borderRadius: block.styles.borderRadius || '8px',
          border: block.content.style === 'outline' ? `1px solid ${block.styles.textColor || '#3B82F6'}` : 'none',
          padding: block.styles.padding || '12px 24px',
          textDecoration: block.content.style === 'link' ? 'underline' : 'none'
        };
        
        return (
          <div 
            style={{ 
              textAlign: block.styles.textAlign,
              backgroundColor: 'transparent'
            }}
          >
            <a 
              href={block.content.url || "#"}
              className="inline-block"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button style={buttonStyle}>
                {block.content.text || "Buy Now"}
              </button>
            </a>
          </div>
        );

      case 'form':
      case 'contact form':
        const formFields = block.type === 'form' 
          ? block.content.fields || [
              { type: 'text', label: 'Name', required: true, placeholder: 'Enter your name' },
              { type: 'email', label: 'Email', required: true, placeholder: 'Enter your email' },
              { type: 'textarea', label: 'Message', required: false, placeholder: 'Enter your message' }
            ]
          : (block.content.fields || ['name', 'email', 'message']).map((field: string) => {
              return {
                type: field === 'message' ? 'textarea' : field === 'email' ? 'email' : 'text',
                label: field.charAt(0).toUpperCase() + field.slice(1),
                required: field === 'name' || field === 'email',
                placeholder: `Enter your ${field}`
              };
            });
        
        return (
          <div 
            className="p-4 rounded-md border"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "#ffffff",
              borderRadius: block.styles.borderRadius || '4px'
            }}
          >
            <form className="space-y-4">
              {formFields.map((field: any, i: number) => (
                <div key={i} className="space-y-1">
                  <label className="text-sm font-medium">{field.label}{field.required && ' *'}</label>
                  {field.type === 'textarea' ? (
                    <textarea 
                      className="w-full p-2 border rounded-md"
                      placeholder={field.placeholder}
                      rows={3}
                      style={{
                        backgroundColor: block.styles.fieldBgColor || '#FFFFFF',
                        borderRadius: block.styles.fieldBorderRadius || '4px',
                        borderColor: block.styles.fieldBorderColor || '#E2E8F0'
                      }}
                    ></textarea>
                  ) : (
                    <input 
                      type={field.type}
                      className="w-full p-2 border rounded-md"
                      placeholder={field.placeholder}
                      style={{
                        backgroundColor: block.styles.fieldBgColor || '#FFFFFF',
                        borderRadius: block.styles.fieldBorderRadius || '4px',
                        borderColor: block.styles.fieldBorderColor || '#E2E8F0'
                      }}
                    />
                  )}
                </div>
              ))}
              <button 
                type="button" 
                className="px-4 py-2 rounded-md"
                style={{ 
                  backgroundColor: block.styles.buttonColor || '#3B82F6',
                  color: block.styles.buttonTextColor || '#FFFFFF',
                  borderRadius: block.styles.fieldBorderRadius || '4px'
                }}
              >
                {block.content.submitText || "Submit"}
              </button>
            </form>
          </div>
        );

      case 'team':
        const members = block.content.members || [
          { name: "Team Member 1", role: "CEO", photo: "" },
          { name: "Team Member 2", role: "CTO", photo: "" },
          { name: "Team Member 3", role: "Designer", photo: "" }
        ];
        
        if (block.content.displayType === 'list') {
          return (
            <ul 
              className="space-y-4"
              style={{ 
                color: block.styles.textColor,
              }}
            >
              {members.map((member: any, i: number) => (
                <li 
                  key={i} 
                  className="flex items-center gap-3"
                >
                  {member.photo ? (
                    <img 
                      src={member.photo} 
                      alt={member.name} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs">{member.name.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.role}</div>
                  </div>
                </li>
              ))}
            </ul>
          );
        } else if (block.content.displayType === 'grid') {
          return (
            <div 
              className="grid grid-cols-3 gap-4"
              style={{ gap: block.styles.gap || '16px' }}
            >
              {members.map((member: any, i: number) => (
                <div 
                  key={i} 
                  className="text-center"
                  style={{ color: block.styles.textColor }}
                >
                  {member.photo ? (
                    <img 
                      src={member.photo} 
                      alt={member.name} 
                      className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span>{member.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="font-medium">{member.name}</div>
                  <div className="text-xs text-muted-foreground">{member.role}</div>
                </div>
              ))}
            </div>
          );
        } else {
          return (
            <div 
              className="grid grid-cols-3 gap-4"
              style={{ gap: block.styles.gap || '16px' }}
            >
              {members.map((member: any, i: number) => (
                <div 
                  key={i} 
                  className="p-3 rounded-md border bg-white text-center"
                  style={{ 
                    backgroundColor: block.styles.cardBgColor || '#ffffff',
                    borderRadius: block.styles.cardBorderRadius || '8px',
                    boxShadow: block.styles.cardShadow === 'sm' ? '0 1px 2px rgba(0,0,0,0.1)' : 
                              block.styles.cardShadow === 'md' ? '0 4px 6px rgba(0,0,0,0.1)' :
                              block.styles.cardShadow === 'lg' ? '0 10px 15px rgba(0,0,0,0.1)' : 'none',
                    color: block.styles.textColor
                  }}
                >
                  {member.photo ? (
                    <img 
                      src={member.photo} 
                      alt={member.name} 
                      className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span>{member.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="font-medium">{member.name}</div>
                  <div className="text-xs text-muted-foreground">{member.role}</div>
                </div>
              ))}
            </div>
          );
        }

      case 'products':
        const products = block.content.products || [
          { name: "Product 1", description: "Product description", image: "", price: "99.99", link: "" },
          { name: "Product 2", description: "Product description", image: "", price: "149.99", link: "" },
          { name: "Product 3", description: "Product description", image: "", price: "199.99", link: "" }
        ];
        
        if (block.content.displayType === 'carousel') {
          return (
            <div className="w-full relative px-8">
              <Carousel className="w-full">
                <CarouselContent>
                  {products.map((product: any, i: number) => (
                    <CarouselItem key={i}>
                      <div 
                        className="p-4 rounded-md border bg-white"
                        style={{ 
                          backgroundColor: block.styles.cardBgColor || '#ffffff',
                          borderRadius: block.styles.cardBorderRadius || '8px',
                          boxShadow: block.styles.cardShadow === 'sm' ? '0 1px 2px rgba(0,0,0,0.1)' : 
                                    block.styles.cardShadow === 'md' ? '0 4px 6px rgba(0,0,0,0.1)' :
                                    block.styles.cardShadow === 'lg' ? '0 10px 15px rgba(0,0,0,0.1)' : 'none',
                          color: block.styles.textColor
                        }}
                      >
                        <div className="mb-3">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-32 object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                              <span className="text-gray-500">Product Image</span>
                            </div>
                          )}
                        </div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-bold">${product.price}</span>
                          <Button size="sm" asChild>
                            <a href={product.link || "#"}>Buy</a>
                          </Button>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-1" />
                <CarouselNext className="-right-1" />
              </Carousel>
            </div>
          );
        } else if (block.content.displayType === 'list') {
          return (
            <div 
              className="space-y-3"
              style={{ gap: block.styles.gap || '16px' }}
            >
              {products.map((product: any, i: number) => (
                <div 
                  key={i} 
                  className="flex gap-3 p-3 border rounded-md"
                  style={{ 
                    backgroundColor: block.styles.cardBgColor || '#ffffff',
                    borderRadius: block.styles.cardBorderRadius || '8px',
                    boxShadow: block.styles.cardShadow === 'sm' ? '0 1px 2px rgba(0,0,0,0.1)' : 
                              block.styles.cardShadow === 'md' ? '0 4px 6px rgba(0,0,0,0.1)' :
                              block.styles.cardShadow === 'lg' ? '0 10px 15px rgba(0,0,0,0.1)' : 'none',
                    color: block.styles.textColor
                  }}
                >
                  <div className="flex-shrink-0 w-20 h-20">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                        <span className="text-xs text-gray-500">Image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold">${product.price}</span>
                      <Button size="sm" asChild>
                        <a href={product.link || "#"}>Buy</a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        } else {
          return (
            <div 
              className="grid grid-cols-3"
              style={{ gap: block.styles.gap || '16px' }}
            >
              {products.map((product: any, i: number) => (
                <div 
                  key={i} 
                  className="p-3 border rounded-md bg-white"
                  style={{ 
                    backgroundColor: block.styles.cardBgColor || '#ffffff',
                    borderRadius: block.styles.cardBorderRadius || '8px',
                    boxShadow: block.styles.cardShadow === 'sm' ? '0 1px 2px rgba(0,0,0,0.1)' : 
                              block.styles.cardShadow === 'md' ? '0 4px 6px rgba(0,0,0,0.1)' :
                              block.styles.cardShadow === 'lg' ? '0 10px 15px rgba(0,0,0,0.1)' : 'none',
                    color: block.styles.textColor
                  }}
                >
                  <div className="mb-2">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-24 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-24 bg-gray-100 rounded-md flex items-center justify-center">
                        <span className="text-xs text-gray-500">Product Image</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-sm">{product.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold text-sm">${product.price}</span>
                    <Button size="sm" variant="outline" asChild>
                      <a href={product.link || "#"}>Buy</a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          );
        }
      
      case 'appointment/calendar':
        return (
          <div 
            className="p-4 border rounded-md"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "#ffffff",
              color: block.styles.textColor
            }}
          >
            <h3 className="font-medium mb-3">Book an Appointment</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div 
                    key={i}
                    className={`text-center py-2 rounded-md ${(block.content.availableDays || []).includes(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i]) ? 'bg-primary/20' : 'bg-gray-100 text-gray-400'}`}
                  >
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {(block.content.timeSlots || ['9:00', '10:00', '11:00', '13:00', '14:00', '15:00']).slice(0, 6).map((slot: string, i: number) => (
                  <div 
                    key={i}
                    className="text-center py-1 px-1 border rounded-md hover:bg-primary/10 cursor-pointer"
                  >
                    {slot}
                  </div>
                ))}
              </div>
              
              {block.content.contactRequired && (
                <div className="pt-2 border-t space-y-2">
                  <input type="text" placeholder="Your name" className="w-full p-2 text-sm border rounded-md" />
                  <input type="email" placeholder="Your email" className="w-full p-2 text-sm border rounded-md" />
                  <button className="w-full py-2 bg-primary text-white rounded-md text-sm">Schedule</button>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'business hours':
        const hours = block.content.hours || [
          { day: "Monday", open: "9:00 AM", close: "5:00 PM", closed: false },
          { day: "Tuesday", open: "9:00 AM", close: "5:00 PM", closed: false },
          { day: "Wednesday", open: "9:00 AM", close: "5:00 PM", closed: false },
          { day: "Thursday", open: "9:00 AM", close: "5:00 PM", closed: false },
          { day: "Friday", open: "9:00 AM", close: "5:00 PM", closed: false },
          { day: "Saturday", open: "10:00 AM", close: "2:00 PM", closed: false },
          { day: "Sunday", open: "", close: "", closed: true }
        ];
        
        return (
          <div 
            className="p-4 border rounded-md"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "#ffffff",
              color: block.styles.textColor,
              borderRadius: block.styles.borderRadius || '4px'
            }}
          >
            <h3 className="font-medium mb-3">Business Hours</h3>
            <table className="w-full text-sm">
              <tbody>
                {hours.map((hour: any, i: number) => (
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="py-2 font-medium">{hour.day}</td>
                    <td className="py-2 text-right">
                      {hour.closed ? (
                        <span className="text-muted-foreground">Closed</span>
                      ) : (
                        `${hour.open} - ${hour.close}`
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      
      case 'pdf gallery':
        const pdfs = block.content.pdfs || [
          { title: "Document 1", file: "", thumbnail: "" },
          { title: "Document 2", file: "", thumbnail: "" },
          { title: "Document 3", file: "", thumbnail: "" }
        ];
        
        if (block.content.displayType === 'list') {
          return (
            <div className="space-y-2">
              {pdfs.map((pdf: any, i: number) => (
                <a 
                  key={i} 
                  href={pdf.file || "#"} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-2 border rounded-md hover:bg-gray-50"
                >
                  <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center mr-3">
                    <span className="text-red-600 text-xs">PDF</span>
                  </div>
                  <span style={{ color: block.styles.textColor }}>{pdf.title}</span>
                </a>
              ))}
            </div>
          );
        } else {
          return (
            <div 
              className="grid grid-cols-3"
              style={{ gap: block.styles.gap || '16px' }}
            >
              {pdfs.map((pdf: any, i: number) => (
                <a 
                  key={i} 
                  href={pdf.file || "#"} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="border rounded-md p-3 hover:bg-gray-50 text-center">
                    <div className="mb-2 h-24 bg-gray-100 flex items-center justify-center rounded-md">
                      {pdf.thumbnail ? (
                        <img
                          src={pdf.thumbnail}
                          alt={pdf.title}
                          className="h-full w-full object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-12 h-16 bg-red-100 rounded flex items-center justify-center">
                          <span className="text-red-600">PDF</span>
                        </div>
                      )}
                    </div>
                    <span style={{ color: block.styles.textColor }}>{pdf.title}</span>
                  </div>
                </a>
              ))}
            </div>
          );
        }

      case 'other details':
        const sections = block.content.sections || [
          { title: "Address", content: "123 Street Name, City, Country" },
          { title: "Phone", content: "+1 234 567 890" },
          { title: "Email", content: "contact@example.com" }
        ];
        
        return (
          <div 
            className="space-y-3"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "transparent",
              color: block.styles.textColor
            }}
          >
            {sections.map((section: any, i: number) => (
              <div key={i} className="pb-2 border-b last:border-b-0 last:pb-0">
                <h4 className="font-medium">{section.title}</h4>
                <p className="text-sm">{section.content}</p>
              </div>
            ))}
          </div>
        );
      
      case 'image + text':
        const layout = block.content.layout || 'image-left';
        
        if (layout === 'image-left' || layout === 'image-right') {
          return (
            <div 
              className="flex items-center"
              style={{ 
                flexDirection: layout === 'image-left' ? 'row' : 'row-reverse',
                gap: block.styles.gap || '24px',
                color: block.styles.textColor
              }}
            >
              <div style={{ width: block.styles.imageWidth || '50%' }}>
                {block.content.image?.src ? (
                  <img 
                    src={block.content.image.src} 
                    alt={block.content.image.alt || ""} 
                    className="w-full rounded-md"
                  />
                ) : (
                  <div className="bg-gray-100 rounded-md flex items-center justify-center h-40 w-full">
                    <span className="text-gray-500">Image Placeholder</span>
                  </div>
                )}
              </div>
              <div style={{ width: block.styles.textWidth || '50%' }}>
                <p>{block.content.text || "Add your text content here."}</p>
              </div>
            </div>
          );
        } else {
          return (
            <div 
              className="flex flex-col"
              style={{ 
                flexDirection: layout === 'image-top' ? 'column' : 'column-reverse',
                gap: block.styles.gap || '24px',
                color: block.styles.textColor
              }}
            >
              <div>
                {block.content.image?.src ? (
                  <img 
                    src={block.content.image.src} 
                    alt={block.content.image.alt || ""} 
                    className="w-full rounded-md"
                  />
                ) : (
                  <div className="bg-gray-100 rounded-md flex items-center justify-center h-40 w-full">
                    <span className="text-gray-500">Image Placeholder</span>
                  </div>
                )}
              </div>
              <div>
                <p>{block.content.text || "Add your text content here."}</p>
              </div>
            </div>
          );
        }

      default:
        return <div>Unknown block type: {block.type}</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative group border border-transparent hover:border-primary-blue p-2 rounded-md my-2"
    >
      <div 
        className="handle absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full p-1 
                   opacity-0 group-hover:opacity-100 transition-opacity cursor-move bg-white 
                   border rounded-l-md"
        {...listeners}
      >
        <div className="flex flex-col">
          <ChevronUp className="h-4 w-4" />
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
      
      <div 
        className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity 
                  flex flex-col gap-1"
      >
        <Button 
          variant="outline" 
          size="icon" 
          className="h-6 w-6 bg-white"
          onClick={onEdit}
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button 
          variant="destructive" 
          size="icon" 
          className="h-6 w-6"
          onClick={onDelete}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
      
      <div 
        style={{ 
          padding: block.styles.padding,
          borderRadius: block.styles.borderRadius,
          backgroundColor: block.styles.backgroundColor !== 'transparent' 
            ? block.styles.backgroundColor 
            : "transparent",
        }}
      >
        {renderBlockContent(block)}
      </div>
    </div>
  );
}

export function PageEditorCanvas({ blocks, onDeleteBlock, onUpdateBlock, openMediaLibrary, pageStyles }: PageEditorCanvasProps) {
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);

  const handleStartEdit = (block: Block) => {
    setEditingBlock(block);
  };
  
  const handleFinishEdit = (blockId: string, content: Record<string, any>, styles: Record<string, any>) => {
    onUpdateBlock(blockId, content, styles);
    setEditingBlock(null);
  };

  return (
    <ScrollArea className="h-full bg-gray-100">
      <div className="py-8 px-4">
        <div 
          className="w-full max-w-md mx-auto min-h-[600px] rounded-lg shadow-sm"
          style={{
            backgroundColor: pageStyles.backgroundColor,
            fontFamily: pageStyles.fontFamily
          }}
        >
          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-center h-[600px]">
              <p className="text-muted-foreground">
                Your landing page is empty. Add blocks from the sidebar.
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-1">
              {blocks.map((block) => (
                <SortableBlock
                  key={block.id}
                  block={block}
                  onDelete={() => onDeleteBlock(block.id)}
                  onEdit={() => handleStartEdit(block)}
                  pageStyles={pageStyles}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {editingBlock && (
        <BlockEditor
          block={editingBlock}
          onSave={handleFinishEdit}
          onCancel={() => setEditingBlock(null)}
        />
      )}
    </ScrollArea>
  );
}
