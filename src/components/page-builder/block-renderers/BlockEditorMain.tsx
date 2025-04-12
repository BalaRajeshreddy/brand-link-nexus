
import React from 'react';
import {
  AppointmentCalendarBlock,
  SmartFeedbackBlock,
  FormBlock,
  HeadingTextBlock,
  LinksBlock,
  SocialLinksBlock,
  ButtonBlock,
  VideoBlock,
  ImagesBlock,
  ImagesLinksBlock,
  PDFGalleryBlock,
  OtherDetailsBlock,
  BusinessHoursBlock,
  TeamBlock,
  TestimonialsBlock,
  ProductsBlock,
  ImageTextBlock
} from './index';
import { BlockType } from '@/types/block';
import { cn } from '@/lib/utils';

// Define type interfaces for each block content type
export interface BaseBlockContent {
  // Common styling properties
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: string;
  boxShadow?: string;
  width?: string;
  height?: string;
  minHeight?: string;
  maxWidth?: string;
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  lineHeight?: string;
  letterSpacing?: string;
  opacity?: string;
  transform?: string;
  transition?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  display?: string;
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
  gap?: string;
  
  // Common content properties
  title?: string;
  text?: string;
  description?: string;
  heading?: string;
  location?: string;
  image?: {
    url?: string;
    src?: string;
    alt?: string;
  };
  src?: string;
  alt?: string;
  
  styles?: Record<string, any>;
}

export interface HeadingTextContent extends BaseBlockContent {
  heading: string;
  text: string;
}

export interface ImageItem {
  src: string;
  alt?: string;
}

export interface ImageLink extends ImageItem {
  link?: string;
  title?: string;
}

export interface ImagesContent extends BaseBlockContent {
  images: ImageItem[];
  displayType: string;
}

export interface ImagesLinksContent extends BaseBlockContent {
  images: ImageLink[];
  displayType: string;
}

export interface VideoContent extends BaseBlockContent {
  src: string;
  thumbnail?: string;
  provider: string;
}

export interface Testimonial {
  name?: string;
  role?: string;
  text?: string;
  image?: string;
  author?: string;
  content?: string;
}

export interface TestimonialsContent extends BaseBlockContent {
  testimonials: Testimonial[];
  displayType: string;
}

