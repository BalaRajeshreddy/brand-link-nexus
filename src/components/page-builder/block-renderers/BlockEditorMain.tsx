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
import { BlockType, BlockContent, BlockStyles } from '@/types/block';
import { cn } from '@/lib/utils';

export interface BaseBlockContent {
  styles?: Record<string, any>;
}

export interface HeadingTextContent extends BaseBlockContent {
  heading: string;
  text: string;
}

export interface ImageContent extends BaseBlockContent {
  src: string;
  alt?: string;
}

export interface ImagesContent extends BaseBlockContent {
  images: Array<{
    src: string;
    alt?: string;
  }>;
  displayType: string;
}

export interface ImagesLinksContent extends BaseBlockContent {
  images: Array<{
    src: string;
    alt?: string;
    link?: string;
  }>;
  displayType: string;
}

export interface VideoContent extends BaseBlockContent {
  src: string;
  thumbnail?: string;
  provider: string;
}

export interface TestimonialsContent extends BaseBlockContent {
  testimonials: Array<{
    name: string;
    role?: string;
    text: string;
    image?: string;
  }>;
  displayType: string;
}

export interface SmartFeedbackContent extends BaseBlockContent {
  question: string;
  options: string[];
  allowComments: boolean;
}

export interface SocialLinksContent extends BaseBlockContent {
  links: Array<{
    platform: string;
    url: string;
  }>;
  displayType: string;
}

export interface LinksContent extends BaseBlockContent {
  links: Array<{
    text: string;
    url: string;
  }>;
  displayType: string;
}

export interface ButtonContent extends BaseBlockContent {
  text: string;
  url: string;
  style: string;
}

export interface FormContent extends BaseBlockContent {
  fields: Array<{
    type: string;
    label: string;
    required: boolean;
    placeholder?: string;
  }>;
  submitText: string;
  submitAction: string;
}

export interface TeamContent extends BaseBlockContent {
  members: Array<{
    name: string;
    role: string;
    image?: string;
    bio?: string;
  }>;
  displayType: string;
}

export interface ProductsContent extends BaseBlockContent {
  products: Array<{
    name: string;
    description?: string;
    price?: string;
    image?: string;
  }>;
  displayType: string;
}

export interface AppointmentCalendarContent extends BaseBlockContent {
  availableDays: string[];
  timeSlots: string[];
  contactRequired: boolean;
}

export interface BusinessHoursContent extends BaseBlockContent {
  hours: Array<{
    day: string;
    open: string;
    close: string;
    closed: boolean;
  }>;
}

export interface PDFGalleryContent extends BaseBlockContent {
  pdfs: Array<{
    title: string;
    url: string;
    thumbnail?: string;
  }>;
  displayType: string;
}

export interface OtherDetailsContent extends BaseBlockContent {
  sections: Array<{
    title: string;
    content: string;
  }>;
}

export interface ImageTextContent extends BaseBlockContent {
  image: {
    src: string;
    alt: string;
  };
  text: string;
  layout: string;
}

export type BlockContent = 
  | HeadingTextContent
  | ImageContent
  | ImagesContent
  | ImagesLinksContent
  | VideoContent
  | TestimonialsContent
  | SmartFeedbackContent
  | SocialLinksContent
  | LinksContent
  | ButtonContent
  | FormContent
  | TeamContent
  | ProductsContent
  | AppointmentCalendarContent
  | BusinessHoursContent
  | PDFGalleryContent
  | OtherDetailsContent
  | ImageTextContent;

interface BlockEditorMainProps {
  blockType: BlockType;
  content: BlockContent;
  styles?: BlockStyles;
}

