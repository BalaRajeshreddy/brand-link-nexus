
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
export type BlockContent = 
  | HeadingTextContent
  | ImageItem
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
  | ImageTextContent
  | Record<string, any>;

interface BlockEditorMainProps {
  blockType: string;
  content: BlockContent;
  styles?: Record<string, any>;
}

// Helper function to check if content matches a specific interface
function isHeadingTextContent(content: BlockContent): content is HeadingTextContent {
  return 'heading' in content && 'text' in content;
}

function isImagesContent(content: BlockContent): content is ImagesContent {
  return 'images' in content && 'displayType' in content && 
    Array.isArray((content as ImagesContent).images);
}

function isImagesLinksContent(content: BlockContent): content is ImagesLinksContent {
  return 'images' in content && 'displayType' in content && 
    Array.isArray((content as ImagesLinksContent).images);
}

function isVideoContent(content: BlockContent): content is VideoContent {
  return 'src' in content && 'provider' in content;
}

function isTestimonialsContent(content: BlockContent): content is TestimonialsContent {
  return 'testimonials' in content && 'displayType' in content;
}

function isSmartFeedbackContent(content: BlockContent): content is SmartFeedbackContent {
  return 'question' in content && 'options' in content && 'allowComments' in content;
}

function isSocialLinksContent(content: BlockContent): content is SocialLinksContent {
  return 'links' in content && 'displayType' in content;
}

function isLinksContent(content: BlockContent): content is LinksContent {
  return 'links' in content && 'displayType' in content;
}

function isButtonContent(content: BlockContent): content is ButtonContent {
  return 'text' in content && 'url' in content && 'style' in content;
}

function isFormContent(content: BlockContent): content is FormContent {
  return 'fields' in content && 'submitText' in content;
}

function isTeamContent(content: BlockContent): content is TeamContent {
  return 'members' in content && 'displayType' in content;
}

function isProductsContent(content: BlockContent): content is ProductsContent {
  return 'products' in content && 'displayType' in content;
}

function isAppointmentCalendarContent(content: BlockContent): content is AppointmentCalendarContent {
  return 'availableDays' in content && 'timeSlots' in content;
}

function isBusinessHoursContent(content: BlockContent): content is BusinessHoursContent {
  return 'hours' in content;
}

function isPDFGalleryContent(content: BlockContent): content is PDFGalleryContent {
  return 'pdfs' in content && 'displayType' in content;
}

function isOtherDetailsContent(content: BlockContent): content is OtherDetailsContent {
  return 'sections' in content;
}

function isImageTextContent(content: BlockContent): content is ImageTextContent {
  return 'image' in content && 'text' in content && 'layout' in content;
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
      case 'heading':
        return (
          <div {...applyContainerStyles()}>
            <h2 {...applyTextStyles('text-2xl font-bold')}>
              {content.title || content.text}
            </h2>
            {content.description && (
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
              {content.text}
            </div>
          </div>
        );

      case BlockType.IMAGE:
      case 'image':
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
            {(content.image?.url || content.src) ? (
              <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: styles.aspectRatio || '16/9' }}>
                <img
                  src={content.image?.url || content.src}
                  alt={content.image?.alt || content.alt || 'Image'}
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
        if (isHeadingTextContent(content)) {
          return <HeadingTextBlock content={content} styles={styles} />;
        }
        return (
          <div {...applyContainerStyles('space-y-4')}>
            <h2 {...applyTextStyles('text-2xl font-bold')}>
              {content.heading || content.title}
            </h2>
            <div {...applyTextStyles()}>
              {content.text || content.description}
            </div>
          </div>
        );

      case 'images':
        if (isImagesContent(content)) {
          return <ImagesBlock content={content} styles={styles} />;
        }
        return <div>Invalid images content</div>;
      
      case 'images + links':
        if (isImagesLinksContent(content)) {
          return <ImagesLinksBlock content={content} styles={styles} />;
        }
        return <div>Invalid images+links content</div>;
      
      case 'video':
        if (isVideoContent(content)) {
          return <VideoBlock content={content} styles={styles} />;
        }
        return <div>Invalid video content</div>;
      
      case 'testimonials':
        if (isTestimonialsContent(content)) {
          return <TestimonialsBlock content={content} styles={styles} />;
        }
        return <div>Invalid testimonials content</div>;

      case 'smart feedback':
        if (isSmartFeedbackContent(content)) {
          return <SmartFeedbackBlock content={content} styles={styles} />;
        }
        return <div>Invalid smart feedback content</div>;

      case 'map':
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
      
      case 'social links':
        if (isSocialLinksContent(content)) {
          return <SocialLinksBlock content={content} styles={styles} />;
        }
        return <div>Invalid social links content</div>;

      case 'links':
        if (isLinksContent(content)) {
          return <LinksBlock content={content} styles={styles} />;
        }
        return <div>Invalid links content</div>;

      case 'button':
        if (isButtonContent(content)) {
          return <ButtonBlock content={content} styles={styles} />;
        }
        return <div>Invalid button content</div>;
      
      case 'form':
        if (isFormContent(content)) {
          return <FormBlock content={content} styles={styles} />;
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
            }}
            styles={styles}
          />
        );
      
      case 'team':
        if (isTeamContent(content)) {
          return <TeamBlock content={content} styles={styles} />;
        }
        return <div>Invalid team content</div>;
      
      case 'products':
        if (isProductsContent(content)) {
          return <ProductsBlock content={content} styles={styles} />;
        }
        return <div>Invalid products content</div>;
      
      case 'appointment/calendar':
        if (isAppointmentCalendarContent(content)) {
          return <AppointmentCalendarBlock content={content} styles={styles} />;
        }
        return <div>Invalid appointment/calendar content</div>;
      
      case 'business hours':
        if (isBusinessHoursContent(content)) {
          return <BusinessHoursBlock content={content} styles={styles} />;
        }
        return <div>Invalid business hours content</div>;
      
      case 'pdf gallery':
        if (isPDFGalleryContent(content)) {
          return <PDFGalleryBlock content={content} styles={styles} />;
        }
        return <div>Invalid pdf gallery content</div>;
      
      case 'other details':
        if (isOtherDetailsContent(content)) {
          return <OtherDetailsBlock content={content} styles={styles} />;
        }
        return <div>Invalid other details content</div>;
      
      case 'image + text':
        if (isImageTextContent(content)) {
          return <ImageTextBlock content={content} styles={styles} />;
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