export interface SmartFeedbackContent extends BaseBlockContent {
  question: string;
  options: string[];
  allowComments: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface SocialLinksContent extends BaseBlockContent {
  links: SocialLink[];
  displayType: string;
}

export interface LinkItem {
  text: string;
  url: string;
  icon?: string;
}

export interface LinksContent extends BaseBlockContent {
  links: LinkItem[];
  displayType: string;
}

export interface ButtonContent extends BaseBlockContent {
  text: string;
  url: string;
  style: string;
}

export interface FormField {
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
}

export interface FormContent extends BaseBlockContent {
  fields: FormField[];
  submitText: string;
  submitAction: string;
}

export interface TeamMember {
  name: string;
  role?: string;
  image?: string;
  photo?: string;
  bio?: string;
}

export interface TeamContent extends BaseBlockContent {
  members: TeamMember[];
  displayType: string;
}

export interface Product {
  name: string;
  description?: string;
  price?: string;
  image?: string;
  link?: string;
}

export interface ProductsContent extends BaseBlockContent {
  products: Product[];
  displayType: string;
}

export interface AppointmentCalendarContent extends BaseBlockContent {
  availableDays: string[];
  timeSlots: string[];
  contactRequired: boolean;
}

export interface BusinessHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface BusinessHoursContent extends BaseBlockContent {
  hours: BusinessHour[];
}

export interface PDFItem {
  title: string;
  url?: string;
  file?: string;
  thumbnail?: string;
}

export interface PDFGalleryContent extends BaseBlockContent {
  pdfs: PDFItem[];
  displayType: string;
}

export interface DetailSection {
  title: string;
  content: string;
}

export interface OtherDetailsContent extends BaseBlockContent {
  sections: DetailSection[];
}

export interface ImageTextContent extends BaseBlockContent {
  image: {
    src: string;
    alt: string;
  };
  text: string;
  layout: string;
}

// Union type for all block content types
export type BlockContent = BaseBlockContent;

interface BlockEditorMainProps {
  blockType: string;
  content: BlockContent;
  styles?: Record<string, any>;
}

// Helper function for type checking
const hasProperty = <T extends object, K extends string>(obj: T, prop: K): boolean => {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};

export function BlockEditorMain({ blockType, content, styles = {} }: BlockEditorMainProps) {
  // Helper function to apply styles to a container
  const applyContainerStyles = (additionalClasses?: string) => {
    // Safely access properties with fallbacks
    const containerStyles = {
      backgroundColor: styles.backgroundColor || content?.backgroundColor,
      color: styles.textColor || content?.textColor,
      padding: styles.padding || content?.padding,
      margin: styles.margin || content?.margin,
      borderRadius: styles.borderRadius || content?.borderRadius,
      borderWidth: styles.borderWidth || content?.borderWidth,
      borderColor: styles.borderColor || content?.borderColor,
      borderStyle: styles.borderStyle || content?.borderStyle,
      boxShadow: styles.boxShadow || content?.boxShadow,
      width: styles.width || content?.width,
      height: styles.height || content?.height,
      minHeight: styles.minHeight || content?.minHeight,
      maxWidth: styles.maxWidth || content?.maxWidth,
      fontSize: styles.fontSize || content?.fontSize,
      fontWeight: styles.fontWeight || content?.fontWeight,
      fontFamily: styles.fontFamily || content?.fontFamily,
      lineHeight: styles.lineHeight || content?.lineHeight,
      letterSpacing: styles.letterSpacing || content?.letterSpacing,
      opacity: styles.opacity || content?.opacity,
      transform: styles.transform || content?.transform,
      transition: styles.transition || content?.transition
    };

    const textAlign = styles.textAlign || content?.textAlign;
    const display = styles.display || content?.display;
    const flexDirection = styles.flexDirection || content?.flexDirection || 'col';
    const alignItems = styles.alignItems || content?.alignItems;
    const justifyContent = styles.justifyContent || content?.justifyContent;
    const gap = styles.gap || content?.gap;

    return {
      className: cn(
        'block-container',
        additionalClasses,
        textAlign && `text-${textAlign}`,
        display && `flex flex-${flexDirection}`,
        alignItems && `items-${alignItems}`,
        justifyContent && `justify-${justifyContent}`,
        gap && `gap-${gap}`
      ),
      style: containerStyles
    };
  };

  // Helper function to apply text styles
  const applyTextStyles = (additionalClasses?: string) => {
    const textStyles = {
      color: styles.textColor || content?.textColor,
      fontSize: styles.fontSize || content?.fontSize,
      fontWeight: styles.fontWeight || content?.fontWeight,
      fontFamily: styles.fontFamily || content?.fontFamily,
      lineHeight: styles.lineHeight || content?.lineHeight,
      letterSpacing: styles.letterSpacing || content?.letterSpacing,
      textAlign: styles.textAlign || content?.textAlign
    };

    return {
      className: cn('block-text', additionalClasses),
      style: textStyles
    };
  };

  const renderContent = () => {
    switch (blockType) {
      case BlockType.HEADING:
      case 'heading':
        return (
          <div {...applyContainerStyles()}>
            <h2 {...applyTextStyles('text-2xl font-bold')}>
              {hasProperty(content, 'title') ? content.title : 
               hasProperty(content, 'text') ? content.text : ''}
            </h2>
            {hasProperty(content, 'description') && content.description && (
              <p {...applyTextStyles('text-muted-foreground mt-2')}>
                {content.description}
              </p>
            )}
          </div>
        );

      case BlockType.TEXT:
      case 'text':
        return (
          <div {...applyContainerStyles()}>
            <div {...applyTextStyles()}>
              {hasProperty(content, 'text') ? content.text : ''}
            </div>
          </div>
        );

      case BlockType.IMAGE:
      case 'image':
        return (
          <div {...applyContainerStyles('space-y-4')}>
            {hasProperty(content, 'title') && content.title && (
              <h2 {...applyTextStyles('text-2xl font-bold')}>
                {content.title}
              </h2>
            )}
            {hasProperty(content, 'description') && content.description && (
              <p {...applyTextStyles('text-muted-foreground')}>
                {content.description}
              </p>
            )}
            {(hasProperty(content, 'image') && content.image?.url) || 
             (hasProperty(content, 'src') && content.src) ? (
              <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: styles.aspectRatio || '16/9' }}>
                <img
                  src={hasProperty(content, 'image') ? content.image?.url : content.src}
                  alt={hasProperty(content, 'image') ? content.image?.alt || 'Image' : content.alt || 'Image'}
                  className={cn(
                    'w-full h-full',
                    styles.objectFit && `object-${styles.objectFit}`
                  )}
                />
              </div>
            ) : (
              <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">No image selected</p>
              </div>
            )}
          </div>
        );

      case BlockType.HEADING_TEXT:
      case 'heading + text':
        return (
          <div {...applyContainerStyles('space-y-4')}>
            <h2 {...applyTextStyles('text-2xl font-bold')}>
              {hasProperty(content, 'heading') ? content.heading : 
               hasProperty(content, 'title') ? content.title : ''}
            </h2>
            <div {...applyTextStyles()}>
              {hasProperty(content, 'text') ? content.text : 
               hasProperty(content, 'description') ? content.description : ''}
            </div>
          </div>
        );

      case 'images':
        if (hasProperty(content, 'images') && hasProperty(content, 'displayType')) {
          return <ImagesBlock content={content as any} styles={styles} />;
        }
        return <div>Invalid images content</div>;
      
      case 'images + links':
        if (hasProperty(content, 'images') && hasProperty(content, 'displayType')) {
          return <ImagesLinksBlock content={content as any} styles={styles} />;
        }
        return <div>Invalid images+links content</div>;
      
      case 'video':
        if (hasProperty(content, 'src') && hasProperty(content, 'provider')) {
          return <VideoBlock content={content as any} styles={styles} />;
        }
        return <div>Invalid video content</div>;
      
      case 'testimonials':
        if (hasProperty(content, 'testimonials') && hasProperty(content, 'displayType')) {
          return <TestimonialsBlock content={content as any} styles={styles} />;
        }
        return <div>Invalid testimonials content</div>;

      case 'smart feedback':
        if (hasProperty(content, 'question') && hasProperty(content, 'options')) {
          return <SmartFeedbackBlock content={content as any} styles={styles} />;
        }
        return <div>Invalid smart feedback content</div>;

      case 'map':
        return (
          <div>
            {hasProperty(content, 'location') && content.location && (
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(content.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                style={{
                  width: '100%',
                  height: '400px',
                  border: 'none',
                  borderRadius: styles.borderRadius || '4px',
                }}
                allowFullScreen
                loading="lazy"
                title="Map"
              />
            )}
          </div>
        );
      
      case 'social links':
        if (hasProperty(content, 'links') && hasProperty(content, 'displayType')) {
          return <SocialLinksBlock content={content as any} styles={styles} />;
        }
        return <div>Invalid social links content</div>;

      case 'links':
        if (hasProperty(content, 'links') && hasProperty(content, 'displayType')) {
          return <LinksBlock content={content as any} styles={styles} />;
        }
        return <div>Invalid links content</div>;

      case 'button':
        if (hasProperty(content, 'text') && hasProperty(content, 'url')) {
          return <ButtonBlock content={content as any} styles={styles} />;
        }
        return <div>Invalid button content</div>;
      
      case 'form':
        if (hasProperty(content, 'fields') && hasProperty(content, 'submitText')) {
          return <FormBlock content={content as any} styles={styles} />;
        }
        return <div>Invalid form content</div>;
      
      case 'contact form':
        return (
          <FormBlock 
            content={{
              fields: [
                { type: 'text', label: 'Name', required: true, placeholder: 'Enter your name' },
                { type: 'email', label: 'Email', required: true, placeholder: 'Enter your email' },
                { type: 'textarea', label: 'Message', required: false, placeholder: 'Enter your message' }
              ],
              submitText: 'Send Message',
              submitAction: 'email'
            } as any}
            styles={styles}
          />
        );
      
      case 'team':
        if (hasProperty(content, 'members') && hasProperty(content, 'displayType')) {
          return <TeamBlock content={content as any} styles={styles} />;
        }
        return <div>Invalid team content</div>;
      
      case 'products':
        if (hasProperty(content, 'products') && hasProperty(content, 'displayType')) {
          return <ProductsBlock content={content as any} styles={styles} />;
        }
        return <div>Invalid products content</div>;
      
      case 'appointment/calendar':
        if (hasProperty(content, 'availableDays') && hasProperty(content, 'timeSlots')) {
          return <AppointmentCalendarBlock content={content as any} styles={styles} />;
        }
        return <div>Invalid appointment/calendar content</div>;
      
      case 'business hours':
        if (hasProperty(content, 'hours')) {
          return <BusinessHoursBlock content={content as any} styles={styles} />;
        }
        return <div>Invalid business hours content</div>;
      
      case 'pdf gallery':
        if (hasProperty(content, 'pdfs') && hasProperty(content, 'displayType')) {
          return <PDFGalleryBlock content={content as any} styles={styles} />;
        }
        return <div>Invalid pdf gallery content</div>;
      
      case 'other details':
        if (hasProperty(content, 'sections')) {
          return <OtherDetailsBlock content={content as any} styles={styles} />;
        }
        return <div>Invalid other details content</div>;
      
      case 'image + text':
        if (hasProperty(content, 'image') && hasProperty(content, 'text')) {
          return <ImageTextBlock content={content as any} styles={styles} />;
        }
        return <div>Invalid image + text content</div>;
      
      default:
        return <div>Unsupported block type: {blockType}</div>;
    }
  };

  return (
    <div {...applyContainerStyles('rounded-lg')}>
      {renderContent()}
    </div>
  );
}
