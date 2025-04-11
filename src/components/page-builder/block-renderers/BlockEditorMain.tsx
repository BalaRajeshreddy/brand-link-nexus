
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

interface BlockEditorMainProps {
  blockType: string;
  content: Record<string, any>;
  styles: Record<string, any>;
}

export const BlockEditorMain = ({ blockType, content, styles }: BlockEditorMainProps) => {
  switch (blockType) {
    case 'heading':
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
    
    case 'text':
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

    case 'heading + text':
      return <HeadingTextBlock content={content} styles={styles} />;
      
    case 'image':
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
    
    case 'images':
      return <ImagesBlock content={content} styles={styles} />;
    
    case 'images + links':
      return <ImagesLinksBlock content={content} styles={styles} />;
    
    case 'video':
      return <VideoBlock content={content} styles={styles} />;
    
    case 'testimonials':
      return <TestimonialsBlock content={content} styles={styles} />;

    case 'smart feedback':
      return <SmartFeedbackBlock content={content} styles={styles} />;

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
      return <SocialLinksBlock content={content} styles={styles} />;

    case 'links':
      return <LinksBlock content={content} styles={styles} />;

    case 'button':
      return <ButtonBlock content={content} styles={styles} />;
    
    case 'form':
      return <FormBlock content={content} styles={styles} />;
    
    case 'contact form':
      // Simplified version of form with predefined fields
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
      return <TeamBlock content={content} styles={styles} />;
    
    case 'products':
      return <ProductsBlock content={content} styles={styles} />;
    
    case 'appointment/calendar':
      return <AppointmentCalendarBlock content={content} styles={styles} />;
    
    case 'business hours':
      return <BusinessHoursBlock content={content} styles={styles} />;
    
    case 'pdf gallery':
      return <PDFGalleryBlock content={content} styles={styles} />;
    
    case 'other details':
      return <OtherDetailsBlock content={content} styles={styles} />;
    
    case 'image + text':
      return <ImageTextBlock content={content} styles={styles} />;
    
    default:
      return <div>Unsupported block type: {blockType}</div>;
  }
};