export function BlockEditorMain({ blockType, content, styles = {} }: BlockEditorMainProps) {
  // Helper function to apply styles to a container
  const applyContainerStyles = (additionalClasses?: string) => {
    const containerStyles = {
      backgroundColor: styles.backgroundColor || content.backgroundColor,
      color: styles.textColor || content.textColor,
      padding: styles.padding || content.padding,
      margin: styles.margin || content.margin,
      borderRadius: styles.borderRadius || content.borderRadius,
      borderWidth: styles.borderWidth || content.borderWidth,
      borderColor: styles.borderColor || content.borderColor,
      borderStyle: styles.borderStyle || content.borderStyle,
      boxShadow: styles.boxShadow || content.boxShadow,
      width: styles.width || content.width,
      height: styles.height || content.height,
      minHeight: styles.minHeight || content.minHeight,
      maxWidth: styles.maxWidth || content.maxWidth,
      fontSize: styles.fontSize || content.fontSize,
      fontWeight: styles.fontWeight || content.fontWeight,
      fontFamily: styles.fontFamily || content.fontFamily,
      lineHeight: styles.lineHeight || content.lineHeight,
      letterSpacing: styles.letterSpacing || content.letterSpacing,
      opacity: styles.opacity || content.opacity,
      transform: styles.transform || content.transform,
      transition: styles.transition || content.transition
    };

    return {
      className: cn(
        'block-container',
        additionalClasses,
        (styles.textAlign || content.textAlign) && `text-${styles.textAlign || content.textAlign}`,
        (styles.display || content.display) && `flex flex-${styles.flexDirection || content.flexDirection || 'col'}`,
        (styles.alignItems || content.alignItems) && `items-${styles.alignItems || content.alignItems}`,
        (styles.justifyContent || content.justifyContent) && `justify-${styles.justifyContent || content.justifyContent}`,
        (styles.gap || content.gap) && `gap-${styles.gap || content.gap}`
      ),
      style: containerStyles
    };
  };

  // Helper function to apply text styles
  const applyTextStyles = (additionalClasses?: string) => {
    const textStyles = {
      color: styles.textColor || content.textColor,
      fontSize: styles.fontSize || content.fontSize,
      fontWeight: styles.fontWeight || content.fontWeight,
      fontFamily: styles.fontFamily || content.fontFamily,
      lineHeight: styles.lineHeight || content.lineHeight,
      letterSpacing: styles.letterSpacing || content.letterSpacing,
      textAlign: styles.textAlign || content.textAlign
    };

    return {
      className: cn('block-text', additionalClasses),
      style: textStyles
    };
  };

  const renderContent = () => {
    switch (blockType) {
      case BlockType.HEADING:
        return (
          <div {...applyContainerStyles()}>
            <h2 {...applyTextStyles('text-2xl font-bold')}>
              {content.title}
            </h2>
            {content.description && (
              <p {...applyTextStyles('text-muted-foreground mt-2')}>
                {content.description}
              </p>
            )}
          </div>
        );

      case BlockType.TEXT:
        return (
          <div {...applyContainerStyles()}>
            <div {...applyTextStyles()}>
              {content.text}
            </div>
          </div>
        );

      case BlockType.IMAGE:
        return (
          <div {...applyContainerStyles('space-y-4')}>
            {content.title && (
              <h2 {...applyTextStyles('text-2xl font-bold')}>
                {content.title}
              </h2>
            )}
            {content.description && (
              <p {...applyTextStyles('text-muted-foreground')}>
                {content.description}
              </p>
            )}
            {content.image?.url ? (
              <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: styles.aspectRatio || '16/9' }}>
                <img
                  src={content.image.url}
                  alt={content.image.alt || 'Image'}
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

      case BlockType.IMAGE_TEXT:
        return (
          <div {...applyContainerStyles(cn(
            'gap-8',
            content.imagePosition === 'left' && 'flex-row',
            content.imagePosition === 'right' && 'flex-row-reverse',
            content.imagePosition === 'top' && 'flex-col',
            content.imagePosition === 'bottom' && 'flex-col-reverse'
          ))}>
            <div className="flex-1 space-y-4">
              {content.title && (
                <h2 {...applyTextStyles('text-2xl font-bold')}>
                  {content.title}
                </h2>
              )}
              {content.description && (
                <p {...applyTextStyles('text-muted-foreground')}>
                  {content.description}
                </p>
              )}
            </div>
            {content.image?.url ? (
              <div className="flex-1 relative rounded-lg overflow-hidden" style={{ aspectRatio: styles.aspectRatio || '16/9' }}>
                <img
                  src={content.image.url}
                  alt={content.image.alt || 'Image'}
                  className={cn(
                    'w-full h-full',
                    styles.objectFit && `object-${styles.objectFit}`
                  )}
                />
              </div>
            ) : (
              <div className="flex-1 aspect-video rounded-lg bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">No image selected</p>
              </div>
            )}
          </div>
        );

      case 'heading':
        if ('text' in content) {
          return (
            <h2 
              style={{
                fontSize: styles.fontSize || '32px',
                fontWeight: styles.fontWeight || 'bold',
                color: styles.textColor || '#000000',
                textAlign: styles.textAlign || 'left',
              }}
            >
              {content.text}
            </h2>
          );
        }
        return null;
      
      case 'text':
        if ('text' in content) {
          return (
            <div 
              style={{
                fontSize: styles.fontSize || '16px',
                color: styles.textColor || '#000000',
                textAlign: styles.textAlign || 'left',
              }}
            >
              {content.text}
            </div>
          );
        }
        return null;

      case 'heading + text':
        if ('heading' in content && 'text' in content) {
          return <HeadingTextBlock content={content} styles={styles} />;
        }
        return null;
        
      case 'image':
        if ('src' in content) {
          return (
            <div>
              {content.src ? (
                <img 
                  src={content.src} 
                  alt={content.alt || 'Image'} 
                  style={{
                    maxWidth: '100%',
                    borderRadius: styles.borderRadius || '4px',
                  }}
                />
              ) : (
                <div 
                  style={{
                    width: '100%',
                    height: '200px',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: styles.borderRadius || '4px',
                  }}
                >
                  <span className="text-muted-foreground">No image selected</span>
                </div>
              )}
            </div>
          );
        }
        return null;
      
      case 'images':
        if ('images' in content && 'displayType' in content) {
          return <ImagesBlock content={content} styles={styles} />;
        }
        return null;
      
      case 'images + links':
        if ('images' in content && 'displayType' in content) {
          return <ImagesLinksBlock content={content} styles={styles} />;
        }
        return null;
      
      case 'video':
        if ('src' in content && 'provider' in content) {
          return <VideoBlock content={content} styles={styles} />;
        }
        return null;
      
      case 'testimonials':
        if ('testimonials' in content && 'displayType' in content) {
          return <TestimonialsBlock content={content} styles={styles} />;
        }
        return null;

      case 'smart feedback':
        if ('question' in content && 'options' in content) {
          return <SmartFeedbackBlock content={content} styles={styles} />;
        }
        return null;

      case 'map':
        if ('location' in content) {
          return (
            <div>
              {content.location && (
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
        }
        return null;
      
      case 'social links':
        if ('links' in content && 'displayType' in content) {
          return <SocialLinksBlock content={content} styles={styles} />;
        }
        return null;

      case 'links':
        if ('links' in content && 'displayType' in content) {
          return <LinksBlock content={content} styles={styles} />;
        }
        return null;

      case 'button':
        if ('text' in content && 'url' in content) {
          return <ButtonBlock content={content} styles={styles} />;
        }
        return null;
      
      case 'form':
        if ('fields' in content && 'submitText' in content) {
          return <FormBlock content={content} styles={styles} />;
        }
        return null;
      
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
            }}
            styles={styles}
          />
        );
      
      case 'team':
        if ('members' in content && 'displayType' in content) {
          return <TeamBlock content={content} styles={styles} />;
        }
        return null;
      
      case 'products':
        if ('products' in content && 'displayType' in content) {
          return <ProductsBlock content={content} styles={styles} />;
        }
        return null;
      
      case 'appointment/calendar':
        if ('availableDays' in content && 'timeSlots' in content) {
          return <AppointmentCalendarBlock content={content} styles={styles} />;
        }
        return null;
      
      case 'business hours':
        if ('hours' in content) {
          return <BusinessHoursBlock content={content} styles={styles} />;
        }
        return null;
      
      case 'pdf gallery':
        if ('pdfs' in content && 'displayType' in content) {
          return <PDFGalleryBlock content={content} styles={styles} />;
        }
        return null;
      
      case 'other details':
        if ('sections' in content) {
          return <OtherDetailsBlock content={content} styles={styles} />;
        }
        return null;
      
      case 'image + text':
        if ('image' in content && 'text' in content) {
          return <ImageTextBlock content={content} styles={styles} />;
        }
        return null;
      
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
