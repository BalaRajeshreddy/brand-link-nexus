
import { ScrollArea } from "@/components/ui/scroll-area";
import { Smartphone } from "lucide-react";
import { Block } from "./PageBuilder";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface PageEditorPreviewProps {
  blocks: Block[];
  pageStyles: {
    backgroundColor: string;
    fontFamily: string;
  };
}

export function PageEditorPreview({ blocks, pageStyles }: PageEditorPreviewProps) {
  const renderBlockContent = (block: Block) => {
    switch (block.type) {
      case 'heading':
        return <h2 
          className="text-xl font-bold" 
          style={{ 
            color: block.styles.textColor,
            fontSize: block.styles.fontSize ? `calc(${block.styles.fontSize} * 0.7)` : undefined,
            textAlign: block.styles.textAlign
          }}
        >
          {block.content.text || "Heading Text"}
        </h2>;
      
      case 'text':
        return <p 
          className="text-sm" 
          style={{ 
            color: block.styles.textColor,
            fontSize: block.styles.fontSize ? `calc(${block.styles.fontSize} * 0.7)` : undefined,
            textAlign: block.styles.textAlign
          }}
        >
          {block.content.text || "Lorem ipsum dolor sit amet..."}
        </p>;
      
      case 'heading + text':
        return (
          <div className="space-y-1">
            <h3 
              className="text-base font-bold" 
              style={{ 
                color: block.styles.textColor,
                fontSize: block.styles.headingSize ? `calc(${block.styles.headingSize} * 0.7)` : undefined,
                textAlign: block.styles.textAlign
              }}
            >
              {block.content.heading || "Heading"}
            </h3>
            <p 
              className="text-xs" 
              style={{ 
                color: block.styles.textColor,
                fontSize: block.styles.textSize ? `calc(${block.styles.textSize} * 0.7)` : undefined,
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
            className="bg-gray-100 rounded-md flex items-center justify-center h-24"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "#f3f4f6"
            }}
          >
            <span className="text-xs text-gray-500">Image</span>
          </div>
        );
      
      case 'images':
        const images = block.content.images || [{ src: "", alt: "" }, { src: "", alt: "" }, { src: "", alt: "" }];
        
        if (block.content.displayType === 'carousel' || block.content.displayType === 'slider') {
          return (
            <div className="w-full relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((image: any, i: number) => (
                    <CarouselItem key={i}>
                      {image.src ? (
                        <img 
                          src={image.src} 
                          alt={image.alt || ""} 
                          className="w-full h-20 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-20 bg-gray-100 rounded-md flex items-center justify-center">
                          <span className="text-[8px] text-gray-500">Image {i+1}</span>
                        </div>
                      )}
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          );
        } else {
          return (
            <div 
              className="grid grid-cols-3 w-full"
              style={{ gap: block.styles.gap ? `calc(${block.styles.gap} * 0.5)` : '8px' }}
            >
              {images.map((image: any, i: number) => (
                <div key={i}>
                  {image.src ? (
                    <img 
                      src={image.src} 
                      alt={image.alt || ""} 
                      className="w-full h-12 object-cover rounded-md"
                      style={{ borderRadius: block.styles.borderRadius ? `calc(${block.styles.borderRadius} * 0.8)` : undefined }}
                    />
                  ) : (
                    <div 
                      className="w-full h-12 bg-gray-100 flex items-center justify-center"
                      style={{ borderRadius: block.styles.borderRadius ? `calc(${block.styles.borderRadius} * 0.8)` : undefined }}
                    >
                      <span className="text-[8px] text-gray-500">{i+1}</span>
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
            <div className="w-full relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {linkedImages.map((image: any, i: number) => (
                    <CarouselItem key={i}>
                      <div className="relative">
                        {image.src ? (
                          <img 
                            src={image.src} 
                            alt={image.alt || ""} 
                            className="w-full h-20 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-full h-20 bg-gray-100 rounded-md flex items-center justify-center">
                            <span className="text-[8px] text-gray-500">{image.title || `Link ${i+1}`}</span>
                          </div>
                        )}
                        {image.title && (
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-md">
                            <span className="text-white text-[8px] font-medium">{image.title}</span>
                          </div>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          );
        } else {
          return (
            <div 
              className="grid grid-cols-2 w-full"
              style={{ gap: block.styles.gap ? `calc(${block.styles.gap} * 0.5)` : '8px' }}
            >
              {linkedImages.map((image: any, i: number) => (
                <div key={i} className="relative">
                  {image.src ? (
                    <img 
                      src={image.src} 
                      alt={image.alt || ""} 
                      className="w-full h-12 object-cover rounded-md"
                      style={{ borderRadius: block.styles.borderRadius ? `calc(${block.styles.borderRadius} * 0.8)` : undefined }}
                    />
                  ) : (
                    <div 
                      className="w-full h-12 bg-gray-100 flex items-center justify-center"
                      style={{ borderRadius: block.styles.borderRadius ? `calc(${block.styles.borderRadius} * 0.8)` : undefined }}
                    >
                      <span className="text-[8px] text-gray-500">{image.title || `Link ${i+1}`}</span>
                    </div>
                  )}
                  {image.title && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-md">
                      <span className="text-white text-[8px] font-medium">{image.title}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        }
      
      case 'video':
        return (
          <div 
            className="bg-gray-100 rounded-md flex items-center justify-center h-24"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "#f3f4f6"
            }}
          >
            <span className="text-xs text-gray-500">Video</span>
          </div>
        );
      
      case 'testimonials':
        const testimonials = block.content.testimonials || [
          { text: "This is a testimonial text.", author: "Customer" }
        ];
        
        if (block.content.displayType === 'carousel') {
          return (
            <div className="w-full relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {testimonials.map((testimonial: any, i: number) => (
                    <CarouselItem key={i}>
                      <div 
                        className="p-2 rounded-md border bg-white text-xs"
                        style={{ 
                          backgroundColor: block.styles.cardBgColor || '#ffffff',
                          borderRadius: block.styles.cardBorderRadius ? `calc(${block.styles.cardBorderRadius} * 0.8)` : '4px'
                        }}
                      >
                        <p 
                          className="italic text-muted-foreground text-[10px]"
                          style={{ color: block.styles.textColor }}
                        >
                          "{testimonial.text}"
                        </p>
                        <p 
                          className="mt-1 font-medium text-[10px]"
                          style={{ color: block.styles.textColor }}
                        >
                          - {testimonial.author}
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          );
        } else if (block.content.displayType === 'quotes') {
          return (
            <div className="space-y-2">
              {testimonials.map((testimonial: any, i: number) => (
                <blockquote 
                  key={i} 
                  className="pl-2 border-l-2 italic text-[10px]"
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
          // Default cards display
          return (
            <div 
              className="space-y-2"
              style={{ gap: block.styles.gap ? `calc(${block.styles.gap} * 0.5)` : '8px' }}
            >
              {testimonials.map((testimonial: any, i: number) => (
                <div 
                  key={i} 
                  className="p-2 rounded-md border bg-white text-xs"
                  style={{ 
                    backgroundColor: block.styles.cardBgColor || '#ffffff',
                    borderRadius: block.styles.cardBorderRadius ? `calc(${block.styles.cardBorderRadius} * 0.8)` : '4px'
                  }}
                >
                  <p 
                    className="italic text-muted-foreground text-[10px]"
                    style={{ color: block.styles.textColor }}
                  >
                    "{testimonial.text}"
                  </p>
                  <p 
                    className="mt-1 font-medium text-[10px]"
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
          <div className="space-y-2 p-2 border rounded-md text-[10px]">
            <h3 className="font-medium" style={{ color: block.styles.textColor }}>
              {block.content.question || "How would you rate our service?"}
            </h3>
            <div className="flex flex-wrap gap-1">
              {(block.content.options || ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"]).slice(0, 3).map((option: string, i: number) => (
                <div 
                  key={i} 
                  className="px-2 py-1 rounded-full bg-gray-100 text-[8px]"
                >
                  {option}
                </div>
              ))}
              {(block.content.options?.length || 0) > 3 && (
                <div className="px-2 py-1 rounded-full bg-gray-100 text-[8px]">
                  +{(block.content.options?.length || 0) - 3} more
                </div>
              )}
            </div>
            {block.content.allowComments && (
              <div className="h-4 bg-gray-100 rounded-md"></div>
            )}
          </div>
        );
      
      case 'map':
        return (
          <div 
            className="bg-gray-100 rounded-md flex items-center justify-center h-24"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "#f3f4f6"
            }}
          >
            <span className="text-xs text-gray-500">{block.content.location || "Map"}</span>
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
              className="flex flex-col gap-1 text-[10px]"
              style={{ 
                backgroundColor: block.styles.backgroundColor !== 'transparent' 
                  ? block.styles.backgroundColor 
                  : "transparent",
                textAlign: block.styles.textAlign
              }}
            >
              {socialLinks.map((link: any, i: number) => (
                <div key={i}>
                  <span style={{ color: block.styles.iconColor || '#3B82F6' }}>
                    {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          );
        } else if (block.content.displayType === 'buttons') {
          return (
            <div 
              className="flex flex-wrap gap-1"
              style={{ 
                justifyContent: block.styles.textAlign === 'center' 
                  ? 'center' 
                  : block.styles.textAlign === 'right' 
                  ? 'flex-end' 
                  : 'flex-start'
              }}
            >
              {socialLinks.map((link: any, i: number) => (
                <div 
                  key={i} 
                  className="px-2 py-1 text-[8px] border rounded-md"
                  style={{ color: block.styles.iconColor || '#3B82F6' }}
                >
                  {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                </div>
              ))}
            </div>
          );
        } else {
          // Default 'icons' display
          return (
            <div 
              className="flex"
              style={{ 
                gap: block.styles.gap ? `calc(${block.styles.gap} * 0.5)` : '8px',
                justifyContent: block.styles.textAlign === 'center' 
                  ? 'center' 
                  : block.styles.textAlign === 'right' 
                  ? 'flex-end' 
                  : 'flex-start'
              }}
            >
              {socialLinks.map((_: any, i: number) => (
                <div key={i} className="w-5 h-5 bg-gray-100 rounded-full"></div>
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
              className="space-y-1 text-[10px]"
              style={{ 
                backgroundColor: block.styles.backgroundColor !== 'transparent' 
                  ? block.styles.backgroundColor 
                  : "transparent",
                textAlign: block.styles.textAlign
              }}
            >
              {links.map((link: any, i: number) => (
                <div key={i}>
                  <span style={{ color: block.styles.iconColor || '#3B82F6' }}>
                    {link.text || `Link ${i+1}`}
                  </span>
                </div>
              ))}
            </div>
          );
        } else if (block.content.displayType === 'pills') {
          return (
            <div 
              className="flex flex-wrap gap-1"
              style={{ 
                justifyContent: block.styles.textAlign === 'center' 
                  ? 'center' 
                  : block.styles.textAlign === 'right' 
                  ? 'flex-end' 
                  : 'flex-start'
              }}
            >
              {links.map((link: any, i: number) => (
                <div 
                  key={i} 
                  className="px-2 py-1 text-[8px] rounded-full bg-gray-100"
                  style={{ color: block.styles.iconColor || '#3B82F6' }}
                >
                  {link.text || `Link ${i+1}`}
                </div>
              ))}
            </div>
          );
        } else {
          // Default 'buttons' display
          return (
            <div 
              className="flex flex-wrap gap-1"
              style={{ 
                justifyContent: block.styles.textAlign === 'center' 
                  ? 'center' 
                  : block.styles.textAlign === 'right' 
                  ? 'flex-end' 
                  : 'flex-start'
              }}
            >
              {links.map((link: any, i: number) => (
                <div 
                  key={i} 
                  className="px-2 py-1 text-[8px] border rounded-md"
                  style={{ color: block.styles.iconColor || '#3B82F6' }}
                >
                  {link.text || `Link ${i+1}`}
                </div>
              ))}
            </div>
          );
        }
      
      case 'buy button':
        const buttonStyle = {
          backgroundColor: block.content.style === 'outline' || block.content.style === 'ghost' || block.content.style === 'link' 
            ? 'transparent' 
            : (block.styles.backgroundColor !== 'transparent' ? block.styles.backgroundColor : '#3B82F6'),
          color: block.content.style === 'outline' || block.content.style === 'ghost' || block.content.style === 'link'
            ? (block.styles.textColor || '#3B82F6')
            : (block.styles.textColor || '#FFFFFF'),
          borderRadius: block.styles.borderRadius ? `calc(${block.styles.borderRadius} * 0.8)` : '4px',
          border: block.content.style === 'outline' ? `1px solid ${block.styles.textColor || '#3B82F6'}` : 'none',
          padding: '6px 12px',
          textDecoration: block.content.style === 'link' ? 'underline' : 'none',
          fontSize: '10px'
        };
        
        return (
          <div 
            style={{ 
              textAlign: block.styles.textAlign,
              backgroundColor: 'transparent'
            }}
          >
            <button style={buttonStyle}>
              {block.content.text || "Buy Now"}
            </button>
          </div>
        );
      
      case 'form':
      case 'contact form':
        const formFields = block.type === 'form' 
          ? (block.content.fields || []).slice(0, 3)
          : (block.content.fields || ['name', 'email', 'message']).slice(0, 3);
        
        return (
          <div 
            className="p-2 rounded-md border text-[10px]"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "#ffffff"
            }}
          >
            <div className="space-y-1">
              {[...Array(formFields.length)].map((_, i) => (
                <div key={i} className="h-3 bg-gray-100 rounded"></div>
              ))}
              <button 
                className="w-full bg-primary text-white text-[10px] py-1 px-2 rounded"
                style={{ 
                  backgroundColor: block.styles.buttonColor || '#3B82F6',
                  color: "#ffffff",
                  borderRadius: block.styles.fieldBorderRadius ? `calc(${block.styles.fieldBorderRadius} * 0.8)` : '2px'
                }}
              >
                {block.content.submitText || "Submit"}
              </button>
            </div>
          </div>
        );
      
      case 'team':
        const members = (block.content.members || []).slice(0, 3);
        
        if (block.content.displayType === 'list') {
          return (
            <ul 
              className="space-y-2 text-[10px]"
              style={{ color: block.styles.textColor }}
            >
              {members.map((member: any, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="font-medium">{member.name || `Team ${i+1}`}</div>
                    <div className="text-[8px] text-muted-foreground">{member.role || "Role"}</div>
                  </div>
                </li>
              ))}
            </ul>
          );
        } else {
          // grid or cards display
          return (
            <div 
              className="grid grid-cols-3 gap-1"
              style={{ gap: block.styles.gap ? `calc(${block.styles.gap} * 0.5)` : '4px' }}
            >
              {members.map((member: any, i: number) => (
                <div 
                  key={i} 
                  className={`text-center text-[10px] ${block.content.displayType === 'cards' ? 'p-1 border rounded-sm' : ''}`}
                  style={{ color: block.styles.textColor }}
                >
                  <div className="w-4 h-4 bg-gray-200 rounded-full mx-auto mb-1"></div>
                  <div className="font-medium text-[8px]">{member.name || `Team ${i+1}`}</div>
                  <div className="text-[6px] text-muted-foreground">{member.role || "Role"}</div>
                </div>
              ))}
            </div>
          );
        }
      
      case 'products':
        const products = (block.content.products || []).slice(0, 3);
        
        if (block.content.displayType === 'carousel') {
          return (
            <div className="w-full relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {products.map((product: any, i: number) => (
                    <CarouselItem key={i}>
                      <div 
                        className="p-2 border rounded-md text-[10px]"
                        style={{ 
                          backgroundColor: block.styles.cardBgColor || '#ffffff',
                          color: block.styles.textColor
                        }}
                      >
                        <div className="w-full h-12 bg-gray-100 rounded-md mb-1"></div>
                        <div className="font-medium">{product.name || `Product ${i+1}`}</div>
                        <div className="text-[8px] line-clamp-1">{product.description || "Description"}</div>
                        <div className="mt-1 flex justify-between items-center">
                          <span className="font-bold">${product.price || "99.99"}</span>
                          <div className="px-1 py-0.5 text-[8px] bg-primary text-white rounded">Buy</div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          );
        } else if (block.content.displayType === 'list') {
          return (
            <div className="space-y-1">
              {products.map((product: any, i: number) => (
                <div 
                  key={i} 
                  className="flex gap-2 p-1 border rounded-md text-[10px]"
                  style={{ 
                    backgroundColor: block.styles.cardBgColor || '#ffffff',
                    color: block.styles.textColor
                  }}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-sm"></div>
                  <div className="flex-1">
                    <div className="font-medium">{product.name || `Product ${i+1}`}</div>
                    <div className="text-[8px]">${product.price || "99.99"}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="px-1 py-0.5 text-[6px] bg-primary text-white rounded">Buy</div>
                  </div>
                </div>
              ))}
            </div>
          );
        } else {
          // Default 'grid' display
          return (
            <div 
              className="grid grid-cols-3 gap-1"
              style={{ gap: block.styles.gap ? `calc(${block.styles.gap} * 0.5)` : '4px' }}
            >
              {products.map((product: any, i: number) => (
                <div 
                  key={i} 
                  className="p-1 border rounded-md text-[10px]"
                  style={{ 
                    backgroundColor: block.styles.cardBgColor || '#ffffff',
                    color: block.styles.textColor
                  }}
                >
                  <div className="w-full h-8 bg-gray-100 rounded-sm mb-1"></div>
                  <div className="font-medium text-[8px]">{product.name || `Product ${i+1}`}</div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[8px]">${product.price || "99.99"}</span>
                    <div className="px-1 text-[6px] border rounded text-center">Buy</div>
                  </div>
                </div>
              ))}
            </div>
          );
        }
      
      case 'appointment/calendar':
        return (
          <div 
            className="p-2 border rounded-md text-[10px]"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "#ffffff",
              color: block.styles.textColor
            }}
          >
            <div className="font-medium mb-1">Book an Appointment</div>
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {['M','T','W','T','F','S','S'].map((day, i) => (
                <div key={i} className="text-center text-[8px] py-1 bg-gray-100">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {(block.content.timeSlots || []).slice(0, 6).map((slot: string, i: number) => (
                <div key={i} className="text-center py-0.5 border rounded text-[8px]">{slot}</div>
              ))}
            </div>
            {block.content.contactRequired && (
              <div className="mt-1 space-y-1 pt-1 border-t">
                <div className="h-3 bg-gray-100 rounded"></div>
                <div className="h-3 bg-gray-100 rounded"></div>
                <div className="py-1 bg-primary text-white rounded text-center text-[8px]">Schedule</div>
              </div>
            )}
          </div>
        );
      
      case 'business hours':
        const hours = (block.content.hours || []).slice(0, 4);
        
        return (
          <div 
            className="p-2 border rounded-md text-[10px]"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "#ffffff",
              color: block.styles.textColor
            }}
          >
            <div className="font-medium mb-1">Business Hours</div>
            <table className="w-full text-[8px]">
              <tbody>
                {hours.map((hour: any, i: number) => (
                  <tr key={i} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-0.5">{hour.day}</td>
                    <td className="py-0.5 text-right">
                      {hour.closed ? 'Closed' : `${hour.open} - ${hour.close}`}
                    </td>
                  </tr>
                ))}
                {(block.content.hours?.length || 0) > 4 && (
                  <tr>
                    <td colSpan={2} className="text-center py-0.5 text-[8px]">+{(block.content.hours?.length || 0) - 4} more days</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      
      case 'pdf gallery':
        const pdfs = (block.content.pdfs || []).slice(0, 4);
        
        if (block.content.displayType === 'list') {
          return (
            <div className="space-y-1 text-[10px]">
              {pdfs.map((pdf: any, i: number) => (
                <div key={i} className="flex items-center p-1 border rounded-md">
                  <div className="w-3 h-3 bg-red-100 rounded flex items-center justify-center mr-1">
                    <span className="text-red-600 text-[6px]">PDF</span>
                  </div>
                  <span style={{ color: block.styles.textColor }} className="text-[8px]">{pdf.title || `Document ${i+1}`}</span>
                </div>
              ))}
            </div>
          );
        } else {
          // Default 'grid' display
          return (
            <div 
              className="grid grid-cols-2 gap-1"
              style={{ gap: block.styles.gap ? `calc(${block.styles.gap} * 0.5)` : '4px' }}
            >
              {pdfs.map((pdf: any, i: number) => (
                <div key={i} className="border rounded-md p-1 text-center">
                  <div className="h-8 bg-gray-100 flex items-center justify-center rounded-sm mb-1">
                    <div className="w-4 h-5 bg-red-100 rounded flex items-center justify-center">
                      <span className="text-red-600 text-[6px]">PDF</span>
                    </div>
                  </div>
                  <span style={{ color: block.styles.textColor }} className="text-[8px]">{pdf.title || `Document ${i+1}`}</span>
                </div>
              ))}
            </div>
          );
        }
      
      case 'other details':
        const sections = (block.content.sections || []).slice(0, 3);
        
        return (
          <div 
            className="space-y-1 text-[10px]"
            style={{ 
              backgroundColor: block.styles.backgroundColor !== 'transparent' 
                ? block.styles.backgroundColor 
                : "transparent",
              color: block.styles.textColor
            }}
          >
            {sections.map((section: any, i: number) => (
              <div key={i} className="pb-1 border-b border-gray-100 last:border-b-0">
                <div className="font-medium">{section.title || `Section ${i+1}`}</div>
                <div className="text-[8px]">{section.content || "Content"}</div>
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
                gap: block.styles.gap ? `calc(${block.styles.gap} * 0.5)` : '12px',
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
                  <div className="bg-gray-100 rounded-md flex items-center justify-center h-16 w-full">
                    <span className="text-[8px] text-gray-500">Image</span>
                  </div>
                )}
              </div>
              <div style={{ width: block.styles.textWidth || '50%' }}>
                <p className="text-[10px]">{block.content.text || "Add your text content here."}</p>
              </div>
            </div>
          );
        } else {
          // image-top or image-bottom
          return (
            <div 
              className="flex flex-col"
              style={{ 
                flexDirection: layout === 'image-top' ? 'column' : 'column-reverse',
                gap: block.styles.gap ? `calc(${block.styles.gap} * 0.5)` : '12px',
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
                  <div className="bg-gray-100 rounded-md flex items-center justify-center h-16 w-full">
                    <span className="text-[8px] text-gray-500">Image</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-[10px]">{block.content.text || "Add your text content here."}</p>
              </div>
            </div>
          );
        }

      default:
        return <div className="text-[10px]">Unknown block type</div>;
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="text-center mb-4">
        <h3 className="font-medium flex items-center justify-center gap-2">
          <Smartphone className="h-4 w-4" />
          Mobile Preview
        </h3>
      </div>
      
      <div className="flex-1 mx-auto w-64 border-8 border-gray-800 rounded-3xl overflow-hidden shadow-lg">
        <div className="h-4 bg-gray-800"></div>
        <ScrollArea 
          className="h-full"
          style={{
            backgroundColor: pageStyles.backgroundColor,
            fontFamily: pageStyles.fontFamily
          }}
        >
          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-4 text-center h-full">
              <p className="text-muted-foreground text-xs">
                Add blocks to preview
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {blocks.map((block) => (
                <div 
                  key={block.id} 
                  className="p-1"
                  style={{ 
                    padding: block.styles.padding ? `calc(${block.styles.padding} * 0.5)` : undefined,
                    borderRadius: block.styles.borderRadius ? `calc(${block.styles.borderRadius} * 0.8)` : undefined,
                  }}
                >
                  {renderBlockContent(block)}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
